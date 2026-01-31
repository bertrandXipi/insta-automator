# Design Document: Multi-Tenant Architecture (V1)

## Overview

Cette V1 implémente une architecture multi-tenant simple et sécurisée. L'isolation des données se fait au niveau applicatif (pas de RLS). La priorité est la rétrocompatibilité avec Jean de Luz et la facilité de rollback.

## Décisions d'Architecture

### 1. Isolation : Niveau Applicatif (Pas de RLS)

**Décision :** Filtrer les données dans le code avec `organization_id`, sans Row Level Security.

**Raison :**
- RLS avec `current_setting()` est complexe à configurer avec Supabase
- L'isolation applicative est suffisante pour une V1 avec peu de clients
- Plus facile à débugger et rollback
- RLS pourra être ajouté en V2 si nécessaire

### 2. Détection Tenant : Paramètre URL

**Décision :** Utiliser `?tenant=<slug>` dans l'URL.

**Raison :**
- Simple à implémenter
- Pas de configuration DNS
- Fonctionne avec les URLs Google Cloud Run par défaut
- Facile à tester

### 3. Contexte Tenant : React Context (Pas d'Instance Globale)

**Décision :** Utiliser un React Context pour le tenant, pas une instance globale mutable.

**Raison :**
- Évite les race conditions si plusieurs requêtes simultanées
- Pattern React standard
- Facile à tester avec des mocks

### 4. Migration Instagram : Adapter l'Existant

**Décision :** Ajouter `organization_id` à la table `instagram_accounts` existante, pas de nouvelle table.

**Raison :**
- La table existe déjà avec les tokens de Jean de Luz
- Évite de perdre la connexion Instagram existante
- Migration plus simple

## Schema de Base de Données

### Nouvelle Table : `organizations`

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT DEFAULT '/logo_jeandeluz.svg',
  primary_color TEXT DEFAULT '#D65D63',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
```

### Modifications des Tables Existantes

#### Table `posts`
```sql
-- Ajouter la colonne (NULLABLE pour rétrocompatibilité)
ALTER TABLE posts ADD COLUMN organization_id UUID REFERENCES organizations(id);

-- Index pour les requêtes filtrées
CREATE INDEX idx_posts_organization_id ON posts(organization_id);
```

#### Table `publication_history`
```sql
ALTER TABLE publication_history ADD COLUMN organization_id UUID REFERENCES organizations(id);
CREATE INDEX idx_publication_history_organization_id ON publication_history(organization_id);
```

#### Table `instagram_accounts`
```sql
-- Remplacer user_id par organization_id
ALTER TABLE instagram_accounts ADD COLUMN organization_id UUID REFERENCES organizations(id);
CREATE INDEX idx_instagram_accounts_organization_id ON instagram_accounts(organization_id);

-- Note: On garde user_id pour la rétrocompatibilité temporaire
-- Il sera supprimé en V2 une fois la migration validée
```

## Migration SQL Complète

```sql
-- Migration: 002_add_multi_tenant_support.sql
-- IMPORTANT: Exécuter en une seule transaction

BEGIN;

-- 1. Créer la table organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT DEFAULT '/logo_jeandeluz.svg',
  primary_color TEXT DEFAULT '#D65D63',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

-- 2. Insérer l'organisation Jean de Luz
INSERT INTO organizations (slug, name, logo_url, primary_color)
VALUES ('jean-de-luz', 'Jean de Luz', '/logo_jeandeluz.svg', '#D65D63')
ON CONFLICT (slug) DO NOTHING;

-- 3. Récupérer l'ID de Jean de Luz
DO $$
DECLARE
  jdl_org_id UUID;
BEGIN
  SELECT id INTO jdl_org_id FROM organizations WHERE slug = 'jean-de-luz';
  
  -- 4. Ajouter organization_id aux posts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE posts ADD COLUMN organization_id UUID REFERENCES organizations(id);
  END IF;
  
  -- 5. Assigner tous les posts existants à Jean de Luz
  UPDATE posts SET organization_id = jdl_org_id WHERE organization_id IS NULL;
  
  -- 6. Ajouter organization_id à publication_history
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'publication_history' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE publication_history ADD COLUMN organization_id UUID REFERENCES organizations(id);
  END IF;
  
  -- 7. Assigner tout l'historique existant à Jean de Luz
  UPDATE publication_history SET organization_id = jdl_org_id WHERE organization_id IS NULL;
  
  -- 8. Ajouter organization_id à instagram_accounts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'instagram_accounts' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE instagram_accounts ADD COLUMN organization_id UUID REFERENCES organizations(id);
  END IF;
  
  -- 9. Assigner tous les comptes Instagram existants à Jean de Luz
  UPDATE instagram_accounts SET organization_id = jdl_org_id WHERE organization_id IS NULL;
  
END $$;

-- 10. Créer les index
CREATE INDEX IF NOT EXISTS idx_posts_organization_id ON posts(organization_id);
CREATE INDEX IF NOT EXISTS idx_publication_history_organization_id ON publication_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_organization_id ON instagram_accounts(organization_id);

COMMIT;
```

## Architecture Application

### Nouveau Fichier : `services/tenant.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
}

const DEFAULT_TENANT_SLUG = 'jean-de-luz';

const DEFAULT_CONFIG: TenantConfig = {
  id: 'default',
  slug: 'jean-de-luz',
  name: 'Jean de Luz',
  logoUrl: '/logo_jeandeluz.svg',
  primaryColor: '#D65D63',
};

/**
 * Récupère le slug du tenant depuis l'URL
 * Retourne 'jean-de-luz' par défaut pour la rétrocompatibilité
 */
export function getTenantSlug(): string {
  if (typeof window === 'undefined') return DEFAULT_TENANT_SLUG;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tenant') || DEFAULT_TENANT_SLUG;
}

/**
 * Charge la configuration du tenant depuis la base de données
 */
export async function loadTenantConfig(
  supabase: ReturnType<typeof createClient>,
  slug: string
): Promise<TenantConfig> {
  const { data, error } = await supabase
    .from('organizations')
    .select('id, slug, name, logo_url, primary_color')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.warn(`Tenant "${slug}" not found, using default config`);
    return DEFAULT_CONFIG;
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    logoUrl: data.logo_url || DEFAULT_CONFIG.logoUrl,
    primaryColor: data.primary_color || DEFAULT_CONFIG.primaryColor,
  };
}
```

### Nouveau Fichier : `contexts/TenantContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TenantConfig, getTenantSlug, loadTenantConfig } from '../services/tenant';
import { supabase } from '../services/supabase';

interface TenantContextValue {
  tenant: TenantConfig | null;
  organizationId: string | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  organizationId: null,
  isLoading: true,
  error: null,
});

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initTenant() {
      try {
        const slug = getTenantSlug();
        const config = await loadTenantConfig(supabase, slug);
        setTenant(config);
        setError(null);
      } catch (err) {
        console.error('Failed to load tenant:', err);
        setError('Failed to load organization');
      } finally {
        setIsLoading(false);
      }
    }

    initTenant();
  }, []);

  return (
    <TenantContext.Provider value={{
      tenant,
      organizationId: tenant?.id || null,
      isLoading,
      error,
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
```

### Modification : `services/database.ts`

```typescript
// AVANT (instance globale - PROBLÉMATIQUE)
export const database = { ... };

// APRÈS (fonctions qui prennent organizationId en paramètre)
export function createDatabaseService(organizationId: string | null) {
  return {
    async getAllPosts(): Promise<Post[]> {
      let query = supabase.from('posts').select('id, content');
      
      // Filtrer par organisation si définie
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data?.map(row => row.content as Post) || [];
    },

    async getInstagramStatus(): Promise<InstagramAccount> {
      if (!organizationId) return { connected: false };
      
      const { data, error } = await supabase
        .from('instagram_accounts')
        .select('ig_username, token_expires_at')
        .eq('organization_id', organizationId)
        .single();

      if (error || !data) return { connected: false };

      const isExpired = data.token_expires_at && 
        new Date(data.token_expires_at) < new Date();

      return {
        connected: !isExpired,
        username: data.ig_username,
        expiresAt: data.token_expires_at,
        isExpired,
      };
    },

    // ... autres méthodes avec organizationId
  };
}

// Hook React pour utiliser le service avec le tenant courant
export function useDatabase() {
  const { organizationId } = useTenant();
  return createDatabaseService(organizationId);
}
```

### Modification : `App.tsx`

```typescript
import { TenantProvider, useTenant } from './contexts/TenantContext';

function AppContent() {
  const { tenant, isLoading, error } = useTenant();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (error) {
    return <ErrorScreen message={error} />;
  }

  return (
    <div style={{ '--primary-color': tenant?.primaryColor } as React.CSSProperties}>
      <Sidebar logo={tenant?.logoUrl} name={tenant?.name} />
      {/* ... reste de l'app */}
    </div>
  );
}

export default function App() {
  return (
    <TenantProvider>
      <AppContent />
    </TenantProvider>
  );
}
```

### Modification : `supabase/functions/scheduled-publish/index.ts`

```typescript
// AVANT: Publie pour un seul tenant (default-user)
// APRÈS: Itère sur toutes les organisations

serve(async (req) => {
  // ... setup ...

  // 1. Récupérer toutes les organisations
  const { data: organizations, error: orgError } = await supabase
    .from('organizations')
    .select('id, slug, name');

  if (orgError || !organizations) {
    return errorResponse('Failed to fetch organizations');
  }

  const results = [];

  // 2. Pour chaque organisation, chercher et publier le post du jour
  for (const org of organizations) {
    console.log(`Processing organization: ${org.slug}`);
    
    try {
      // Chercher le post du jour pour cette org
      const post = await findTodaysPostForOrg(supabase, targetDate, org.id);
      
      if (!post) {
        results.push({ org: org.slug, action: 'no_post' });
        continue;
      }

      // Valider le post
      const validation = validatePost(post);
      if (!validation.valid) {
        await logHistory(supabase, post.id, 'skipped', validation.reason, targetDate, org.id);
        results.push({ org: org.slug, action: 'skipped', reason: validation.reason });
        continue;
      }

      // Publier avec les credentials de cette org
      const publishResult = await callPublishInstagramForOrg(
        SUPABASE_URL, 
        SUPABASE_SERVICE_KEY, 
        post,
        org.id
      );

      if (publishResult.success) {
        await updatePostStatus(supabase, post);
        await logHistory(supabase, post.id, 'published', 'Success', targetDate, org.id);
        results.push({ org: org.slug, action: 'published', postId: post.id });
      } else {
        await logHistory(supabase, post.id, 'error', publishResult.error, targetDate, org.id);
        results.push({ org: org.slug, action: 'error', error: publishResult.error });
      }
    } catch (err) {
      console.error(`Error for org ${org.slug}:`, err);
      results.push({ org: org.slug, action: 'error', error: err.message });
      // Continue avec les autres orgs, ne pas bloquer
    }
  }

  return new Response(JSON.stringify({ success: true, results }), { ... });
});
```

## Stockage des Logos

**Stratégie V1 :** Logos stockés dans `/public/logos/`

- Simple à implémenter
- Pas de dépendance externe
- Nécessite un redéploiement pour ajouter un logo

**Exemple :**
```
/public/logos/jean-de-luz.svg
/public/logos/hotel-xyz.svg
```

**V2 (future) :** Migration vers Supabase Storage pour permettre l'upload dynamique.

## Plan de Rollback

### Si problème détecté :

1. **Code :** `git revert` vers le commit précédent
2. **Déploiement :** Rollback Cloud Run vers la révision précédente
3. **Base de données :** Les colonnes ajoutées sont NULLABLE, donc pas de blocage

### Script de rollback SQL (si nécessaire) :

```sql
-- ATTENTION: Ne pas exécuter sauf en cas de problème majeur
-- Ceci supprime les colonnes multi-tenant mais PRÉSERVE les données

ALTER TABLE posts DROP COLUMN IF EXISTS organization_id;
ALTER TABLE publication_history DROP COLUMN IF EXISTS organization_id;
ALTER TABLE instagram_accounts DROP COLUMN IF EXISTS organization_id;
DROP TABLE IF EXISTS organizations;
```

## Ajout d'un Nouveau Client

### Étape 1 : Créer l'organisation en SQL
```sql
INSERT INTO organizations (slug, name, logo_url, primary_color)
VALUES ('hotel-xyz', 'Hôtel XYZ', '/logos/hotel-xyz.svg', '#1E40AF');
```

### Étape 2 : Ajouter le logo
Placer le fichier SVG dans `/public/logos/hotel-xyz.svg`

### Étape 3 : Redéployer (pour le logo)
```bash
gcloud run deploy instagram-platform --source .
```

### Étape 4 : Fournir l'URL au client
```
https://instagram-platform-xxx.run.app?tenant=hotel-xyz
```

### Étape 5 : Le client connecte son Instagram
Via le flow OAuth existant, qui stockera le token avec `organization_id`.

## Limitations V1 (À Améliorer en V2)

1. **Pas de RLS** : L'isolation dépend du code applicatif
2. **Logos statiques** : Nécessite un redéploiement pour ajouter un logo
3. **Pas d'admin UI** : Ajout de clients via SQL uniquement
4. **Pas d'authentification** : Tout le monde avec l'URL peut accéder
5. **Un seul compte Instagram par org** : Pas de multi-compte
