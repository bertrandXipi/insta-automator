# Guide : Ajouter une nouvelle période de 2 mois

Ce guide documente toutes les étapes pour étendre le planning éditorial avec une nouvelle période (ex: Avril-Mai 2026).

## Résumé des fichiers à modifier

| Fichier | Modification |
|---------|-------------|
| `types.ts` | Ajouter la nouvelle phase si nécessaire |
| `constants.ts` | Ajouter les nouveaux posts |
| `components/CalendarView.tsx` | Étendre le nombre de semaines + ajouter filtres |
| `components/HomeView.tsx` | Ajouter les filtres pour les nouveaux mois |
| `components/StrategyView.tsx` | Ajouter les filtres pour les nouveaux mois |

---

## Étape 1 : Ajouter une nouvelle phase (si nécessaire)

**Fichier : `types.ts`**

Si la nouvelle période correspond à une nouvelle "phase" éditoriale, l'ajouter au type `PostPhase` :

```typescript
// Avant
export type PostPhase = 'Fêtes' | 'Détox' | 'Printemps';

// Après (exemple pour été)
export type PostPhase = 'Fêtes' | 'Détox' | 'Printemps' | 'Été';
```

---

## Étape 2 : Ajouter les posts dans constants.ts

**Fichier : `constants.ts`**

### Structure d'un post

```typescript
{
  id: 'p53',                    // ID unique (incrémenter)
  week: 19,                     // Numéro de semaine (continuer la séquence)
  day: 'Lundi',                 // Jour de la semaine
  date: '01/04',                // Format DD/MM
  phase: 'Printemps',           // Phase éditoriale
  theme: 'Produit',             // Theme: Produit, Recette, Brand, Lifestyle, Event
  format: 'Photo',              // Format: Photo, Carousel, Reel, Story
  title: "Titre du post",
  caption: "Texte de la légende...",
  hashtags: ["#hashtag1", "#hashtag2"],
  cta: "Call to action",
  visualPrompt: "Description du visuel attendu",
  imageUrl: "https://picsum.photos/id/XXX/800/800",  // Image placeholder
  published: false,
  isClientManaged: false        // true si post géré par le client
}
```

### Convention de numérotation

- **Posts agence** : 10 posts/mois
- **Posts client** : 3 posts/mois (avec `isClientManaged: true`)
- **Total** : 13 posts/mois = 26 posts pour 2 mois

### Mapping semaines → mois (référence actuelle)

| Semaines | Mois | Phase |
|----------|------|-------|
| 1-5 | Décembre 2025 | Fêtes |
| 5-9 | Janvier 2026 | Détox |
| 10-13 | Février 2026 | Printemps |
| 14-18 | Mars 2026 | Printemps |
| 19-22 | Avril 2026 | (à définir) |
| 23-27 | Mai 2026 | (à définir) |

---

## Étape 3 : Mettre à jour CalendarView.tsx

**Fichier : `components/CalendarView.tsx`**

### 3.1 Étendre le nombre de semaines

```typescript
// Avant (18 semaines pour Dec-Mars)
const allWeeks = Array.from({ length: 18 }, (_, i) => i + 1);

// Après (27 semaines pour Dec-Mai)
const allWeeks = Array.from({ length: 27 }, (_, i) => i + 1);
```

### 3.2 Ajouter le type de filtre

```typescript
// Avant
type MonthFilter = 'all' | 'dec' | 'jan' | 'feb' | 'mar';

// Après
type MonthFilter = 'all' | 'dec' | 'jan' | 'feb' | 'mar' | 'apr' | 'may';
```

### 3.3 Ajouter le mapping semaines dans getWeeksForMonth

```typescript
const getWeeksForMonth = (filter: MonthFilter): number[] => {
  switch (filter) {
    case 'dec': return [1, 2, 3, 4, 5];
    case 'jan': return [5, 6, 7, 8, 9];
    case 'feb': return [10, 11, 12, 13];
    case 'mar': return [14, 15, 16, 17, 18];
    case 'apr': return [19, 20, 21, 22];      // NOUVEAU
    case 'may': return [23, 24, 25, 26, 27];  // NOUVEAU
    default: return allWeeks;
  }
};
```

### 3.4 Ajouter les boutons de filtre

Ajouter dans la section des boutons de filtre :

```tsx
<button
  onClick={() => setMonthFilter('apr')}
  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
    monthFilter === 'apr' 
      ? 'bg-orange-500 text-white'  // Couleur pour la nouvelle phase
      : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]'
  }`}
>
  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
  <span>Avril</span>
</button>
```

### 3.5 Mettre à jour l'affichage de la phase dans le calendrier

```typescript
// Dans le rendu des semaines, mettre à jour la logique de phase
<span className={`text-xs uppercase font-bold mt-1 ${
  week <= 5 ? 'text-red-500 dark:text-jdl-red' : 
  week <= 9 ? 'text-teal-600 dark:text-jdl-teal' : 
  week <= 18 ? 'text-green-600 dark:text-green-400' :
  'text-orange-600 dark:text-orange-400'  // NOUVEAU
}`}>
  {week <= 5 ? 'Fêtes' : week <= 9 ? 'Détox' : week <= 18 ? 'Printemps' : 'Été'}
</span>
```

---

## Étape 4 : Mettre à jour HomeView.tsx

**Fichier : `components/HomeView.tsx`**

### 4.1 Ajouter le type de filtre

```typescript
type MonthFilter = 'all' | 'dec' | 'jan' | 'feb' | 'mar' | 'apr' | 'may';
```

### 4.2 Ajouter le filtrage des posts

```typescript
// Après springPosts
const summerPosts = sortedPosts.filter(p => p.phase === 'Été');

const aprilPosts = summerPosts.filter(p => {
  const month = parseInt(p.date.split('/')[1]);
  return month === 4;
});
const mayPosts = summerPosts.filter(p => {
  const month = parseInt(p.date.split('/')[1]);
  return month === 5;
});
```

### 4.3 Ajouter les boutons de filtre

Même structure que CalendarView, avec les couleurs correspondantes.

### 4.4 Ajouter les sections d'affichage

```tsx
{/* Avril */}
{(monthFilter === 'all' || monthFilter === 'apr') && aprilPosts.length > 0 && (
  <section>
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Avril</h2>
      <span className="text-sm text-gray-500">({aprilPosts.length} posts)</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {aprilPosts.map(post => (
        // ... rendu du post
      ))}
    </div>
  </section>
)}
```

---

## Étape 5 : Mettre à jour StrategyView.tsx

**Fichier : `components/StrategyView.tsx`**

Mêmes modifications que HomeView.tsx :
- Ajouter le type MonthFilter
- Ajouter le filtrage des posts
- Ajouter les boutons de filtre
- Ajouter les sections d'affichage

---

## Étape 6 : Synchronisation Supabase

La fonction `syncNewPosts()` dans `services/database.ts` synchronise automatiquement les nouveaux posts au chargement de l'app. Aucune modification nécessaire.

---

## Étape 7 : Déploiement

```bash
# 1. Créer une branche depuis dev
git checkout dev
git pull origin dev
git checkout -b feature/april-may-posts

# 2. Faire les modifications

# 3. Commit
git add .
git commit -m "feat: add April-May 2026 posts with month filters"

# 4. Push et merge dans dev
git push origin feature/april-may-posts
git checkout dev
git merge feature/april-may-posts
git push origin dev

# 5. Déployer en production (merge dans main)
git checkout main
git merge dev -m "Add April-May 2026 period"
git push origin main
```

---

## Checklist finale

- [ ] Phase ajoutée dans `types.ts` (si nouvelle)
- [ ] Posts ajoutés dans `constants.ts` (26 posts = 10 agence + 3 client × 2 mois)
- [ ] `CalendarView.tsx` : semaines étendues + filtres + affichage phase
- [ ] `HomeView.tsx` : filtres + sections mois
- [ ] `StrategyView.tsx` : filtres + sections mois
- [ ] Test local (`npm run dev`)
- [ ] Commit sur branche feature depuis dev
- [ ] Merge dans dev puis main
- [ ] Vérifier le build Cloud Build

---

## Historique des périodes

| Période | Date ajout | Commit |
|---------|-----------|--------|
| Déc 2025 - Jan 2026 | Initial | - |
| Fév - Mars 2026 | 31/01/2026 | `8f18bf7` |
