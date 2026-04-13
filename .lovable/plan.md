

## 3 modifications demandees

### 1. Description du plan d'action — champ multiligne
Dans `ProjectStrategy.tsx`, le champ description utilise actuellement un `Input` (une seule ligne). Le remplacer par un `Textarea` pour permettre les retours a la ligne.

### 2. Afficher la description des taches sur les cartes Kanban
Dans `ProjectTasks.tsx`, les cartes de taches affichent uniquement le titre. Ajouter l'affichage de `task.description` (tronquee a 2-3 lignes) sous le titre dans chaque carte du Kanban.

### 3. Supprimer l'onglet Finances
Dans `ProjectDetail.tsx` :
- Retirer l'entree `{ label: 'Finances', path: 'finances' }` du tableau `tabs`
- Retirer la route `<Route path="finances" ...>`
- Retirer l'import de `ProjectBudget`

### Fichiers modifies
- `src/components/project/ProjectStrategy.tsx` — `Input` → `Textarea` pour la description d'etape
- `src/components/project/ProjectTasks.tsx` — afficher `task.description` sur les cartes
- `src/pages/ProjectDetail.tsx` — supprimer onglet et route Finances

