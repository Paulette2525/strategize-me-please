

## Plan : Page tâches dédiée par étape du plan d'action

### Objectif
Rendre chaque étape du Plan d'Action cliquable dans la page Stratégie. Un clic redirige vers une sous-page avec un Kanban filtré montrant uniquement les tâches liées à cette étape.

### Fonctionnement

```text
/projects/:id/strategy
  └── Clic sur "Étape 1 - Créer landing page"
        → /projects/:id/plan-step/:stepId
              └── Kanban (À faire | En cours | En review | Terminé)
                  avec uniquement les tâches de cette étape
```

### Étapes d'implémentation

**1. Créer un nouveau composant `PlanStepTasks.tsx`**
- Récupère `projectId` et `stepId` depuis les params de route
- Affiche le nom et la description de l'étape en en-tête avec un bouton retour vers la stratégie
- Réutilise le même Kanban que `ProjectTasks.tsx` mais filtré sur `task.planStepId === stepId`
- Permet de créer des tâches directement liées à cette étape (le `planStepId` est pré-rempli)

**2. Ajouter la route dans `ProjectDetail.tsx`**
- Nouvelle route : `plan-step/:stepId` qui rend `<PlanStepTasks />`

**3. Modifier `ProjectStrategy.tsx`**
- Rendre chaque étape du plan d'action cliquable avec `useNavigate`
- Au clic sur une étape → `navigate(\`/projects/${projectId}/plan-step/${step.id}\`)`
- Ajouter un indicateur visuel (icône flèche ou curseur pointer) pour montrer que c'est cliquable

### Fichiers concernés
- `src/components/project/PlanStepTasks.tsx` — nouveau composant
- `src/pages/ProjectDetail.tsx` — ajout de la route
- `src/components/project/ProjectStrategy.tsx` — rendre les étapes cliquables

