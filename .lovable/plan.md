

## 🚀 SaaS Marketing Strategy Manager — Plan Complet

### Vue d'ensemble
Un dashboard marketing tout-en-un pour gérer les stratégies de tous vos projets avec une vue globale et détaillée.

### Pages & Fonctionnalités

**1. Dashboard Global**
- Vue d'ensemble de tous les projets avec statuts et progression
- KPIs globaux : budget total, campagnes actives, tâches en cours, ROI estimé
- Graphiques : dépenses par projet, performance par canal, timeline des campagnes
- Alertes et notifications (deadlines, budgets dépassés)

**2. Gestion des Projets**
- Créer/modifier/archiver des projets (marques, clients, produits)
- Fiche projet avec objectifs, budget alloué, canaux utilisés, équipe
- Filtres et recherche avancée

**3. Campagnes & Calendrier Marketing**
- Calendrier interactif avec vue mois/semaine/jour
- Créer des campagnes avec : nom, canal (SEO, Ads, Email, Social, etc.), dates, budget, objectifs
- Statuts : Brouillon → Planifié → En cours → Terminé → Analysé
- Vue Kanban pour gérer le workflow des campagnes

**4. Suivi Budgets & ROI**
- Budget alloué vs dépensé par projet et par canal
- Tableau de suivi des dépenses avec graphiques
- Calcul ROI par campagne/canal/projet

**5. Gestion de Contenus & Assets**
- Liste de tous les contenus (posts, emails, landing pages, visuels)
- Statuts de production : Idée → Rédaction → Review → Publié
- Association contenu ↔ campagne ↔ projet

**6. Analytics & Rapports**
- Tableaux de bord personnalisables avec métriques clés
- Comparaison entre projets et entre périodes
- Vue par canal marketing (SEO, Paid, Social, Email, etc.)

**7. Sidebar Navigation**
- Navigation latérale avec : Dashboard, Projets, Campagnes, Calendrier, Budgets, Contenus, Analytics
- Barre de recherche globale

### Design
- Interface claire et moderne style SaaS (fond clair, accents bleus)
- Responsive desktop-first
- Composants shadcn/ui avec graphiques via Recharts

### Architecture technique
- Données stockées localement (localStorage) pour le prototype
- Structure prête pour une future connexion à Lovable Cloud/Supabase
- État global avec React Context

