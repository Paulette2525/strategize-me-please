export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type CampaignStatus = 'draft' | 'planned' | 'active' | 'completed' | 'analyzed';
export type ContentStatus = 'idea' | 'writing' | 'review' | 'published';
export type Channel = 'seo' | 'ads' | 'email' | 'social' | 'content' | 'influencer' | 'affiliate' | 'pr';

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
}

export interface BudgetEntry {
  id: string;
  projectId: string;
  campaignId?: string;
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
