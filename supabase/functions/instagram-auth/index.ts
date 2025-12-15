import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, redirectUri } = await req.json()

    if (!userId) {
      throw new Error("userId est requis")
    }

    const FB_APP_ID = Deno.env.get('FACEBOOK_APP_ID')?.trim()
    
    if (!FB_APP_ID) {
      throw new Error("FACEBOOK_APP_ID non configuré")
    }

    // URL de callback - doit être configurée dans Facebook Developer
    const callbackUrl = redirectUri || `${Deno.env.get('SUPABASE_URL')}/functions/v1/instagram-callback`
    
    // Permissions nécessaires pour publier sur Instagram
    const scopes = [
      'instagram_basic',
      'instagram_content_publish', 
      'pages_show_list',
      'pages_read_engagement',
      'business_management'
    ].join(',')

    // Construire l'URL OAuth Facebook
    const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
    authUrl.searchParams.set('client_id', FB_APP_ID)
    authUrl.searchParams.set('redirect_uri', callbackUrl)
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('state', userId) // On passe le userId dans state pour le récupérer au callback

    return new Response(
      JSON.stringify({ 
        success: true, 
        authUrl: authUrl.toString() 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
