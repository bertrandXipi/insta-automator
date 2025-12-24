# Configuration de la Publication Automatique Instagram

## Vue d'ensemble

Ce document explique comment configurer la publication automatique quotidienne sur Instagram à 12h30 (heure de Paris).

## Prérequis

- **Supabase Pro plan** (ou supérieur) - pg_cron n'est pas disponible sur le plan gratuit
- Extensions activées : `pg_cron`, `pg_net`
- Edge Function `scheduled-publish` déployée

## Configuration du Cron Job

### Étape 1 : Activer les extensions (si pas déjà fait)

Exécuter dans le SQL Editor de Supabase :

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Étape 2 : Créer le cron job

⚠️ **IMPORTANT** : Remplacez `VOTRE_SERVICE_ROLE_KEY` par votre vraie clé.
Trouvez-la dans : Supabase Dashboard → Settings → API → Legacy → service_role

Exécuter dans le SQL Editor de Supabase :

```sql
SELECT cron.schedule(
  'daily-instagram-publish',
  '30 11 * * *',  -- 11:30 UTC = 12:30 Paris (heure d'hiver)
  $$
  SELECT net.http_post(
    url := 'https://xczeyrugggausivlyfjb.supabase.co/functions/v1/scheduled-publish',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer VOTRE_SERVICE_ROLE_KEY"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

⚠️ **NE PAS** commiter ce SQL avec la clé en clair dans git. Exécutez-le uniquement via le SQL Editor.

## Gestion des Fuseaux Horaires

### Le problème

pg_cron utilise **UTC** par défaut. Paris utilise :
- **Heure d'hiver (CET)** : UTC+1 → 12h30 Paris = 11h30 UTC
- **Heure d'été (CEST)** : UTC+2 → 12h30 Paris = 10h30 UTC

### Solution actuelle

Le cron est configuré pour **11h30 UTC**, ce qui correspond à :
- **Hiver** : 12h30 Paris ✅
- **Été** : 13h30 Paris ⚠️

### Solutions pour l'heure d'été

**Option 1 : Accepter le décalage**
- En été, la publication sera à 13h30 au lieu de 12h30
- Simple, pas de maintenance

**Option 2 : Changer manuellement 2x par an**
```sql
-- Passage à l'heure d'été (dernier dimanche de mars)
SELECT cron.alter_job('daily-instagram-publish', schedule := '30 10 * * *');

-- Passage à l'heure d'hiver (dernier dimanche d'octobre)
SELECT cron.alter_job('daily-instagram-publish', schedule := '30 11 * * *');
```

**Option 3 : Deux jobs avec conditions (avancé)**
Créer deux jobs qui vérifient la date et ne s'exécutent que pendant la bonne période.

## Commandes Utiles

### Vérifier le job

```sql
SELECT * FROM cron.job WHERE jobname = 'daily-instagram-publish';
```

### Voir l'historique d'exécution

```sql
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'daily-instagram-publish')
ORDER BY start_time DESC 
LIMIT 10;
```

### Tester manuellement

```sql
SELECT cron.run_job('daily-instagram-publish');
```

### Désactiver temporairement

```sql
UPDATE cron.job SET active = false WHERE jobname = 'daily-instagram-publish';
```

### Réactiver

```sql
UPDATE cron.job SET active = true WHERE jobname = 'daily-instagram-publish';
```

### Supprimer le job

```sql
SELECT cron.unschedule('daily-instagram-publish');
```

## Monitoring

### Vérifier les logs de la Edge Function

1. Aller sur Supabase Dashboard
2. Edge Functions → scheduled-publish → Logs

### Vérifier la table publication_history

```sql
SELECT * FROM publication_history ORDER BY created_at DESC LIMIT 10;
```

## Dépannage

### Le job ne s'exécute pas

1. Vérifier que pg_cron est activé : `SELECT * FROM pg_extension WHERE extname = 'pg_cron';`
2. Vérifier que le job existe : `SELECT * FROM cron.job;`
3. Vérifier que le job est actif : `active = true`

### Erreur 401 Unauthorized

La clé service_role_key n'est pas configurée correctement. Vérifier :
```sql
SELECT current_setting('app.settings.service_role_key', true);
```

### La fonction ne trouve pas de post

Vérifier qu'un post existe pour la date du jour avec :
- `published = false`
- `isClientManaged = false` ou `null`
- `date` au format "DD/MM" correspondant à aujourd'hui
