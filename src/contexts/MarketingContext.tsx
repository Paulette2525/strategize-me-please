import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Project, Campaign, ContentItem, BudgetEntry } from '@/types/marketing';
import { mockProjects, mockCampaigns, mockContent, mockBudgetEntries } from '@/data/mockData';

interface MarketingContextType {
  projects: Project[];
  campaigns: Campaign[];
  content: ContentItem[];
  budgetEntries: BudgetEntry[];
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  addContent: (item: ContentItem) => void;
  updateContent: (id: string, data: Partial<ContentItem>) => void;
  getCampaignsByProject: (projectId: string) => Campaign[];
  getContentByProject: (projectId: string) => ContentItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export function MarketingProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [budgetEntries] = useState<BudgetEntry[]>(mockBudgetEntries);
  const [searchQuery, setSearchQuery] = useState('');

  const addProject = useCallback((project: Project) => setProjects(prev => [...prev, project]), []);
  const updateProject = useCallback((id: string, data: Partial<Project>) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p)), []);
  const addCampaign = useCallback((campaign: Campaign) => setCampaigns(prev => [...prev, campaign]), []);
  const updateCampaign = useCallback((id: string, data: Partial<Campaign>) =>
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)), []);
  const addContent = useCallback((item: ContentItem) => setContent(prev => [...prev, item]), []);
  const updateContent = useCallback((id: string, data: Partial<ContentItem>) =>
    setContent(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)), []);
  const getCampaignsByProject = useCallback((projectId: string) =>
    campaigns.filter(c => c.projectId === projectId), [campaigns]);
  const getContentByProject = useCallback((projectId: string) =>
    content.filter(c => c.projectId === projectId), [content]);

  return (
    <MarketingContext.Provider value={{
      projects, campaigns, content, budgetEntries,
      addProject, updateProject, addCampaign, updateCampaign,
      addContent, updateContent, getCampaignsByProject, getContentByProject,
      searchQuery, setSearchQuery,
    }}>
      {children}
    </MarketingContext.Provider>
  );
}

export function useMarketing() {
  const ctx = useContext(MarketingContext);
  if (!ctx) throw new Error('useMarketing must be used within MarketingProvider');
  return ctx;
}
