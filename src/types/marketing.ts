export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type CampaignStatus = 'draft' | 'planned' | 'active' | 'completed' | 'analyzed';
export type ContentStatus = 'idea' | 'writing' | 'review' | 'published';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type Channel = 'seo' | 'ads' | 'email' | 'social' | 'content' | 'influencer' | 'affiliate' | 'pr';
export type CollaboratorRole = 'ceo' | 'manager' | 'marketer' | 'designer' | 'developer' | 'analyst' | 'copywriter';
export type ActionStatus = 'draft' | 'active' | 'completed' | 'analyzed';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  spent: number;
  channels: Channel[];
  startDate: string;
  endDate?: string;
  color: string;
  campaignCount: number;
  roi: number;
  teamIds: string[];
  objectives: string[];
  progress: number;
}

export interface ClientAvatar {
  name: string;
  age: string;
  occupation: string;
  problems: string[];
  desires: string[];
  objections: string[];
}

export interface ProjectBrief {
  id: string;
  projectId: string;
  avatar: ClientAvatar;
  targetAudience: string;
  market: string;
  positioning: string;
  keyMessage: string;
  notes: string;
}

export interface MarketingAction {
  id: string;
  projectId: string;
  name: string;
  type: string;
  description: string;
  status: ActionStatus;
  budget: number;
  spent: number;
  notes: string;
  contents: ActionContent[];
  metrics: ActionMetrics;
  createdAt: string;
  seoData?: SEOData;
  adsData?: AdsData;
  emailData?: EmailData;
  influencerData?: InfluencerData;
  affiliateData?: AffiliateData;
  contentPlanData?: ContentPlanData;
}

export interface ActionContent {
  id: string;
  title: string;
  type: string;
  status: ContentStatus;
  createdAt: string;
}

export interface ActionMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface FunnelStep {
  id: string;
  label: string;
  description: string;
}

export interface StrategyResource {
  id: string;
  label: string;
  url?: string;
  note?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: CollaboratorRole;
  color: string;
}

export interface TaskResource {
  id: string;
  label: string;
  url?: string;
  note?: string;
  type: 'link' | 'note' | 'schema';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  channel?: Channel;
  planStepId?: string;
  resources?: TaskResource[];
  notes?: string;
  createdAt: string;
  completionToken?: string;
  completedResources?: any[];
}

export interface SEOKeyword {
  id: string;
  keyword: string;
  volume: number;
  difficulty: string;
  position: number;
  page: string;
}

export interface SEOData {
  keywords: SEOKeyword[];
  backlinks: { id: string; domain: string; url: string; status: string }[];
  checklist: { id: string; label: string; done: boolean }[];
}

export interface AdsData {
  platform: string;
  dailyBudget: number;
  totalBudget: number;
  audiences: { id: string; name: string; size: string }[];
  creatives: { id: string; name: string; format: string; status: string }[];
  kpis: { cpm: number; cpc: number; ctr: number; roas: number };
}

export interface EmailData {
  segments: { id: string; name: string; size: number }[];
  sequences: { id: string; name: string; emails: number; status: string }[];
  kpis: { openRate: number; clickRate: number; unsubRate: number };
}

export interface InfluencerData {
  influencers: { id: string; name: string; platform: string; followers: string; budget: number; status: string }[];
}

export interface AffiliateData {
  affiliates: { id: string; name: string; commission: number; link: string; conversions: number; revenue: number }[];
}

export interface ContentPlanData {
  articles: { id: string; title: string; status: string; publishDate: string }[];
}

export interface ChannelDashboardEntry {
  id: string;
  channel: Channel;
  objective: string;
  budget: number;
  responsibleId: string;
  status: 'planned' | 'active' | 'optimizing' | 'paused';
}

export interface Strategy {
  id: string;
  projectId: string;
  objectives: string[];
  targetKPIs: { label: string; target: number; current: number }[];
  timeline: { phase: string; startDate: string; endDate: string; description: string }[];
  notes: string;
  activeChannels?: Channel[];
  funnel?: FunnelStep[];
  resources?: StrategyResource[];
  actionPlan?: { id: string; step: string; description: string; done: boolean }[];
}

export interface Campaign {
  id: string;
  projectId: string;
  name: string;
  channel: Channel;
  status: CampaignStatus;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  objectives: string;
  roi: number;
  impressions: number;
  clicks: number;
  conversions: number;
  assigneeId?: string;
}

export interface ContentItem {
  id: string;
  projectId: string;
  campaignId?: string;
  title: string;
  type: 'post' | 'email' | 'landing-page' | 'visual' | 'video' | 'article';
  status: ContentStatus;
  channel: Channel;
  createdAt: string;
  publishedAt?: string;
  author: string;
  assigneeId?: string;
}

export interface BudgetEntry {
  id: string;
  projectId: string;
  campaignId?: string;
  actionId?: string;
  channel: Channel;
  amount: number;
  date: string;
  description: string;
}

export interface KPI {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export const ACTION_TYPES = [
  'SEO', 'Publicité Facebook', 'Publicité Instagram', 'Publicité TikTok',
  'Publicité Google Ads', 'Email Marketing', 'Marketing de contenu',
  'Influence Marketing', 'Affiliation', 'Relations Presse', 'Réseaux sociaux',
  'Landing Page', 'Webinaire', 'Formation', 'Autre',
];

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  draft: 'Brouillon',
  active: 'En cours',
  completed: 'Terminé',
  analyzed: 'Analysé',
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  seo: 'SEO',
  ads: 'Publicité',
  email: 'Email',
  social: 'Réseaux sociaux',
  content: 'Contenu',
  influencer: 'Influenceur',
  affiliate: 'Affiliation',
  pr: 'Relations presse',
};

export const CHANNEL_COLORS: Record<Channel, string> = {
  seo: '#3b82f6',
  ads: '#ef4444',
  email: '#10b981',
  social: '#8b5cf6',
  content: '#f59e0b',
  influencer: '#ec4899',
  affiliate: '#06b6d4',
  pr: '#6366f1',
};

export const STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: 'Brouillon',
  planned: 'Planifié',
  active: 'En cours',
  completed: 'Terminé',
  analyzed: 'Analysé',
};

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  idea: 'Idée',
  writing: 'Rédaction',
  review: 'Review',
  published: 'Publié',
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Actif',
  paused: 'En pause',
  completed: 'Terminé',
  archived: 'Archivé',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  review: 'En review',
  done: 'Terminé',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente',
};

export const COLLABORATOR_ROLE_LABELS: Record<CollaboratorRole, string> = {
  ceo: 'CEO',
  manager: 'Manager',
  marketer: 'Marketeur',
  designer: 'Designer',
  developer: 'Développeur',
  analyst: 'Analyste',
  copywriter: 'Rédacteur',
};
