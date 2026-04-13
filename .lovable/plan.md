

## Plan : Notification email automatique à l'assignation d'une tâche

### Objectif
Quand une tâche est assignée (création ou réassignation) à un membre de l'équipe, un email est envoyé automatiquement à ce membre via la Edge Function Resend existante.

### Étapes

**1. Créer une Edge Function dédiée `notify-task-assigned`**

Une nouvelle Edge Function qui reçoit les détails de la tâche et du destinataire, construit un email HTML formaté (titre, description, échéance, nom du projet, priorité) et l'envoie via le connector gateway Resend — même pattern que `send-test-email`.

**2. Modifier `ProjectTasks.tsx` — envoi à la création**

Après `addTask(...)`, si un assigné est sélectionné et qu'il a un email, appeler `supabase.functions.invoke('notify-task-assigned', ...)` avec les infos de la tâche, du projet et du collaborateur.

**3. Modifier `ProjectTasks.tsx` — envoi au drag & drop (réassignation)**

Le drag & drop actuel ne change que le statut, pas l'assigné. Aucune modification nécessaire ici pour l'instant — la notification se déclenche uniquement à la création/assignation.

**4. Ajouter une possibilité de réassigner une tâche (optionnel)**

Si à l'avenir on ajoute la réassignation d'une tâche existante, le même appel sera ajouté.

### Détails techniques

- La Edge Function `notify-task-assigned` recevra : `{ to, taskTitle, taskDescription, taskPriority, taskDueDate, projectName }`
- L'email HTML sera stylisé avec les couleurs de l'app (bleu primaire, police Arial)
- L'expéditeur reste `Nodie Academy <noreplay@elyostalent.com>`
- Le sujet sera : `Nouvelle tâche assignée : {taskTitle}`
- Un toast de confirmation/erreur sera affiché côté UI après l'envoi

### Fichiers concernés

- `supabase/functions/notify-task-assigned/index.ts` (nouveau)
- `src/components/project/ProjectTasks.tsx` (modifié — appel après création)

