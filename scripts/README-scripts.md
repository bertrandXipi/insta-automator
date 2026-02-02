# Scripts de Diagnostic Supabase

## 1. Vérifier l'état des images

**Fichier:** `check-supabase-images.js`

**Comment l'utiliser:**

1. Ouvre l'app dans ton navigateur
2. Ouvre la console (F12 → Console)
3. Copie-colle tout le contenu du fichier `check-supabase-images.js`
4. Appuie sur Entrée

**Ce que ça fait:**
- Liste tous les posts décembre-janvier
- Compte combien ont des images placeholder vs vraies images
- Affiche un tableau détaillé
- Liste les fichiers disponibles dans le Storage Supabase

**Résultat attendu:**
```
📊 Total posts décembre-janvier: 36

📈 STATISTIQUES:
   ❌ Placeholder (picsum): 30
   ✅ Supabase Storage: 6
   📦 Base64: 0
   ❓ Autre: 0

⚠️  POSTS AVEC PLACEHOLDER (à corriger):
   p1 (05/12) - Magie de Noël
   p2 (07/12) - Concours de Noël
   ...

🗂️  Vérification du Storage...
   📁 Fichiers dans Storage: 15
   Fichiers disponibles:
      - 1738425678-abc123.jpg (245.67 KB)
        URL: https://xczeyrugggausivlyfjb.supabase.co/storage/v1/object/public/posts-images/1738425678-abc123.jpg
      ...
```

## 2. Vérifier les backups Supabase

**Via le Dashboard:**

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet `xczeyrugggausivlyfjb`
3. Va dans **Database** → **Backups**
4. Cherche un backup du 01/02/2026 ou avant

**Si un backup existe:**
- Clique sur "Restore"
- Sélectionne uniquement la table `posts`
- Confirme la restauration

**⚠️ ATTENTION:** La restauration écrasera les données actuelles. Fais un export avant si besoin.

## 3. Exporter les données actuelles (sécurité)

**Via SQL Editor:**

```sql
-- Exporter tous les posts
COPY (
  SELECT id, content 
  FROM posts 
  ORDER BY id
) TO '/tmp/posts_backup.csv' WITH CSV HEADER;
```

Ou via l'API REST :

```bash
curl "https://xczeyrugggausivlyfjb.supabase.co/rest/v1/posts?select=*" \
  -H "apikey: eyJhbGc..." \
  -H "Authorization: Bearer eyJhbGc..." \
  > posts_backup.json
```

## 4. Restaurer manuellement une image

Si tu as l'URL d'une vraie image dans le Storage :

```javascript
// Dans la console du navigateur
const postId = 'p1'; // ID du post à corriger
const newImageUrl = 'https://xczeyrugggausivlyfjb.supabase.co/storage/v1/object/public/posts-images/1738425678-abc123.jpg';

// Récupérer le post
const response = await fetch(`https://xczeyrugggausivlyfjb.supabase.co/rest/v1/posts?id=eq.${postId}&select=content`, {
  headers: {
    'apikey': 'eyJhbGc...',
    'Authorization': 'Bearer eyJhbGc...'
  }
});
const data = await response.json();
const post = data[0].content;

// Mettre à jour l'image
post.imageUrl = newImageUrl;

// Sauvegarder
await fetch(`https://xczeyrugggausivlyfjb.supabase.co/rest/v1/posts?id=eq.${postId}`, {
  method: 'PATCH',
  headers: {
    'apikey': 'eyJhbGc...',
    'Authorization': 'Bearer eyJhbGc...',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  },
  body: JSON.stringify({ content: post })
});

console.log('✅ Image mise à jour pour', postId);
```

## 5. Contacter le Support Supabase

Si aucune des solutions ci-dessus ne fonctionne :

**Email:** support@supabase.com

**Message type:**
```
Bonjour,

J'ai besoin d'aide pour restaurer des données de ma table 'posts' 
dans le projet xczeyrugggausivlyfjb.

Une mise à jour accidentelle a écrasé les URLs d'images le 02/02/2026.
Auriez-vous un backup interne que je pourrais restaurer ?

Période concernée : 01/02/2026 ou avant
Table : posts
Colonnes : id, content (JSONB)

Merci d'avance,
[Ton nom]
```

**Discord:** https://discord.supabase.com
- Canal #help
- Mentionne ton projet ID
