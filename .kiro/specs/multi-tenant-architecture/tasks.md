# Tasks: Multi-Tenant Architecture (V1)

## Prérequis

- [ ] Créer la branche `experiment/multi-tenant-architecture`
- [ ] S'assurer que le projet compile et les tests passent sur `main`

---

## Phase 1 : Migration Base de Données

### 1.1 Créer le fichier de migration
- [ ] Créer `supabase/migrations/002_add_multi_tenant_support.sql`
- [ ] Ajouter la création de la table `organizations`
- [ ] Ajouter l'insertion de l'organisation "jean-de-luz"
- [ ] Ajouter les colonnes `organization_id` aux tables existantes (NULLABLE)
- [ ] Ajouter les UPDATE pour assigner les données existantes à jean-de-luz
- [ ] Ajouter les index sur `organization_id`

### 1.2 Tester la migration en local
- [ ] Exécuter la migration sur une base Supabase de test
- [ ] Vérifier que la table `organizations` est créée
- [ ] Vérifier que jean-de-luz existe avec le bon UUID
- [ ] Vérifier que tous les posts ont `organization_id` rempli
- [ ] Vérifier que `instagram_accounts` a `organization_id` rempli
- [ ] Vérifier que `publication_history` a `organization_id` rempli

### 1.3 Préparer le rollback
- [ ] Créer `supabase/migrations/002_rollback_multi_tenant.sql` (pour référence)
- [ ] Documenter la procédure de rollback

---

## Phase 2 : Service Tenant

### 2.1 Créer le service tenant
- [ ] Créer `services/tenant.ts`
- [ ] Implémenter l'interface `TenantConfig`
- [ ] Implémenter `getTenantSlug()` (lecture URL, fallback jean-de-luz)
- [ ] Implémenter `loadTenantConfig()` (requête Supabase)
- [ ] Ajouter la config par défaut pour fallback

### 2.2 Créer le Context React
- [ ] Créer `contexts/TenantContext.tsx`
- [ ] Implémenter `TenantProvider` avec state et useEffect
- [ ] Implémenter `useTenant()` hook
- [ ] Gérer les états loading et error

### 2.3 Tests du service tenant
- [ ] Tester `getTenantSlug()` avec paramètre URL
- [ ] Tester `getTenantSlug()` sans paramètre (doit retourner jean-de-luz)
- [ ] Tester `loadTenantConfig()` avec slug valide
- [ ] Tester `loadTenantConfig()` avec slug invalide (doit retourner default)

---

## Phase 3 : Refactoring Database Service

### 3.1 Modifier database.ts
- [ ] Créer `createDatabaseService(organizationId)` factory function
- [ ] Modifier `getAllPosts()` pour filtrer par `organization_id`
- [ ] Modifier `updatePost()` pour inclure `organization_id`
- [ ] Modifier `togglePublishStatus()` pour filtrer par `organization_id`
- [ ] Modifier `getInstagramStatus()` pour filtrer par `organization_id`
- [ ] Modifier `publishToInstagram()` pour utiliser les credentials de l'org
- [ ] Créer `useDatabase()` hook qui utilise `useTenant()`

### 3.2 Assurer la rétrocompatibilité
- [ ] Si `organizationId` est null, ne pas filtrer (comportement actuel)
- [ ] Tester que Jean de Luz fonctionne sans paramètre URL
- [ ] Tester que les posts s'affichent correctement

### 3.3 Tests du database service
- [ ] Tester `getAllPosts()` avec organizationId défini
- [ ] Tester `getAllPosts()` avec organizationId null (pas de filtre)
- [ ] Tester l'isolation : org A ne voit pas les posts de org B

---

## Phase 4 : Intégration UI

### 4.1 Modifier App.tsx
- [ ] Wrapper l'app avec `TenantProvider`
- [ ] Créer `AppContent` component qui utilise `useTenant()`
- [ ] Afficher un loading pendant le chargement du tenant
- [ ] Afficher une erreur si le tenant n'existe pas

### 4.2 Modifier la Sidebar
- [ ] Remplacer le logo hardcodé par `tenant.logoUrl`
- [ ] Remplacer le nom hardcodé par `tenant.name`
- [ ] Appliquer `tenant.primaryColor` via CSS variable

### 4.3 Modifier les composants qui utilisent database
- [ ] Remplacer `database.getAllPosts()` par `useDatabase().getAllPosts()`
- [ ] Remplacer `database.getInstagramStatus()` par `useDatabase().getInstagramStatus()`
- [ ] Vérifier que tous les appels passent par le hook

### 4.4 Tests UI
- [ ] Tester l'affichage sans paramètre (jean-de-luz par défaut)
- [ ] Tester l'affichage avec `?tenant=jean-de-luz`
- [ ] Vérifier que le logo et le nom s'affichent correctement

---

## Phase 5 : Edge Functions Multi-Tenant

### 5.1 Modifier scheduled-publish
- [ ] Ajouter la récupération de toutes les organisations
- [ ] Implémenter la boucle sur chaque organisation
- [ ] Modifier `findTodaysPost` pour filtrer par `organization_id`
- [ ] Modifier `callPublishInstagram` pour utiliser les credentials de l'org
- [ ] Ajouter `organization_id` aux logs de `publication_history`
- [ ] Gérer les erreurs par org (ne pas bloquer les autres)

### 5.2 Modifier publish-instagram
- [ ] Accepter `organizationId` en paramètre
- [ ] Récupérer le token Instagram de l'organisation
- [ ] Utiliser ce token pour la publication

### 5.3 Modifier instagram-auth
- [ ] Accepter `organizationId` en paramètre (via state OAuth)
- [ ] Stocker le token avec `organization_id` au lieu de `user_id`

### 5.4 Modifier instagram-callback
- [ ] Récupérer `organizationId` depuis le state OAuth
- [ ] Stocker le token avec `organization_id`

### 5.5 Modifier instagram-status
- [ ] Accepter `organizationId` en paramètre
- [ ] Filtrer par `organization_id` au lieu de `user_id`

### 5.6 Tests Edge Functions
- [ ] Tester scheduled-publish avec plusieurs organisations
- [ ] Vérifier que chaque org publie avec ses propres credentials
- [ ] Vérifier que l'échec d'une org ne bloque pas les autres

---

## Phase 6 : Tests d'Intégration

### 6.1 Tests de rétrocompatibilité Jean de Luz
- [ ] Accéder à l'app sans paramètre → doit fonctionner comme avant
- [ ] Vérifier que tous les posts Jean de Luz s'affichent
- [ ] Vérifier que la connexion Instagram fonctionne
- [ ] Vérifier que la publication manuelle fonctionne
- [ ] Vérifier que le scheduled-publish fonctionne

### 6.2 Tests d'isolation
- [ ] Créer une organisation de test "test-org"
- [ ] Créer un post pour "test-org"
- [ ] Vérifier que Jean de Luz ne voit pas ce post
- [ ] Vérifier que test-org ne voit pas les posts Jean de Luz

### 6.3 Tests de branding
- [ ] Vérifier que le logo Jean de Luz s'affiche par défaut
- [ ] Créer une org avec un logo différent
- [ ] Vérifier que le bon logo s'affiche avec `?tenant=xxx`

### 6.4 Checklist manuelle avant merge
- [ ] Tester sur Chrome
- [ ] Tester sur Firefox
- [ ] Tester sur mobile
- [ ] Vérifier les logs pour erreurs

---

## Phase 7 : Documentation

### 7.1 Créer la documentation
- [ ] Créer `docs/multi-tenant-setup.md`
- [ ] Documenter comment ajouter un nouveau client
- [ ] Documenter la structure des URLs
- [ ] Documenter le format des logos

### 7.2 Mettre à jour la documentation existante
- [ ] Mettre à jour README.md avec info multi-tenant
- [ ] Documenter les nouvelles variables d'environnement (si ajoutées)

---

## Phase 8 : Déploiement

### 8.1 Déploiement staging (si disponible)
- [ ] Déployer sur environnement de staging
- [ ] Exécuter la migration sur DB staging
- [ ] Tester tous les scénarios sur staging

### 8.2 Déploiement production
- [ ] Backup de la base de données production
- [ ] Exécuter la migration sur production
- [ ] Vérifier que la migration a réussi
- [ ] Déployer le code sur Cloud Run
- [ ] Tester Jean de Luz en production
- [ ] Monitorer les logs pendant 24h

### 8.3 Post-déploiement
- [ ] Vérifier que le scheduled-publish fonctionne (attendre 12h30)
- [ ] Vérifier qu'aucune erreur dans les logs
- [ ] Merger la branche dans main

---

## Phase 9 : Premier Nouveau Client (Optionnel)

### 9.1 Ajouter l'organisation
- [ ] Exécuter le SQL pour créer l'organisation
- [ ] Ajouter le logo dans `/public/logos/`
- [ ] Redéployer pour inclure le logo

### 9.2 Configurer le client
- [ ] Fournir l'URL avec `?tenant=xxx`
- [ ] Guider le client pour connecter Instagram
- [ ] Vérifier que le client voit son espace vide
- [ ] Vérifier que le client ne voit pas les données Jean de Luz

---

## Résumé

| Phase | Durée estimée | Risque |
|-------|---------------|--------|
| 1. Migration DB | 2h | Faible |
| 2. Service Tenant | 2h | Faible |
| 3. Database Service | 3h | Moyen |
| 4. UI | 2h | Faible |
| 5. Edge Functions | 4h | Moyen |
| 6. Tests | 3h | - |
| 7. Documentation | 1h | - |
| 8. Déploiement | 2h | Moyen |
| **TOTAL** | **~19h** | **Moyen** |

## Critères de Succès

- [ ] Jean de Luz fonctionne sans aucun changement d'URL
- [ ] Les données sont isolées entre organisations
- [ ] Le branding est dynamique par organisation
- [ ] Le scheduled-publish fonctionne pour toutes les orgs
- [ ] Rollback possible en < 10 minutes si problème
