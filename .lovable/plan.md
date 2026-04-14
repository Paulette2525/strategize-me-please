

## Plan : Flux de tâches structuré avec déclenchement manuel

### Objectif
Restructurer le flux de travail des tâches pour que l'email ne soit envoyé qu'au moment où le CEO déclenche manuellement la tâche, pas à la création.

### Nouveau flux
1. **Créer une tâche** → statut "À faire" (todo) — aucun email envoyé
2. **CEO clique "Déclencher"** → statut "En cours" (in_progress) — email envoyé au collaborateur à ce moment
3. **Collaborateur valide via le lien externe** → statut "En review" (review)
4. **CEO valide après examen** → statut "Terminé" (done)

### Modifications

**1. `src/components/project/ProjectTasks.tsx`**
- Supprimer l'envoi d'email automatique dans `handleCreate` (lignes 61-82)
- Ajouter un bouton "▶ Déclencher" sur chaque carte en statut `todo` (visible uniquement pour les tâches assignées)
- Créer une fonction `handleTriggerTask(taskId)` qui :
  - Met à jour le statut de la tâche à `in_progress`
  - Envoie l'email de notification au collaborateur assigné avec le `completionToken`
  - Affiche un toast de confirmation

**2. `src/components/project/PlanStepTasks.tsx`**
- Même modification : supprimer l'envoi d'email à la création
- Ajouter le même bouton "Déclencher" et la même logique

### Détails techniques
- Le bouton "Déclencher" sera un petit `Button` avec une icône `Play` de Lucide, affiché en bas de la carte de tâche uniquement quand `status === 'todo'` et `assigneeId` est défini
- Le clic sur le bouton appellera `updateTask(id, { status: 'in_progress' })` puis `supabase.functions.invoke('notify-task-assigned', ...)`
- Le bouton aura un `e.stopPropagation()` pour ne pas naviguer vers le détail de la tâche

### Fichiers concernés
- `src/components/project/ProjectTasks.tsx`
- `src/components/project/PlanStepTasks.tsx`

