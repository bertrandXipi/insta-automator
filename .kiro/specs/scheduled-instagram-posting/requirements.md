# Requirements Document

## Introduction

Cette fonctionnalité permet de publier automatiquement le post Instagram du jour à 12h30. Le système identifie le post prévu pour la date actuelle et déclenche sa publication via l'API Instagram existante, sans intervention manuelle.

## Glossary

- **Scheduler**: Service responsable de déclencher la publication automatique à l'heure configurée
- **Post_du_Jour**: Post dont la date correspond à la date actuelle
- **Edge_Function**: Fonction serverless Supabase qui exécute la logique de publication
- **Cron_Job**: Tâche planifiée qui s'exécute à intervalles réguliers
- **Publication_Status**: État du post (publié/non publié)

## Requirements

### Requirement 1: Identification du Post du Jour

**User Story:** As a content manager, I want the system to automatically identify today's post, so that the correct content is published each day.

#### Acceptance Criteria

1. WHEN the scheduler triggers at 12h30, THE Scheduler SHALL query the database for posts matching today's date
2. WHEN multiple posts exist for the same date, THE Scheduler SHALL select the first unpublished post
3. WHEN no post exists for today's date, THE Scheduler SHALL log the absence and take no action
4. WHEN the identified post is already published, THE Scheduler SHALL skip publication and log the status

### Requirement 2: Publication Automatique

**User Story:** As a content manager, I want posts to be automatically published at 12h30, so that I don't need to manually publish each day.

#### Acceptance Criteria

1. WHEN a valid unpublished post is identified, THE Scheduler SHALL call the existing publish-instagram Edge Function
2. WHEN the publication succeeds, THE Scheduler SHALL update the post status to published in the database
3. WHEN the publication fails, THE Scheduler SHALL log the error with details and retain the post as unpublished
4. THE Scheduler SHALL execute daily at 12h30 Paris time (Europe/Paris timezone)

### Requirement 3: Validation Pré-Publication

**User Story:** As a content manager, I want the system to validate posts before publishing, so that incomplete posts are not sent to Instagram.

#### Acceptance Criteria

1. WHEN a post has no imageUrl or an invalid imageUrl (Base64), THE Scheduler SHALL skip publication and log a warning
2. WHEN a post has an empty caption, THE Scheduler SHALL skip publication and log a warning
3. WHEN a post is marked as isClientManaged, THE Scheduler SHALL skip automatic publication

### Requirement 4: Logging et Monitoring

**User Story:** As a system administrator, I want detailed logs of scheduled publications, so that I can monitor and debug the automation.

#### Acceptance Criteria

1. WHEN the scheduler runs, THE Scheduler SHALL log the start time, post identified, and outcome
2. WHEN an error occurs, THE Scheduler SHALL log the error message, post ID, and timestamp
3. THE Scheduler SHALL store publication history in a dedicated table for audit purposes

### Requirement 5: Configuration du Scheduler

**User Story:** As a developer, I want to configure the scheduling via Supabase, so that the automation runs reliably in production.

#### Acceptance Criteria

1. THE Scheduler SHALL be implemented as a Supabase Edge Function triggered by pg_cron
2. WHEN the cron job is configured, THE Scheduler SHALL use the expression for 12h30 Paris time
3. THE Scheduler SHALL handle timezone conversion correctly for Europe/Paris
