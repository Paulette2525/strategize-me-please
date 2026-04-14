

## Plan : Page de profil collaborateur avec statistiques de performance

### Objectif
Permettre au CEO de cliquer sur le nom d'un collaborateur dans la page Équipe pour accéder à une page de statistiques détaillées sur sa performance.

### Statistiques affichées

- **KPIs principaux** : Tâches terminées, en cours, en review, en retard, total assignées
- **Taux de complétion** : % de tâches terminées sur le total
- **Délai moyen de livraison** : Calculé entre `createdAt` et la date de complétion (quand statut = done)
- **Tâches en retard** : Nombre et liste des tâches dont la `dueDate` est dépassée
- **Répartition par priorité** : Nombre de tâches par niveau (urgente, haute, moyenne, basse)
- **Répartition par projet** : Sur combien de projets le collaborateur travaille, avec progression par projet
- **Score de fiabilité** : % de tâches livrées dans les délais vs en retard
- **Liste des tâches récentes** avec statut et date

### Implémentation

**1. Créer `src/pages/TeamMember.tsx`**
- Nouvelle page accessible via `/team/:collaboratorId`
- Récupère le collaborateur et ses tâches depuis le contexte
- Calcule toutes les statistiques ci-dessus
- Affiche des cartes KPI, une barre de progression, et la liste des tâches

**2. Modifier `src/pages/Team.tsx`**
- Rendre le nom du collaborateur cliquable (lien vers `/team/:collaboratorId`)
- Ajouter un curseur pointer et un style hover sur le nom

**3. Modifier `src/App.tsx`**
- Ajouter la route `/team/:collaboratorId` dans les routes protégées

### Fichiers concernés
- `src/pages/TeamMember.tsx` (nouveau)
- `src/pages/Team.tsx` (lien cliquable)
- `src/App.tsx` (nouvelle route)

