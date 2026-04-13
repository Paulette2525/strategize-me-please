

## Supprimer Actions Marketing, lier Plan d'Action aux Taches

### Concept

Les etapes du **Plan d'Action** (page Strategie) deviennent les "projets parents" des taches. Quand on cree une tache, on choisit a quelle etape du plan elle appartient. Les badges sur le Kanban affichent l'etape liee au lieu de l'action marketing.

### Changements

**1. Supprimer la page Actions Marketing**
- Retirer l'onglet "Actions Marketing" de `ProjectDetail.tsx`
- Supprimer `src/components/project/ProjectActions.tsx` et `src/components/project/ActionDetail.tsx`
- Nettoyer le contexte : retirer les fonctions CRUD actions (`addAction`, `updateAction`, `deleteAction`, `getActionsByProject`, `getActionById`) de `MarketingContext.tsx`

**2. Remplacer `actionId` par `planStepId` sur les taches**
- Dans `src/types/marketing.ts` : remplacer `actionId?: string` par `planStepId?: string` sur le type `Task`
- Chaque tache sera rattachee a une etape du plan d'action via son `id`

**3. Modifier la creation de tache (`ProjectTasks.tsx`)**
- Remplacer le select "Action marketing liee" par "Etape du plan d'action"
- Lister les etapes du plan d'action du projet (depuis `getStrategyByProject`)
- Afficher le badge de l'etape liee sur chaque carte du Kanban (au lieu du badge action)

**4. Mettre a jour le contexte**
- Ajouter un getter `getTasksByPlanStep(stepId)` dans `MarketingContext.tsx`
- Retirer `getTasksByAction`

**5. Afficher le nombre de taches par etape dans le Plan d'Action (Strategie)**
- Dans `ProjectStrategy.tsx`, a cote de chaque etape, afficher un compteur de taches liees (ex: "3 taches")
- Permet de voir la progression directement depuis la strategie

### Fichiers impactes
- `src/pages/ProjectDetail.tsx` — retirer onglet Actions Marketing
- `src/components/project/ProjectActions.tsx` — supprimer
- `src/components/project/ActionDetail.tsx` — supprimer
- `src/types/marketing.ts` — `Task.actionId` → `Task.planStepId`
- `src/components/project/ProjectTasks.tsx` — select plan d'action + badges
- `src/components/project/ProjectStrategy.tsx` — compteur taches par etape
- `src/contexts/MarketingContext.tsx` — retirer CRUD actions, ajouter `getTasksByPlanStep`

