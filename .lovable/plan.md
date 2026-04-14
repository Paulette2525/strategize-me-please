

## Plan : Page détail dynamique pour chaque tâche

### Objectif
Rendre chaque carte de tâche cliquable dans les Kanbans (ProjectTasks et PlanStepTasks). Un clic navigue vers une page dédiée `/projects/:id/task/:taskId` où l'utilisateur peut consulter les détails de la tâche et y ajouter des ressources (liens, stratégies, schémas, notes, fichiers).

### Fonctionnement

```text
Kanban → Clic sur une tâche "Créer landing page"
  → /projects/:id/task/:taskId
      ├── En-tête : titre, statut, priorité, assigné, échéance (éditables)
      ├── Description complète (éditable)
      ├── Section Ressources : ajouter des liens URL avec titre
      ├── Section Notes / Stratégie : zone de texte riche pour notes libres
      └── Bouton retour vers le Kanban d'origine
```

### Étapes d'implémentation

**1. Étendre le type `Task` dans `types/marketing.ts`**
- Ajouter un champ optionnel `resources?: TaskResource[]` avec `TaskResource = { id, label, url?, note?, type: 'link' | 'note' | 'schema' }`
- Ajouter un champ optionnel `notes?: string` pour les notes de stratégie libres

**2. Créer le composant `TaskDetail.tsx`**
- Récupère `taskId` depuis les params de route
- Affiche toutes les infos de la tâche avec possibilité d'édition inline
- Section "Ressources" : liste des liens/notes avec formulaire d'ajout (titre + URL + type)
- Section "Notes & Stratégie" : textarea pour écrire des notes libres, stratégies, schémas textuels
- Bouton retour intelligent (vers le Kanban du plan step si `planStepId` existe, sinon vers les tâches globales)
- Utilise `updateTask()` du contexte pour persister les modifications

**3. Ajouter la route dans `ProjectDetail.tsx`**
- Nouvelle route : `task/:taskId` → `<TaskDetail projectId={project.id} />`

**4. Modifier `ProjectTasks.tsx` et `PlanStepTasks.tsx`**
- Ajouter `useNavigate` et un `onClick` sur chaque carte de tâche
- Naviguer vers `/projects/${projectId}/task/${task.id}` au clic
- Utiliser `e.stopPropagation()` pour ne pas interférer avec le drag & drop (navigation uniquement si pas de drag)

### Fichiers concernés
- `src/types/marketing.ts` — ajout de `TaskResource` et champs sur `Task`
- `src/components/project/TaskDetail.tsx` — nouveau composant (page détail)
- `src/pages/ProjectDetail.tsx` — ajout de la route
- `src/components/project/ProjectTasks.tsx` — rendre les cartes cliquables
- `src/components/project/PlanStepTasks.tsx` — rendre les cartes cliquables

