import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Fix: Declare Deno to avoid TypeScript errors when Deno types are not loaded globally
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Gestion des CORS (Cross-Origin Resource Sharing) pour autoriser l'app Web à appeler cette fonction
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Récupération des données envoyées par l'App React
    const { postId, imageUrl, caption } = await req.json()

    // 3. Récupération sécurisée des Clés API (Stockées dans Supabase > Settings > Edge Functions)
    // NE JAMAIS METTRE CES CLES EN DUR DANS LE CODE
    const IG_USER_ID = Deno.env.get('IG_USER_ID')
    const ACCESS_TOKEN = Deno.env.get('IG_ACCESS_TOKEN')

    if (!IG_USER_ID || !ACCESS_TOKEN) {
       throw new Error("Configuration Serveur manquante : IG_USER_ID ou IG_ACCESS_TOKEN non définis.")
    }

    console.log(`Tentative de publication pour le post ${postId}...`)

    // 4. Étape A : Création du conteneur média sur Instagram
    // L'URL de l'image doit être publique et accessible par les serveurs de Facebook
    const containerUrl = `https://graph.facebook.com/v18.0/${IG_USER_ID}/media`
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

    // 5. Étape B : Publication effective du conteneur
    const publishUrl = `https://graph.facebook.com/v18.0/${IG_USER_ID}/media_publish`
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

    // 6. Réponse succès à l'application React
    return new Response(
      JSON.stringify({ success: true, instagram_post_id: publishData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    // Gestion des erreurs
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})