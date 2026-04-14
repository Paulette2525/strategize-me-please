

## Plan : Tâches intégrées dans chaque étape du Plan d'Action

### Objectif
Rendre chaque étape du plan d'action cliquable pour afficher/masquer directement les tâches liées, sans quitter la page Stratégie.

### Approche
Utiliser un système d'accordéon : cliquer sur une étape du plan d'action déploie en dessous un mini-Kanban ou liste des tâches associées (filtrées par `planStepId`), avec la possibilité de créer une tâche directement liée à cette étape.

### Modifications

**1. `src/components/project/ProjectStrategy.tsx`**
- Ajouter un état `expandedStep` pour suivre l'étape ouverte
- Rendre chaque étape cliquable (clic = toggle expand)
- Sous chaque étape dépliée, afficher :
  - La liste des tâches liées (via `getTasksByPlanStep(step.id)`)
  - Chaque tâche avec son badge de priorité, statut, assigné et échéance
  - Un bouton "Ajouter une tâche" qui ouvre un dialog de création pré-rempli avec le `planStepId`
- Permettre de changer le statut d'une tâche directement depuis cette vue (via des boutons ou un select)

**2. Aucune modification de types ou de contexte nécessaire**
- `getTasksByPlanStep` existe déjà dans le contexte
- `addTask` et `updateTask` sont déjà disponibles
- Le champ `planStepId` existe sur les tâches

### Résultat
Chaque étape du plan affichera un compteur de tâches et, au clic, déroulera la liste complète des tâches avec possibilité d'en créer et d'en gérer le statut — le tout sans quitter l'onglet Stratégie.

