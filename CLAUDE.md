# insta-automator

## Shopify — Conserverie Jean de Luz

| Clé | Valeur |
|---|---|
| Domaine CLI | `conserverie-jean-de-luz.myshopify.com` |
| URL publique | https://www.jeandeluz.com |
| Shop ID | `gid://shopify/Shop/48986849433` |
| Compte | `conserverie@jeandeluz.fr` |
| Scopes | `read_products`, `write_products`, `read_orders` |

### Commandes rapides

```bash
# Test connexion
shopify store execute --store conserverie-jean-de-luz.myshopify.com --query "query { shop { name } }"

# Lister les produits
shopify store execute --store conserverie-jean-de-luz.myshopify.com --query "query { products(first:10) { edges { node { id title } } } }" --json

# Si besoin de se ré-authentifier
shopify auth login
shopify store auth --store conserverie-jean-de-luz.myshopify.com --scopes="read_products,write_products,read_orders"
```

## Nouveautés & Déploiement (Mai 2026)

### Frontend (Cloud Run)
- [x] **Posts Mai & Juin 2026** : Visibles sur l'accueil et le calendrier.
- [x] **Bilans Historiques** : 2 nouvelles pages "Bilan Déc – Jan" et "Bilan Fév – Avr" avec données archivées.
- [x] **Navigation** : Mise à jour du menu latéral pour inclure les rapports.
- **Déploiement** : Push effectué sur la branche `main` (CI/CD Google Cloud).

### Backend (Supabase)
- [x] **Edge Functions** : Déploiement réussi de `instagram-insights`, `instagram-auth`, `instagram-callback`, `instagram-status`, `publish-instagram` et `scheduled-publish`.
- [ ] **Base de données** : Migration `003_create_stats_snapshots.sql` créée localement (nécessite application manuelle sur le dashboard Supabase car mot de passe DB requis pour `db push`).

### État de l'App
- Version : `0.1.2-alpha`
- Statut : En attente de validation des bilans archivés.
