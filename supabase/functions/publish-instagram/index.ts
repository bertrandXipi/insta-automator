import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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
    const { postId, imageUrl, caption, userId } = await req.json()

    let IG_USER_ID: string
    let ACCESS_TOKEN: string

    // Si userId fourni, essayer de récupérer les credentials depuis la DB
    let foundInDb = false
    if (userId) {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
      const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)
      
      const { data, error } = await supabase
        .from('instagram_accounts')
        .select('ig_user_id, access_token, token_expires_at')
        .eq('user_id', userId)
        .single()

      if (!error && data) {
        // Vérifier si le token est expiré
        if (data.token_expires_at && new Date(data.token_expires_at) < new Date()) {
          console.log('Token DB expiré, fallback sur env vars')
        } else {
          IG_USER_ID = data.ig_user_id
          ACCESS_TOKEN = data.access_token
          foundInDb = true
          console.log(`Using credentials from DB for user ${userId}`)
        }
      }
    }
    
    // Fallback: utiliser les variables d'environnement
    if (!foundInDb) {
      IG_USER_ID = Deno.env.get('INSTAGRAM_USER_ID')?.trim()
      ACCESS_TOKEN = Deno.env.get('INSTAGRAM_TOKEN')?.trim()

      if (!IG_USER_ID || !ACCESS_TOKEN) {
        throw new Error("Configuration Serveur manquante : INSTAGRAM_USER_ID ou INSTAGRAM_TOKEN non définis.")
      }
      
      console.log(`Using credentials from env vars (fallback)`)
      console.log(`IG_USER_ID: ${IG_USER_ID}`)
      console.log(`ACCESS_TOKEN starts with: ${ACCESS_TOKEN?.substring(0, 20)}...`)
      console.log(`ACCESS_TOKEN ends with: ...${ACCESS_TOKEN?.substring(ACCESS_TOKEN.length - 20)}`)
      console.log(`ACCESS_TOKEN length: ${ACCESS_TOKEN?.length}`)
    }

    console.log(`Tentative de publication pour le post ${postId}...`)

    // Étape A : Création du conteneur média sur Instagram
    const containerUrl = `https://graph.facebook.com/v21.0/${IG_USER_ID}/media`
    const containerParams = new URLSearchParams({
        image_url: imageUrl,
        caption: caption,
        access_token: ACCESS_TOKEN
    })

    const containerRes = await fetch(`${containerUrl}?${containerParams}`, { method: 'POST' })
    const containerData = await containerRes.json()

    if (containerData.error) {
       console.error("Erreur Container Instagram:", containerData.error)
       throw new Error(`Erreur Instagram (Container): ${containerData.error.message}`)
    }

    const creationId = containerData.id
    console.log(`Conteneur créé avec succès : ${creationId}`)

    // Attendre que le média soit prêt (Instagram a besoin de temps pour traiter l'image)
    console.log('Attente du traitement de l\'image par Instagram...')
    await new Promise(resolve => setTimeout(resolve, 5000)) // 5 secondes

    // Étape B : Publication effective du conteneur
    const publishUrl = `https://graph.facebook.com/v21.0/${IG_USER_ID}/media_publish`
    const publishParams = new URLSearchParams({
        creation_id: creationId,
        access_token: ACCESS_TOKEN
    })

    const publishRes = await fetch(`${publishUrl}?${publishParams}`, { method: 'POST' })
    const publishData = await publishRes.json()

    if (publishData.error) {
       console.error("Erreur Publish Instagram:", publishData.error)
       throw new Error(`Erreur Instagram (Publish): ${publishData.error.message}`)
    }

    console.log(`Post publié avec succès ! ID: ${publishData.id}`)

    return new Response(
      JSON.stringify({ success: true, instagram_post_id: publishData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
