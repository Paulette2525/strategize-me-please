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
  createdAt: string;
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
