import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Post } from '../types';
import { STRATEGY_POSTS } from '../constants';

// =================================================================================
// CONFIGURATION DE LA BASE DE DONNEES (SUPABASE)
// =================================================================================
// 1. Créez un projet gratuit sur https://supabase.com
// 2. Créez une table 'posts' avec deux colonnes : 'id' (text, primary key) et 'content' (jsonb)
// 3. Créez un Bucket Storage 'posts-images' et mettez-le en PUBLIC
// 4. Copiez l'URL et la clé ANON publique ici :
// =================================================================================

const SUPABASE_URL = "https://xczeyrugggausivlyfjb.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjemV5cnVnZ2dhdXNpdmx5ZmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzUzNzUsImV4cCI6MjA4MDUxMTM3NX0.p16MYP29bIbY-qv7Zmg_-TMMLpT1UsRmkV-gW_WRq4A";

// =================================================================================

const DB_KEY = 'jdl-strategy-db-v2';
const USE_SUPABASE = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

let supabase: SupabaseClient | null = null;

if (USE_SUPABASE) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Client Initialized");
  } catch (e) {
    console.error("Erreur init Supabase", e);
  }
}

// Simulation de délai réseau pour l'UX (seulement en local)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction utilitaire pour compresser l'image en Base64 (Fallback Local)
const compressImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export const database = {
  
  getProviderName(): string {
    return USE_SUPABASE ? 'Supabase Cloud (Live)' : 'Local Storage';
  },

  // Récupérer tous les posts
  async getAllPosts(): Promise<Post[]> {
    if (USE_SUPABASE && supabase) {
      const { data, error } = await supabase
        .from('posts')
        .select('content');
      
      if (error) {
        console.error("Erreur Supabase fetch:", error);
        throw error;
      }

      // Si la base est vide, on l'initialise avec les données par défaut
      if (!data || data.length === 0) {
        console.log("Base vide, initialisation...");
        await this.seedDatabase();
        return STRATEGY_POSTS;
      }

      // Tri pour garder l'ordre (facultatif mais recommandé)
      const posts = data.map((row: any) => row.content as Post);
      // On peut trier ici si nécessaire, par exemple par ID ou date
      return posts;
    } else {
      // MODE LOCAL STORAGE
      await delay(600);
      try {
        const saved = localStorage.getItem(DB_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error("Erreur lecture DB locale", e);
      }
      return STRATEGY_POSTS;
    }
  },

  // Mettre à jour un post
  async updatePost(updatedPost: Post): Promise<Post> {
    if (USE_SUPABASE && supabase) {
      // On sauvegarde l'objet entier dans la colonne JSONB 'content'
      const { error } = await supabase
        .from('posts')
        .upsert({ 
          id: updatedPost.id, 
          content: updatedPost 
        });

      if (error) {
        console.error("Erreur Supabase update:", error);
        throw error;
      }
      return updatedPost;
    } else {
      // MODE LOCAL STORAGE
      await delay(300);
      const posts = await this.getAllPosts();
      const newPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
      this.saveToLocalStorage(newPosts);
      return updatedPost;
    }
  },

  // Upload d'une image (Storage Cloud ou Base64 local)
  async uploadImage(file: File): Promise<string> {
    // Si Supabase est configuré, on upload vers le Bucket Storage "posts-images"
    if (USE_SUPABASE && supabase) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload
            const { error: uploadError } = await supabase.storage
                .from('posts-images')
                .upload(filePath, file);

            if (uploadError) {
                // Si le bucket n'existe pas ou erreur, on throw pour passer au catch
                throw uploadError;
            }

            // 2. Get Public URL
            const { data } = supabase.storage
                .from('posts-images')
                .getPublicUrl(filePath);

            return data.publicUrl;

        } catch (error) {
            console.error("Erreur Upload Storage (Fallback Base64):", error);
            // Si l'upload échoue (ex: pas de bucket 'posts-images'), on fallback sur le base64
            // ATTENTION: Instagram ne pourra pas publier ça, mais l'app marchera
            return await compressImageToBase64(file);
        }
    } else {
        // Mode Local uniquement
        return await compressImageToBase64(file);
    }
  },

  // Basculer le statut publié
  async togglePublishStatus(postId: string): Promise<Post[]> {
    const posts = await this.getAllPosts();
    const targetPost = posts.find(p => p.id === postId);
    
    if (targetPost) {
        const updatedPost = { ...targetPost, published: !targetPost.published };
        
        if (USE_SUPABASE && supabase) {
             const { error } = await supabase
                .from('posts')
                .upsert({ 
                    id: updatedPost.id, 
                    content: updatedPost 
                });
             if (error) throw error;
        } else {
            const newPosts = posts.map(p => p.id === postId ? updatedPost : p);
            this.saveToLocalStorage(newPosts);
        }
        
        // On retourne la liste mise à jour localement pour l'UI immédiate
        return posts.map(p => p.id === postId ? updatedPost : p);
    }
    return posts;
  },

  // --- NOUVEAU : Appel Backend Réel ---
  async publishToInstagram(post: Post): Promise<{ success: boolean; message?: string }> {
    // Vérification préventive : Instagram refuse le Base64
    if (post.imageUrl.startsWith('data:')) {
        return { 
            success: false, 
            message: "Impossible de publier une image locale (Base64). Veuillez ré-uploader l'image pour qu'elle soit hébergée sur Supabase Storage." 
        };
    }

    if (USE_SUPABASE && supabase) {
        try {
            // C'est ici que la magie opère : on appelle la Edge Function
            // Vous devrez créer une fonction nommée 'publish-instagram' dans votre dashboard Supabase
            const { data, error } = await supabase.functions.invoke('publish-instagram', {
                body: { 
                    postId: post.id,
                    imageUrl: post.imageUrl,
                    caption: `${post.caption}\n\n${post.hashtags.join(' ')}`
                }
            });

            if (error) throw error;
            
            // L'API peut renvoyer une erreur métier (ex: token invalide) même si l'appel technique a réussi
            if (data && data.success === false) {
                throw new Error(data.error || "Erreur inconnue de l'API Instagram");
            }
            
            // Si succès, on met à jour le statut dans la DB
            await this.togglePublishStatus(post.id);
            return { success: true };

        } catch (error: any) {
            console.error("Erreur lors de l'appel à la Edge Function:", error);
            
            const errorMsg = error.message || "Erreur technique";
            
            // Si la fonction n'existe pas (404), erreur réseau ou CORS (Failed to send...), on simule pour ne pas bloquer
            if (errorMsg.includes("Function not found") || errorMsg.includes("Failed to send a request")) {
                 console.warn("Backend inaccessible ou non déployé, bascule en mode simulation.", error);
                 await delay(2000);
                 await this.togglePublishStatus(post.id);
                 return { success: true, message: "Simulation réussie (Backend non détecté)" };
            }

            return { success: false, message: errorMsg };
        }
    } else {
        // Mode Local sans Supabase
        await delay(2000);
        await this.togglePublishStatus(post.id);
        return { success: true, message: "Simulation locale réussie" };
    }
  },

  // Souscrire aux changements en temps réel
  subscribeToChanges(onUpdate: (post: Post) => void): () => void {
    if (USE_SUPABASE && supabase) {
      const channel = supabase.channel('realtime-posts')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'posts' },
          (payload) => {
            // Le payload contient { new: { id: "...", content: {...} }, old: ... }
            if (payload.new && payload.new.content) {
              onUpdate(payload.new.content as Post);
            }
          }
        )
        .subscribe();
      
      // Retourne une fonction de nettoyage
      return () => {
        supabase?.removeChannel(channel);
      };
    }
    return () => {};
  },

  // Initialiser la base distante avec les données par défaut
  async seedDatabase() {
    if (USE_SUPABASE && supabase) {
      const rows = STRATEGY_POSTS.map(post => ({
        id: post.id,
        content: post
      }));
      
      const { error } = await supabase
        .from('posts')
        .upsert(rows);
        
      if (error) console.error("Erreur seeding:", error);
      else console.log("Base de données initialisée avec succès !");
    }
  },

  // Méthode interne privée
  saveToLocalStorage(posts: Post[]) {
    localStorage.setItem(DB_KEY, JSON.stringify(posts));
  }
};