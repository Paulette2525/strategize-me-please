

## Plan : Page externe de confirmation de tâche avec synchronisation en temps réel

### Objectif
Quand un collaborateur reçoit l'email de notification, un bouton le redirige vers une page publique externe (accessible sans connexion). Sur cette page, il peut marquer la tâche comme accomplie, ajouter des ressources (liens, notes, fichiers), et valider. Les modifications apparaissent en temps réel sur la plateforme.

### Pourquoi une base de données est nécessaire
Actuellement les tâches sont stockées dans le localStorage du navigateur. Pour qu'un collaborateur externe puisse modifier une tâche et que les changements apparaissent sur la plateforme, il faut migrer les tâches vers la base de données avec du temps réel.

### Architecture

```text
Email (bouton "Compléter ma tâche")
  → /task-complete/:token  (page publique, sans auth)
  → Edge Function valide le token
  → Collaborateur voit la tâche + formulaire ressources
  → Soumet → Edge Function met à jour la DB
  → Realtime Supabase → La plateforme se met à jour instantanément
```

### Etapes d'implémentation

**1. Créer la table `tasks` en base de données**
- Colonnes : id, project_id, title, description, assignee_id, status, priority, due_date, plan_step_id, resources (jsonb), notes, completion_token (unique, pour accès externe), completed_resources (jsonb, ressources ajoutées par le collaborateur), created_at
- Activer le realtime sur cette table
- RLS : lecture/écriture pour les utilisateurs authentifiés

**2. Créer la table `task_completions` pour les soumissions externes**
- Colonnes : id, task_id, token, resources (jsonb), message, completed_at
- RLS : insertion publique via token validé (via edge function)

**3. Créer une Edge Function `complete-task`**
- GET avec token : retourne les infos de la tâche (titre, description, projet, priorité, échéance)
- POST avec token + ressources : valide le token, met à jour le statut de la tâche en "done", enregistre les ressources, retourne succès
- Pas besoin d'authentification (accès via token unique)

**4. Créer la page publique `/task-complete/:token`**
- Route publique (hors ProtectedRoutes)
- Appelle l'edge function GET pour récupérer les infos de la tâche
- Affiche : titre, description, projet, priorité, échéance
- Formulaire : zone pour ajouter des ressources (liens, notes), message optionnel
- Bouton "Valider - Tâche accomplie"
- Après validation : écran de confirmation

**5. Modifier `notify-task-assigned` (Edge Function email)**
- Générer un `completion_token` unique lors de la création de tâche
- Ajouter un bouton CTA dans l'email : "✅ Compléter ma tâche" pointant vers `https://strategize-me-please.lovable.app/task-complete/{token}`

**6. Migrer le contexte pour utiliser la DB au lieu du localStorage**
- Les tâches sont lues/écrites depuis Supabase
- Abonnement realtime pour synchronisation instantanée
- Les ressources ajoutées par le collaborateur externe apparaissent automatiquement

**7. Modifier `ProjectTasks.tsx` et `PlanStepTasks.tsx`**
- Passer le `completion_token` à l'edge function email lors de la création
- Stocker le token dans la tâche en DB

### Fichiers concernés
- Migration SQL : table `tasks`, realtime
- `supabase/functions/complete-task/index.ts` — nouvelle edge function
- `supabase/functions/notify-task-assigned/index.ts` — ajout bouton + token
- `src/pages/TaskComplete.tsx` — nouvelle page publique
- `src/App.tsx` — route publique `/task-complete/:token`
- `src/contexts/MarketingContext.tsx` — migration vers DB pour les tâches
- `src/components/project/ProjectTasks.tsx` — envoi du token
- `src/components/project/PlanStepTasks.tsx` — envoi du token

