# Implementation Plan: Scheduled Instagram Posting

## Overview

Implémentation de la publication automatique Instagram à 12h30 via une Edge Function Supabase déclenchée par pg_cron.

## Tasks

- [x] 1. Créer la table publication_history
  - Créer le script SQL pour la table `publication_history`
  - Ajouter les index nécessaires
  - _Requirements: 4.3_

- [x] 2. Implémenter la Edge Function scheduled-publish
  - [x] 2.1 Créer la structure de base de la fonction
    - Créer le fichier `supabase/functions/scheduled-publish/index.ts`
    - Configurer les headers CORS et l'authentification
    - _Requirements: 5.1_

  - [x] 2.2 Implémenter la logique de sélection du post du jour
    - Requête pour trouver le post avec date = aujourd'hui (format DD/MM)
    - Filtrer les posts non publiés et non client-managed
    - Gérer le cas où aucun post n'existe
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.3 Implémenter la validation du post
    - Vérifier que imageUrl existe et n'est pas base64
    - Vérifier que caption n'est pas vide
    - Vérifier que isClientManaged est false
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 2.4 Implémenter l'appel à publish-instagram
    - Appeler la fonction existante avec les paramètres du post
    - Gérer la réponse succès/erreur
    - _Requirements: 2.1_

  - [x] 2.5 Implémenter la mise à jour du statut et le logging
    - Mettre à jour post.published = true en cas de succès
    - Insérer une entrée dans publication_history
    - _Requirements: 2.2, 2.3, 4.1, 4.2, 4.3_

- [x] 3. Checkpoint - Vérifier la fonction
  - Tester manuellement la fonction avec différents scénarios
  - Vérifier les logs et la table publication_history

- [x] 4. Écrire les tests
  - [x] 4.1 Créer les utilitaires de test et générateurs
    - Configurer fast-check pour les tests property-based
    - Créer les générateurs de posts aléatoires
    - _Requirements: Testing Strategy_

  - [x] 4.2 Property test: Post Selection by Date
    - **Property 1: Post Selection by Date**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

  - [x] 4.3 Property test: Invalid Post Rejection
    - **Property 2: Invalid Post Rejection**
    - **Validates: Requirements 3.1, 3.2**

  - [x] 4.4 Property test: Client-Managed Post Exclusion
    - **Property 3: Client-Managed Post Exclusion**
    - **Validates: Requirements 3.3**

  - [x] 4.5 Property test: Publication Status Update
    - **Property 4: Publication Status Update**
    - **Validates: Requirements 2.2**

  - [x] 4.6 Property test: Failed Publication Preserves State
    - **Property 5: Failed Publication Preserves State**
    - **Validates: Requirements 2.3**

  - [x] 4.7 Property test: Audit Trail Completeness
    - **Property 6: Audit Trail Completeness**
    - **Validates: Requirements 4.3**

- [x] 5. Configurer pg_cron
  - [x] 5.1 Créer le script SQL pour le job cron
    - Configurer le job pour 12h30 Paris time (11h30 UTC hiver)
    - Utiliser pg_net pour appeler la Edge Function
    - _Requirements: 5.2, 5.3_

  - [x] 5.2 Documenter la configuration timezone
    - Expliquer la conversion UTC/Paris
    - Documenter le changement heure été/hiver si nécessaire
    - _Requirements: 5.3_

- [x] 6. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tous les tests sont obligatoires pour garantir la qualité
- La fonction réutilise `publish-instagram` existante, pas besoin de réécrire la logique Instagram
- Le format de date "DD/MM" est celui utilisé dans les posts existants (ex: "05/12")
- pg_cron nécessite l'extension activée sur Supabase (plan Pro ou supérieur)
