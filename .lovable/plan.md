

## Restructuration complète de MarketPilot

### Probleme actuel
L'architecture actuelle est trop "flat" : les campagnes, contenus, budgets et analytics sont des pages globales sans isolation par projet. Il manque la gestion d'equipe, l'attribution de taches, et la vue CEO.

### Nouvelle architecture

```text
Pages:
  /                        → Dashboard CEO (vue globale cross-projets)
  /projects                → Liste des projets
  /projects/:id            → Fiche projet (sous-navigation interne)
    /projects/:id/overview    → Vue d'ensemble du projet
    /projects/:id/strategy    → Plan & strategie marketing
    /projects/:id/tasks       → Taches & attribution aux collaborateurs
    /projects/:id/campaigns   → Campagnes du projet (Kanban)
    /projects/:id/content     → Contenus lies au projet
    /projects/:id/budget      → Budget & ROI du projet
    /projects/:id/analytics   → Analytics du projet
  /team                    → Gestion equipe & collaborateurs
  /calendar                → Calendrier global (toutes campagnes/taches)
  /settings                → Parametres
```

### Pages supprimees (deviennent des sous-pages projet)
- `/campaigns` → devient `/projects/:id/campaigns`
- `/budgets` → devient `/projects/:id/budget`
- `/content` → devient `/projects/:id/content`
- `/analytics` → split entre dashboard CEO et `/projects/:id/analytics`

### Pages ajoutees
- **`/team`** : liste des collaborateurs, roles, charge de travail, performance
- **`/projects/:id/strategy`** : definir les objectifs, KPIs cibles, plan marketing, deadlines
- **`/projects/:id/tasks`** : taches avec assignation, deadlines, statuts, vue Kanban

### Nouveaux types de donnees

1. **Collaborator** : id, name, email, avatar, role (CEO, manager, marketer, designer, etc.)
2. **Task** : id, projectId, title, description, assigneeId, status (todo/in_progress/review/done), priority, dueDate, channel
3. **Strategy** : id, projectId, objectives, targetKPIs, timeline, notes
4. Ajout de `assigneeId` sur Campaign et ContentItem

### Changements cles

**Dashboard CEO (`/`)** :
- KPIs globaux (projets actifs, taches en retard, budget global, performance equipe)
- Progression de chaque projet (barre + objectifs)
- Taches urgentes cross-projets
- Performance des collaborateurs (taches completees, charge)
- Alertes (deadlines, budget depasse)

**Sidebar** : Dashboard, Projets, Equipe, Calendrier, Parametres (5 items au lieu de 7)

**Fiche Projet** (`/projects/:id`) :
- Layout avec sous-navigation (tabs ou sidebar interne)
- Chaque onglet charge les donnees filtrees pour ce projet uniquement
- Onglet Strategy : objectifs, KPIs cibles, plan d'action
- Onglet Tasks : Kanban par statut avec assignation collaborateur

**Page Equipe** (`/team`) :
- Liste des collaborateurs avec avatar, role, projets assignes
- Metriques par collaborateur : taches completees, en cours, en retard
- Vue charge de travail

### Implementation (7 etapes)

1. **Types & Context** : ajouter Collaborator, Task, Strategy au modele + mock data + fonctions CRUD dans le context
2. **Sidebar & Routing** : simplifier la sidebar, ajouter les routes dynamiques `/projects/:id/*`
3. **Dashboard CEO** : refondre Index.tsx avec KPIs globaux, progression projets, alertes, performance equipe
4. **Fiche Projet** : creer le layout projet avec sous-navigation et les 6 sous-pages (overview, strategy, tasks, campaigns, content, budget, analytics)
5. **Page Equipe** : collaborateurs, performance, charge de travail
6. **Taches & Assignation** : composant Kanban pour les taches avec drag conceptuel, assignation collaborateur, deadlines
7. **Calendrier global** : mise a jour pour inclure taches + campagnes cross-projets

### Design
- Meme stack (shadcn/ui, Recharts, Tailwind)
- Sous-navigation projet avec Tabs horizontaux
- Avatars collaborateurs sur les cartes de taches
- Indicateurs de priorite et retard visuels

