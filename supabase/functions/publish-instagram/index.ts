import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper to wait for media container to be ready
async function waitForMediaReady(containerId: string, accessToken: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const statusUrl = `https://graph.facebook.com/v21.0/${containerId}?fields=status_code&access_token=${accessToken}`;
    const res = await fetch(statusUrl);
    const data = await res.json();
    
    if (data.status_code === 'FINISHED') {
      return true;
    } else if (data.status_code === 'ERROR') {
      throw new Error(`Media processing failed: ${JSON.stringify(data)}`);
    }
    
    // Wait 2 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  return false;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { postId, imageUrl, imageUrls, caption, userId } = await req.json()

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
    }

    console.log(`Tentative de publication pour le post ${postId}...`)

    // Combine all images: imageUrl (main) + imageUrls (additional)
    const allImages: string[] = [];
    if (imageUrl) allImages.push(imageUrl);
    if (imageUrls && Array.isArray(imageUrls)) {
      imageUrls.forEach((url: string) => {
        if (url && !allImages.includes(url)) allImages.push(url);
      });
    }

    if (allImages.length === 0) {
      throw new Error("Aucune image fournie pour la publication.");
    }

    console.log(`Nombre d'images: ${allImages.length}`);

    let creationId: string;

    if (allImages.length === 1) {
      // ========== SINGLE IMAGE POST ==========
      console.log('Publication simple image...');
      
      const containerUrl = `https://graph.facebook.com/v21.0/${IG_USER_ID}/media`
      const containerParams = new URLSearchParams({
          image_url: allImages[0],
          caption: caption,
          access_token: ACCESS_TOKEN
      })

      const containerRes = await fetch(`${containerUrl}?${containerParams}`, { method: 'POST' })
      const containerData = await containerRes.json()

      if (containerData.error) {
         console.error("Erreur Container Instagram:", containerData.error)
         throw new Error(`Erreur Instagram (Container): ${containerData.error.message}`)
      }

      creationId = containerData.id
      console.log(`Conteneur créé avec succès : ${creationId}`)

      // Attendre que le média soit prêt
      console.log('Attente du traitement de l\'image par Instagram...')
      await new Promise(resolve => setTimeout(resolve, 5000))

    } else {
      // ========== CAROUSEL POST (Multiple Images) ==========
      console.log('Publication carousel...');
      
      // Step 1: Create individual media containers for each image
      const childContainerIds: string[] = [];
      
      for (let i = 0; i < allImages.length; i++) {
        console.log(`Création conteneur enfant ${i + 1}/${allImages.length}...`);
        
        const childUrl = `https://graph.facebook.com/v21.0/${IG_USER_ID}/media`;
        const childParams = new URLSearchParams({
          image_url: allImages[i],
          is_carousel_item: 'true',
          access_token: ACCESS_TOKEN
        });

        const childRes = await fetch(`${childUrl}?${childParams}`, { method: 'POST' });
        const childData = await childRes.json();

        if (childData.error) {
          console.error(`Erreur Container enfant ${i + 1}:`, childData.error);
          throw new Error(`Erreur Instagram (Container enfant ${i + 1}): ${childData.error.message}`);
        }

        childContainerIds.push(childData.id);
        console.log(`Conteneur enfant ${i + 1} créé: ${childData.id}`);
        
        // Wait for each child container to be ready
        const isReady = await waitForMediaReady(childData.id, ACCESS_TOKEN);
        if (!isReady) {
          throw new Error(`Timeout: le conteneur enfant ${i + 1} n'est pas prêt`);
        }
      }

      // Step 2: Create the carousel container
      console.log('Création du conteneur carousel...');
      
      const carouselUrl = `https://graph.facebook.com/v21.0/${IG_USER_ID}/media`;
      const carouselParams = new URLSearchParams({
        media_type: 'CAROUSEL',
        children: childContainerIds.join(','),
        caption: caption,
        access_token: ACCESS_TOKEN
      });

      const carouselRes = await fetch(`${carouselUrl}?${carouselParams}`, { method: 'POST' });
      const carouselData = await carouselRes.json();

      if (carouselData.error) {
        console.error("Erreur Container Carousel:", carouselData.error);
        throw new Error(`Erreur Instagram (Carousel): ${carouselData.error.message}`);
      }

      creationId = carouselData.id;
      console.log(`Conteneur carousel créé: ${creationId}`);

      // Wait for carousel to be ready
      const isReady = await waitForMediaReady(creationId, ACCESS_TOKEN);
      if (!isReady) {
        throw new Error("Timeout: le carousel n'est pas prêt pour publication");
      }
    }

    // ========== PUBLISH THE MEDIA ==========
    console.log('Publication du média...');
    
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
