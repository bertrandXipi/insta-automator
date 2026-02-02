# Sécurité des Données - Prévention de la Perte de Données

## 🛡️ Protections Mises en Place

### 1. Séparation des Responsabilités

**constants.ts** = Template initial UNIQUEMENT
- Sert à initialiser les nouveaux posts
- Ne doit JAMAIS écraser les posts existants
- Utilisé uniquement pour `syncNewPosts()`

**Supabase** = Source de vérité
- Toutes les modifications se font en BDD
- Les images uploadées sont stockées dans Storage
- La BDD a TOUJOURS la priorité

### 2. Fonction syncNewPosts() Sécurisée

```typescript
// ✅ BON : Ajoute uniquement les nouveaux
async syncNewPosts() {
  const existingIds = new Set(existingData?.map(row => row.id) || []);
  const newPosts = STRATEGY_POSTS.filter(post => !existingIds.has(post.id));
  
  // INSERT avec gestion des conflits
  await supabase.from('posts').insert(rows, { onConflict: 'id' });
}
```

**Garanties :**
- Vérifie d'abord quels posts existent déjà
- N'insère QUE les nouveaux posts
- Si conflit (post existe déjà), ignore silencieusement
- Aucun UPSERT = aucun écrasement possible

### 3. Fonction forceUpdateAllPosts() SUPPRIMÉE

Cette fonction dangereuse a été complètement retirée du code.

**Avant (DANGEREUX) :**
```typescript
// ❌ SUPPRIMÉ
async forceUpdateAllPosts() {
  await supabase.from('posts').upsert(rows); // Écrase tout !
}
```

**Maintenant :**
- La fonction n'existe plus
- Impossible de l'appeler par erreur
- Aucun risque d'écrasement automatique

### 4. Migration Supabase de Protection

**Fichier :** `supabase/migrations/002_prevent_data_overwrite.sql`

**Ce qu'elle fait :**

1. **Colonne `is_customized`** : Marque les posts modifiés manuellement
2. **Colonne `modified_at`** : Date de dernière modification
3. **Trigger automatique** : Marque un post comme customisé dès qu'il est modifié
4. **Vue `posts_status`** : Monitoring facile de l'état des posts
5. **Fonction de protection** : Empêche l'écrasement des posts customisés (optionnelle)

**Pour appliquer la migration :**

```bash
# Via Supabase CLI
supabase db push

# Ou via le Dashboard
# SQL Editor → Copier-coller le contenu de 002_prevent_data_overwrite.sql
```

### 5. Monitoring en Temps Réel

**Vue SQL pour vérifier l'état :**

```sql
SELECT * FROM posts_status
WHERE image_type = 'placeholder'
ORDER BY date;
```

**Résultat :**
```
id  | title           | date   | image_type  | is_customized | modified_at
----|-----------------|--------|-------------|---------------|-------------
p1  | Magie de Noël   | 05/12  | supabase    | true          | 2026-01-15
p2  | Concours        | 07/12  | placeholder | false         | 2026-01-10
```

### 6. Workflow Sécurisé pour Ajouter une Nouvelle Période

**Étape 1 : Ajouter les posts dans constants.ts**

```typescript
// constants.ts
export const STRATEGY_POSTS: Post[] = [
  // ... posts existants (ne pas toucher)
  
  // NOUVEAUX posts avril-mai
  {
    id: 'p51', week: 19, day: 'Lundi', date: '01/04',
    // ... contenu
  }
];
```

**Étape 2 : Déployer**

```bash
git add constants.ts
git commit -m "feat: add April-May posts"
git push
```

**Étape 3 : Vérifier**

Au prochain chargement de l'app :
- `syncNewPosts()` s'exécute automatiquement
- Ajoute UNIQUEMENT les posts p51, p52, etc.
- Ne touche PAS aux posts p1-p50 existants

**Étape 4 : Confirmer dans la console**

```
✅ Ajout de 26 nouveaux posts...
✅ 26 nouveaux posts ajoutés !
```

## 🚨 Que Faire en Cas de Problème

### Si des données sont écrasées par erreur

1. **Dashboard Supabase → Database → Backups**
   - Restaurer le dernier backup

2. **Vérifier le Storage**
   - Dashboard → Storage → posts-images
   - Les images uploadées sont peut-être encore là

3. **Contacter le Support**
   - support@supabase.com
   - Ils ont des backups internes

### Si un post doit être réinitialisé

```sql
-- Permettre la mise à jour depuis constants.ts
SELECT reset_post_to_template('p1');
```

## ✅ Checklist de Sécurité

Avant chaque déploiement :

- [ ] Les nouveaux posts sont AJOUTÉS à la fin de constants.ts
- [ ] Les posts existants ne sont PAS modifiés dans constants.ts
- [ ] `syncNewPosts()` est la seule fonction appelée dans `getAllPosts()`
- [ ] Aucun UPSERT n'est utilisé pour les posts
- [ ] La migration 002 est appliquée en production
- [ ] Un backup récent existe

## 📊 Monitoring Continu

**Requête à exécuter régulièrement :**

```sql
-- Vérifier les posts avec placeholder
SELECT COUNT(*) as placeholder_count
FROM posts_status
WHERE image_type = 'placeholder';

-- Vérifier les posts customisés
SELECT COUNT(*) as customized_count
FROM posts_status
WHERE is_customized = true;
```

**Alertes à configurer :**
- Si `placeholder_count` augmente soudainement → Investigation
- Si `customized_count` diminue → Possible écrasement

## 🔐 Règles d'Or

1. **La BDD est la source de vérité** - Toujours
2. **constants.ts = Template** - Jamais de données réelles
3. **INSERT uniquement** - Jamais d'UPSERT pour les posts
4. **Backups quotidiens** - Toujours activés
5. **Vérifier avant de déployer** - Checklist obligatoire
