

## Refonte de l'interface projet MarketPilot

### Changements demandes

**1. Creation de projet** — Simplifier le formulaire
- Retirer le champ Budget du formulaire de creation
- Garder uniquement : Nom + Description
- Le budget sera gere plus tard dans la fiche projet

**2. Vue d'ensemble (Overview)** — Refonte complete
- Remplacer les stats generiques par un vrai brief projet :
  - **Avatar client** : persona cible (nom, age, problemes, desirs, objections)
  - **Cible** : audience, marche, segment
  - **Positionnement** : proposition de valeur unique, message cle
  - **Informations projet** : dates, equipe, description detaillee
- Ces donnees seront editables inline (cliquer pour modifier)
- Utiles pour creer des campagnes publicitaires, du contenu, etc.

**3. Strategie** — Refonte complete
- Remplacer objectifs/KPIs/notes par un vrai plan marketing :
  - **Canaux actifs** : liste des canaux marketing utilises sur ce projet
  - **Plan d'action** : tableau type Miro/whiteboard simplifie avec des etapes ordonnees
  - **Funnel marketing** : visualisation du parcours client (Attention → Interet → Desir → Action)
  - **Ressources** : liens, documents, notes importantes
- Chaque element est editable et sauvegarde

**4. Taches** — Ajouter le drag-and-drop
- Implementer un vrai glisser-deposer natif avec l'API HTML5 Drag & Drop
- Supprimer les boutons fleches actuels
- Les cartes de taches pourront etre glissees entre colonnes du Kanban

**5. Fusionner Campagnes + Contenus → "Actions Marketing"**
- Nouvelle page unique "Actions Marketing" remplacant les 2 onglets
- Creer une "action" avec :
  - **Nom** (texte libre)
  - **Type** : choix parmi une liste (SEO, Publicite Facebook, Publicite TikTok, Email Marketing, etc.) + champ libre pour ecrire un type custom
  - **Description**
- Chaque action est cliquable → ouvre une sous-page detaillee avec :
  - Donnees personnalisables (champs libres, tableaux, notes)
  - Budget alloue / depense pour cette action
  - Statut (Brouillon → En cours → Termine → Analyse)
  - Contenus lies (posts, visuels, videos crees pour cette action)
  - Resultats/metriques (impressions, clics, conversions)

**6. Budget** — Transformer en suivi financier utile
- Au lieu d'afficher des barres vides, montrer :
  - Budget global du projet (editable depuis cette page)
  - Tableau des depenses par action marketing avec dates
  - Possibilite d'ajouter des lignes de depense manuellement
  - Total depense vs budget restant
  - Graphique d'evolution des depenses dans le temps

**7. Analytics** — Rendre la page actionnable
- Tableau de bord avec :
  - Progression globale du projet (taches terminees / total)
  - Performance par action marketing (tableau comparatif)
  - Performance des collaborateurs sur ce projet
  - Timeline du projet (jalons, dates cles)
  - Indicateurs cles editables (objectifs vs resultats reels)

### Onglets du projet (nouveau)
```text
Vue d'ensemble | Strategie | Taches | Actions Marketing | Finances | Analytics
```
(6 onglets au lieu de 7 — Campagnes et Contenus fusionnes, Budget renomme Finances)

### Fichiers impactes
- `src/types/marketing.ts` — Nouveaux types : `MarketingAction`, `ClientAvatar`, `ProjectBrief`
- `src/contexts/MarketingContext.tsx` — CRUD pour les nouvelles entites
- `src/pages/Projects.tsx` — Retirer le champ budget du formulaire
- `src/pages/ProjectDetail.tsx` — Mettre a jour les onglets
- `src/components/project/ProjectOverview.tsx` — Refonte complete (brief + avatar client)
- `src/components/project/ProjectStrategy.tsx` — Refonte complete (plan marketing + funnel)
- `src/components/project/ProjectTasks.tsx` — Ajouter drag-and-drop, retirer boutons fleches
- Supprimer `ProjectCampaigns.tsx` et `ProjectContent.tsx`
- Creer `src/components/project/ProjectActions.tsx` — Nouvelle page fusionnee
- Creer `src/components/project/ActionDetail.tsx` — Vue detaillee d'une action
- `src/components/project/ProjectBudget.tsx` — Refonte (renomme Finances)
- `src/components/project/ProjectAnalytics.tsx` — Refonte

