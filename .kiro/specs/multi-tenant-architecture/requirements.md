# Requirements Document: Multi-Tenant Architecture (V1)

## Introduction

Cette fonctionnalité transforme la plateforme Instagram mono-client actuelle en une application multi-tenant. Le système supportera plusieurs clients (organisations) sur un seul déploiement, chacun avec ses données isolées, son branding personnalisé et son compte Instagram séparé.

**Principe clé V1 :** Simplicité et sécurité. Pas de Row Level Security (RLS) complexe. Isolation au niveau applicatif uniquement. Migration sans risque pour Jean de Luz.

## Glossary

- **Tenant/Organization**: Un client indépendant utilisant la plateforme (ex: "Jean de Luz", "Hotel XYZ")
- **Tenant Slug**: Identifiant unique d'une organisation (ex: "jean-de-luz", "hotel-xyz")
- **Backward Compatibility**: Jean de Luz continue de fonctionner sans aucun changement d'URL
- **Application-Level Isolation**: Filtrage des données dans le code (pas au niveau DB)

## Architecture Actuelle (À Connaître)

### Tables existantes :
- `posts` : Stocke les posts avec `id` (TEXT) et `content` (JSONB)
- `publication_history` : Historique des publications avec `post_id`, `action`, `message`, `target_date`
- `instagram_accounts` : Comptes Instagram avec `user_id`, `ig_username`, `access_token`, `token_expires_at`

### Points clés :
- Les posts sont stockés en JSONB dans la colonne `content`
- Les tokens Instagram sont liés à `user_id` (actuellement "default-user")
- Le scheduled-publish utilise `userId: 'default-user'` en dur

## Requirements

### Requirement 1: Table Organizations

**User Story:** En tant qu'administrateur, je veux créer des organisations pour que chaque client ait son propre espace.

#### Acceptance Criteria

1. WHEN une organisation est créée, THE System SHALL stocker un slug unique, un nom, une URL de logo et une couleur primaire
2. THE System SHALL générer un UUID unique pour chaque organisation
3. THE System SHALL créer automatiquement l'organisation "jean-de-luz" lors de la migration
4. THE System SHALL refuser les slugs en doublon

### Requirement 2: Détection du Tenant via URL

**User Story:** En tant qu'utilisateur, je veux accéder à mon espace via `?tenant=mon-slug` pour voir uniquement mes données.

#### Acceptance Criteria

1. WHEN un utilisateur accède avec `?tenant=<slug>`, THE System SHALL charger la configuration de cette organisation
2. WHEN un utilisateur accède SANS paramètre tenant, THE System SHALL utiliser "jean-de-luz" par défaut (rétrocompatibilité)
3. WHEN un slug invalide est fourni, THE System SHALL afficher une erreur claire (pas de fallback silencieux)
4. THE System SHALL conserver le contexte tenant pendant toute la session

### Requirement 3: Isolation des Données (Niveau Applicatif)

**User Story:** En tant que client, je veux que mes posts soient isolés des autres clients.

#### Acceptance Criteria

1. WHEN un utilisateur requête les posts, THE System SHALL retourner uniquement les posts de son organisation
2. WHEN un utilisateur requête l'historique de publication, THE System SHALL filtrer par organisation
3. WHEN un utilisateur requête le statut Instagram, THE System SHALL retourner uniquement la connexion de son organisation
4. THE System SHALL ajouter `organization_id` aux tables `posts`, `publication_history`, et `instagram_accounts`
5. WHEN la migration s'exécute, THE System SHALL assigner toutes les données existantes à "jean-de-luz"

### Requirement 4: Branding Dynamique

**User Story:** En tant que client, je veux voir mon logo et mes couleurs dans l'application.

#### Acceptance Criteria

1. WHEN un tenant est chargé, THE System SHALL afficher le logo de l'organisation dans la sidebar
2. WHEN un tenant est chargé, THE System SHALL appliquer la couleur primaire de l'organisation
3. WHEN un tenant est chargé, THE System SHALL afficher le nom de l'organisation dans le header
4. THE System SHALL utiliser le branding Jean de Luz par défaut si la config est incomplète

### Requirement 5: Rétrocompatibilité Jean de Luz

**User Story:** En tant que client Jean de Luz, je veux que l'application continue de fonctionner exactement comme avant.

#### Acceptance Criteria

1. WHEN j'accède à l'URL actuelle SANS paramètre, THE System SHALL fonctionner identiquement à avant
2. THE System SHALL préserver tous les posts existants de Jean de Luz
3. THE System SHALL préserver la connexion Instagram existante de Jean de Luz
4. THE System SHALL préserver l'historique de publication de Jean de Luz
5. THE System SHALL continuer à publier automatiquement à 12h30 pour Jean de Luz

### Requirement 6: Isolation des Comptes Instagram

**User Story:** En tant que client, je veux connecter mon propre compte Instagram.

#### Acceptance Criteria

1. WHEN un utilisateur connecte Instagram, THE System SHALL stocker le token associé à son organisation
2. WHEN un post est publié, THE System SHALL utiliser les credentials Instagram de l'organisation du post
3. THE System SHALL empêcher une organisation de publier sur le compte Instagram d'une autre
4. THE System SHALL migrer le compte Instagram existant vers l'organisation "jean-de-luz"

### Requirement 7: Publication Automatique Multi-Tenant

**User Story:** En tant que client, je veux que mes posts soient publiés automatiquement à l'heure configurée.

#### Acceptance Criteria

1. WHEN le cron job s'exécute, THE System SHALL itérer sur TOUTES les organisations actives
2. FOR EACH organisation, THE System SHALL chercher le post du jour et le publier avec les credentials de cette org
3. THE System SHALL logger l'organisation dans l'historique de publication
4. THE System SHALL continuer même si une organisation échoue (pas de blocage global)

### Requirement 8: Migration Sans Risque

**User Story:** En tant qu'administrateur, je veux migrer sans perte de données ni downtime.

#### Acceptance Criteria

1. THE System SHALL ajouter les colonnes `organization_id` comme NULLABLE (pas de contrainte NOT NULL)
2. THE System SHALL assigner toutes les données existantes à "jean-de-luz" AVANT d'activer le filtrage
3. THE System SHALL permettre un rollback simple (suppression des colonnes ajoutées)
4. THE System SHALL NE PAS utiliser Row Level Security (trop complexe pour V1)
5. THE System SHALL tester la migration en local avant production

### Requirement 9: Service Tenant Centralisé

**User Story:** En tant que développeur, je veux un service centralisé pour gérer le contexte tenant.

#### Acceptance Criteria

1. THE System SHALL fournir `getTenantSlug()` qui retourne le slug depuis l'URL
2. THE System SHALL fournir `loadTenantConfig()` qui charge la config depuis la DB
3. THE System SHALL fournir `TenantContext` React pour partager le tenant dans l'app
4. THE System SHALL NE PAS utiliser d'instance globale mutable (risque de race condition)

### Requirement 10: Tests Critiques

**User Story:** En tant que développeur, je veux des tests pour valider l'isolation et la rétrocompatibilité.

#### Acceptance Criteria

1. THE System SHALL inclure un test vérifiant que Jean de Luz fonctionne sans paramètre
2. THE System SHALL inclure un test vérifiant l'isolation des posts entre tenants
3. THE System SHALL inclure un test vérifiant que le scheduled-publish itère sur toutes les orgs
4. THE System SHALL inclure un test manuel de bout en bout avant déploiement prod
