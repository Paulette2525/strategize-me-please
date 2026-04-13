

## Refonte des Actions Marketing & Strategie

### 1. Pages specifiques par type d'action

Quand l'utilisateur cree une action et clique dessus, le `ActionDetail` affiche une interface adaptee au type choisi :

**SEO** : Mots-cles cibles (tableau editable), pages a optimiser, backlinks, suivi de positions, checklist SEO technique
**Publicite Facebook/Instagram** : Audiences cibles, budget quotidien/total, creatives (visuels), A/B tests, KPIs (CPM, CPC, CTR, ROAS)
**Publicite TikTok** : Format video, audiences, budget, hashtags, KPIs specifiques TikTok
**Publicite Google Ads** : Mots-cles, groupes d'annonces, budget, CPC max, quality score
**Email Marketing** : Segments, sequences, taux d'ouverture, taux de clic, A/B tests objets
**Influence Marketing** : Liste d'influenceurs, budget par influenceur, portee estimee, livrables
**Affiliation** : Affilies, commissions, liens de tracking, conversions
**Marketing de contenu** : Calendrier editorial, articles, videos, statuts de production
**Autre / Custom** : Interface generique actuelle

Chaque type aura des sections et champs specifiques en plus des sections communes (Budget, Notes, Contenus).

### 2. Liaison Actions Marketing ↔ Taches

- Ajouter un champ optionnel `actionId` sur le type `Task`
- Dans `ActionDetail`, afficher les taches liees a cette action (filtrees par `actionId`)
- Permettre de creer une tache directement depuis une action (pre-remplie avec `actionId`)
- Dans le Kanban des taches, afficher un badge indiquant l'action marketing associee

### 3. Strategie — Supprimer le Funnel, refaire les Canaux

**Supprimer** : toute la section "Funnel Marketing (AIDA)" de `ProjectStrategy.tsx`

**Remplacer "Canaux Marketing Actifs"** par un vrai tableau de bord des canaux :
- Chaque canal actif affiche : objectif, budget alloue, responsable, statut (a lancer / en cours / optimisation)
- C'est un tableau editable, pas juste des badges
- Lien direct vers les actions marketing de ce canal

### Fichiers impactes

- `src/types/marketing.ts` — Ajouter `actionId?` sur Task, ajouter interfaces specifiques par type (SEOData, AdsData, etc.) sur MarketingAction
- `src/components/project/ActionDetail.tsx` — Refonte complete avec sections conditionnelles par type + taches liees
- `src/components/project/ProjectStrategy.tsx` — Supprimer funnel, refaire canaux en tableau editable
- `src/components/project/ProjectTasks.tsx` — Afficher badge action sur les cartes de taches
- `src/contexts/MarketingContext.tsx` — Ajouter getter taches par actionId

### Implementation

1. Mettre a jour les types (Task.actionId, ActionTypeData union)
2. Refondre ActionDetail avec layouts specifiques par type d'action
3. Supprimer le funnel de ProjectStrategy, remplacer canaux par tableau editable
4. Lier taches aux actions (creation depuis action, badge dans Kanban)
5. Mettre a jour le contexte (getTasksByAction)

