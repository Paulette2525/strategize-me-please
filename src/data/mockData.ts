import { Project, Campaign, ContentItem, BudgetEntry } from '@/types/marketing';

export const mockProjects: Project[] = [
  {
    id: 'p1', name: 'E-commerce Mode', description: 'Stratégie marketing pour la boutique en ligne de vêtements',
    status: 'active', budget: 45000, spent: 28500, channels: ['seo', 'ads', 'social', 'email'],
    startDate: '2024-01-15', color: '#3b82f6', campaignCount: 8, roi: 3.2,
  },
  {
    id: 'p2', name: 'App Fitness', description: 'Lancement de l\'application mobile de coaching sportif',
    status: 'active', budget: 32000, spent: 19800, channels: ['ads', 'social', 'influencer', 'content'],
    startDate: '2024-02-01', color: '#10b981', campaignCount: 5, roi: 2.8,
  },
  {
    id: 'p3', name: 'SaaS B2B CRM', description: 'Acquisition clients pour le logiciel CRM entreprise',
    status: 'active', budget: 60000, spent: 41200, channels: ['seo', 'ads', 'email', 'content', 'pr'],
    startDate: '2023-11-01', color: '#8b5cf6', campaignCount: 12, roi: 4.1,
  },
  {
    id: 'p4', name: 'Restaurant Bio', description: 'Notoriété locale pour le restaurant bio & vegan',
    status: 'paused', budget: 8000, spent: 5600, channels: ['social', 'influencer'],
    startDate: '2024-03-01', color: '#f59e0b', campaignCount: 3, roi: 1.5,
  },
  {
    id: 'p5', name: 'Formation en ligne', description: 'Vente de cours en ligne développement web',
    status: 'active', budget: 25000, spent: 16300, channels: ['ads', 'email', 'content', 'affiliate'],
    startDate: '2024-01-10', color: '#ec4899', campaignCount: 6, roi: 5.2,
  },
];

export const mockCampaigns: Campaign[] = [
  { id: 'c1', projectId: 'p1', name: 'Soldes d\'été - Google Ads', channel: 'ads', status: 'active', budget: 8000, spent: 5200, startDate: '2024-06-01', endDate: '2024-07-15', objectives: 'Générer 500 ventes', roi: 3.5, impressions: 250000, clicks: 12500, conversions: 420 },
  { id: 'c2', projectId: 'p1', name: 'SEO Blog Mode', channel: 'seo', status: 'active', budget: 3000, spent: 2100, startDate: '2024-01-15', endDate: '2024-12-31', objectives: '+50% trafic organique', roi: 4.2, impressions: 180000, clicks: 22000, conversions: 180 },
  { id: 'c3', projectId: 'p1', name: 'Newsletter Hebdo', channel: 'email', status: 'active', budget: 2000, spent: 1400, startDate: '2024-01-15', endDate: '2024-12-31', objectives: '25% taux d\'ouverture', roi: 5.1, impressions: 50000, clicks: 12500, conversions: 310 },
  { id: 'c4', projectId: 'p2', name: 'Lancement Instagram', channel: 'social', status: 'completed', budget: 5000, spent: 4800, startDate: '2024-02-01', endDate: '2024-04-30', objectives: '10k followers', roi: 2.1, impressions: 500000, clicks: 45000, conversions: 890 },
  { id: 'c5', projectId: 'p2', name: 'Partenariat Influenceurs', channel: 'influencer', status: 'active', budget: 12000, spent: 7500, startDate: '2024-03-15', endDate: '2024-08-31', objectives: '50 partenariats', roi: 3.4, impressions: 1200000, clicks: 85000, conversions: 1200 },
  { id: 'c6', projectId: 'p3', name: 'LinkedIn Ads B2B', channel: 'ads', status: 'active', budget: 15000, spent: 11200, startDate: '2024-01-01', endDate: '2024-06-30', objectives: '200 leads qualifiés', roi: 4.5, impressions: 320000, clicks: 8900, conversions: 156 },
  { id: 'c7', projectId: 'p3', name: 'Webinaires mensuels', channel: 'content', status: 'active', budget: 5000, spent: 3200, startDate: '2024-02-01', endDate: '2024-12-31', objectives: '12 webinaires, 100 inscrits/mois', roi: 6.2, impressions: 45000, clicks: 5600, conversions: 340 },
  { id: 'c8', projectId: 'p3', name: 'Séquence Email Onboarding', channel: 'email', status: 'analyzed', budget: 2000, spent: 1800, startDate: '2024-01-15', endDate: '2024-03-31', objectives: '40% conversion trial→paid', roi: 8.1, impressions: 15000, clicks: 6200, conversions: 520 },
  { id: 'c9', projectId: 'p4', name: 'Stories Instagram local', channel: 'social', status: 'planned', budget: 2000, spent: 800, startDate: '2024-05-01', endDate: '2024-08-31', objectives: 'Engagement local', roi: 0, impressions: 25000, clicks: 3200, conversions: 45 },
  { id: 'c10', projectId: 'p5', name: 'Facebook Ads Cours JS', channel: 'ads', status: 'active', budget: 8000, spent: 5400, startDate: '2024-03-01', endDate: '2024-09-30', objectives: '300 inscriptions', roi: 5.8, impressions: 420000, clicks: 18000, conversions: 245 },
  { id: 'c11', projectId: 'p5', name: 'Programme Affiliation', channel: 'affiliate', status: 'active', budget: 6000, spent: 3800, startDate: '2024-02-15', endDate: '2024-12-31', objectives: '50 affiliés actifs', roi: 7.2, impressions: 180000, clicks: 12000, conversions: 380 },
  { id: 'c12', projectId: 'p1', name: 'Campagne TikTok Rentrée', channel: 'social', status: 'draft', budget: 6000, spent: 0, startDate: '2024-08-15', endDate: '2024-09-30', objectives: 'Viralité et notoriété', roi: 0, impressions: 0, clicks: 0, conversions: 0 },
];

export const mockContent: ContentItem[] = [
  { id: 'ct1', projectId: 'p1', campaignId: 'c2', title: '10 tendances mode automne 2024', type: 'article', status: 'published', channel: 'seo', createdAt: '2024-04-10', publishedAt: '2024-04-15', author: 'Marie D.' },
  { id: 'ct2', projectId: 'p1', campaignId: 'c3', title: 'Newsletter - Nouveautés Mai', type: 'email', status: 'published', channel: 'email', createdAt: '2024-04-28', publishedAt: '2024-05-01', author: 'Julie R.' },
  { id: 'ct3', projectId: 'p2', campaignId: 'c4', title: 'Vidéo teaser App Fitness', type: 'video', status: 'published', channel: 'social', createdAt: '2024-02-10', publishedAt: '2024-02-14', author: 'Thomas L.' },
  { id: 'ct4', projectId: 'p3', campaignId: 'c7', title: 'Webinaire: CRM pour PME', type: 'landing-page', status: 'published', channel: 'content', createdAt: '2024-03-01', publishedAt: '2024-03-15', author: 'Pierre M.' },
  { id: 'ct5', projectId: 'p5', campaignId: 'c10', title: 'Carrousel: Pourquoi apprendre JS', type: 'visual', status: 'review', channel: 'social', createdAt: '2024-05-20', author: 'Sophie K.' },
  { id: 'ct6', projectId: 'p1', title: 'Guide complet: Choisir sa taille', type: 'article', status: 'writing', channel: 'seo', createdAt: '2024-05-25', author: 'Marie D.' },
  { id: 'ct7', projectId: 'p3', title: 'Étude de cas: PME Digitale', type: 'article', status: 'idea', channel: 'content', createdAt: '2024-05-28', author: 'Pierre M.' },
  { id: 'ct8', projectId: 'p2', campaignId: 'c5', title: 'Brief influenceur fitness', type: 'post', status: 'published', channel: 'influencer', createdAt: '2024-03-20', publishedAt: '2024-03-25', author: 'Thomas L.' },
  { id: 'ct9', projectId: 'p4', campaignId: 'c9', title: 'Photos plats signature', type: 'visual', status: 'idea', channel: 'social', createdAt: '2024-05-30', author: 'Claire B.' },
  { id: 'ct10', projectId: 'p5', title: 'Email séquence bienvenue', type: 'email', status: 'writing', channel: 'email', createdAt: '2024-06-01', author: 'Sophie K.' },
];

export const mockBudgetEntries: BudgetEntry[] = [
  { id: 'b1', projectId: 'p1', campaignId: 'c1', channel: 'ads', amount: 2800, date: '2024-06-01', description: 'Google Ads - Juin' },
  { id: 'b2', projectId: 'p1', campaignId: 'c1', channel: 'ads', amount: 2400, date: '2024-06-15', description: 'Google Ads - Mi-juin' },
  { id: 'b3', projectId: 'p2', campaignId: 'c5', channel: 'influencer', amount: 3500, date: '2024-04-01', description: 'Pack 10 influenceurs' },
  { id: 'b4', projectId: 'p3', campaignId: 'c6', channel: 'ads', amount: 5600, date: '2024-03-01', description: 'LinkedIn Ads Q1' },
  { id: 'b5', projectId: 'p3', campaignId: 'c6', channel: 'ads', amount: 5600, date: '2024-04-01', description: 'LinkedIn Ads Q2' },
  { id: 'b6', projectId: 'p5', campaignId: 'c10', channel: 'ads', amount: 2700, date: '2024-04-01', description: 'Facebook Ads Avril' },
  { id: 'b7', projectId: 'p5', campaignId: 'c10', channel: 'ads', amount: 2700, date: '2024-05-01', description: 'Facebook Ads Mai' },
];
