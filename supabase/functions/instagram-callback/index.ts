import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: any;

serve(async (req) => {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const stateUserId = url.searchParams.get('state') // userId passé via state
    const userId = stateUserId || 'default-user' // Fallback si state pas récupéré
    const error = url.searchParams.get('error')
    
    console.log('Callback received - state:', stateUserId, 'userId:', userId)

    // URL de redirection après le flow (ton app frontend)
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:3000'

    if (error) {
      console.error('OAuth error:', error)
      return Response.redirect(`${frontendUrl}?instagram_error=${error}`)
    }

    if (!code || !userId) {
      return Response.redirect(`${frontendUrl}?instagram_error=missing_params`)
    }

    const FB_APP_ID = Deno.env.get('FACEBOOK_APP_ID')?.trim()
    const FB_APP_SECRET = Deno.env.get('FACEBOOK_APP_SECRET')?.trim()
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!FB_APP_ID || !FB_APP_SECRET) {
      throw new Error("Facebook credentials not configured")
    }

    const callbackUrl = `${SUPABASE_URL}/functions/v1/instagram-callback`

    // 1. Échanger le code contre un short-lived token
    console.log('Exchanging code for short-lived token...')
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${FB_APP_ID}&` +
      `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
      `client_secret=${FB_APP_SECRET}&` +
      `code=${code}`
    )
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData.error)
      return Response.redirect(`${frontendUrl}?instagram_error=token_exchange_failed`)
    }

    const shortLivedToken = tokenData.access_token

    // 2. Échanger contre un long-lived token (60 jours)
    console.log('Exchanging for long-lived token...')
    const longLivedRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${FB_APP_ID}&` +
      `client_secret=${FB_APP_SECRET}&` +
      `fb_exchange_token=${shortLivedToken}`
    )
    const longLivedData = await longLivedRes.json()

    if (longLivedData.error) {
      console.error('Long-lived token error:', longLivedData.error)
      return Response.redirect(`${frontendUrl}?instagram_error=long_lived_token_failed`)
    }

    const accessToken = longLivedData.access_token
    const expiresIn = longLivedData.expires_in || 5184000 // 60 jours par défaut

    // 3. Récupérer les pages Facebook de l'utilisateur
    console.log('Fetching Facebook pages...')
    const pagesRes = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    )
    const pagesData = await pagesRes.json()

    if (!pagesData.data || pagesData.data.length === 0) {
      console.error('No Facebook pages found')
      return Response.redirect(`${frontendUrl}?instagram_error=no_facebook_pages`)
    }

    // Prendre la première page (ou tu peux implémenter une sélection)
    const page = pagesData.data[0]
    const pageAccessToken = page.access_token

    // 4. Récupérer le compte Instagram Business lié à la page
    console.log('Fetching Instagram Business account...')
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`
    )
    const igAccountData = await igAccountRes.json()

    if (!igAccountData.instagram_business_account) {
      console.error('No Instagram Business account linked')
      return Response.redirect(`${frontendUrl}?instagram_error=no_instagram_business`)
    }

    const igUserId = igAccountData.instagram_business_account.id

    // 5. Récupérer le username Instagram
    console.log('Fetching Instagram username...')
    const igUserRes = await fetch(
      `https://graph.facebook.com/v18.0/${igUserId}?fields=username&access_token=${pageAccessToken}`
    )
    const igUserData = await igUserRes.json()
    const igUsername = igUserData.username || 'unknown'

    // 6. Sauvegarder dans Supabase
    console.log('Saving to database...')
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)
    
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    const { error: dbError } = await supabase
      .from('instagram_accounts')
      .upsert({
        user_id: userId,
        ig_user_id: igUserId,
        access_token: pageAccessToken, // On utilise le page access token pour Instagram
        token_expires_at: expiresAt,
        ig_username: igUsername,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return Response.redirect(`${frontendUrl}?instagram_error=database_error`)
    }

    console.log(`Successfully connected Instagram account @${igUsername} for user ${userId}`)
    
    // Rediriger vers le frontend avec succès
    return Response.redirect(`${frontendUrl}?instagram_connected=true&username=${igUsername}`)

  } catch (error: any) {
    console.error('Callback error:', error)
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:3000'
    return Response.redirect(`${frontendUrl}?instagram_error=${encodeURIComponent(error.message)}`)
  }
})
