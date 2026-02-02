# Guide de Récupération des Images Perdues

## 🚨 Problème

La fonction `forceUpdateAllPosts()` a écrasé les vraies images des posts décembre-janvier avec les URLs placeholder de `constants.ts`.

## 📋 Étapes de Récupération

### 1. Vérifier les Backups Supabase

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet
3. Va dans **Database** → **Backups**
4. Cherche un backup d'AVANT le déploiement du 02/02/2026

Si un backup existe :
- Télécharge-le
- Restaure la table `posts` depuis ce backup
- ✅ Problème résolu

### 2. Vérifier le Storage Supabase

Les images uploadées sont peut-être encore dans le Storage :

1. Va dans **Storage** → **posts-images**
2. Liste tous les fichiers
3. Les vraies images sont là avec des noms comme `1738425678-abc123.jpg`

Pour réassocier les images :
- Copie l'URL publique de chaque image
- Utilise l'outil "Diagnostic Images" dans l'app
- Édite manuellement chaque post pour remettre la bonne URL

### 3. Vérifier l'Historique Git

Si les images étaient dans le code (peu probable) :

```bash
git log --all --full-history -- "constants.ts"
git show <commit-hash>:constants.ts
```

### 4. Restauration Manuelle

Si aucune des options ci-dessus ne fonctionne, il faudra :

1. Récupérer les images depuis Instagram (si déjà publiées)
2. Ou refaire les visuels
3. Les ré-uploader via l'app

## 🛡️ Prévention Future

### Règle #1 : La BDD est la source de vérité

- `constants.ts` = Template initial UNIQUEMENT
- Une fois en BDD, on ne touche PLUS depuis constants.ts
- `syncNewPosts()` ajoute SEULEMENT les nouveaux posts (INSERT, pas UPSERT)

### Règle #2 : Ne JAMAIS appeler forceUpdateAllPosts() automatiquement

Cette fonction est DANGEREUSE et doit être appelée MANUELLEMENT uniquement en cas de besoin critique.

### Règle #3 : Backups réguliers

Configurer des backups automatiques Supabase :
- Dashboard → Database → Backups
- Activer les backups quotidiens
- Conserver au moins 7 jours d'historique

### Règle #4 : Séparation des données

Pour le multi-tenant futur :
- Chaque tenant a sa propre table ou partition
- Les templates (constants.ts) ne s'appliquent QUE lors de la création d'un nouveau tenant
- Jamais de sync automatique après l'initialisation

## 📝 Checklist de Sécurité

- [ ] Backups Supabase activés
- [ ] `forceUpdateAllPosts()` retirée de `getAllPosts()`
- [ ] `syncNewPosts()` utilise INSERT au lieu de UPSERT
- [ ] Documentation mise à jour
- [ ] Tests de non-régression

## 🔧 Code Corrigé

```typescript
// ✅ BON : Ajoute uniquement les nouveaux
async syncNewPosts() {
  const newPosts = STRATEGY_POSTS.filter(post => !existingIds.has(post.id));
  await supabase.from('posts').insert(rows); // INSERT, pas UPSERT
}

// ❌ MAUVAIS : Écrase tout
async forceUpdateAllPosts() {
  await supabase.from('posts').upsert(rows); // DANGER !
}
```

## 📞 Contact Support Supabase

Si besoin d'aide pour restaurer un backup :
- Support : https://supabase.com/support
- Discord : https://discord.supabase.com
- Ils peuvent restaurer depuis leurs backups internes
