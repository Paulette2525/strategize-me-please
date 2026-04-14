import React, { createContext, useContext, useCallback, useEffect, ReactNode } from 'react';
import { Project, Campaign, ContentItem, BudgetEntry, Collaborator, Task, Strategy, MarketingAction, ProjectBrief } from '@/types/marketing';
import { mockProjects, mockCampaigns, mockContent, mockBudgetEntries, mockCollaborators, mockTasks, mockStrategies } from '@/data/mockData';
import { usePersistedState } from '@/hooks/usePersistedState';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface MarketingContextType {
  projects: Project[];
  campaigns: Campaign[];
  content: ContentItem[];
  budgetEntries: BudgetEntry[];
  collaborators: Collaborator[];
  tasks: Task[];
  strategies: Strategy[];
  briefs: ProjectBrief[];
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  addContent: (item: ContentItem) => void;
  updateContent: (id: string, data: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  updateCollaborator: (id: string, data: Partial<Collaborator>) => void;
  deleteCollaborator: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addStrategy: (strategy: Strategy) => void;
  updateStrategy: (id: string, data: Partial<Strategy>) => void;
  addBudgetEntry: (entry: BudgetEntry) => void;
  addBrief: (brief: ProjectBrief) => void;
  updateBrief: (id: string, data: Partial<ProjectBrief>) => void;
  getBriefByProject: (projectId: string) => ProjectBrief | undefined;
  getProjectById: (id: string) => Project | undefined;
  getCampaignsByProject: (projectId: string) => Campaign[];
  getContentByProject: (projectId: string) => ContentItem[];
  getTasksByProject: (projectId: string) => Task[];
  getTasksByAssignee: (assigneeId: string) => Task[];
  getStrategyByProject: (projectId: string) => Strategy | undefined;
  getCollaboratorById: (id: string) => Collaborator | undefined;
  getTasksByPlanStep: (stepId: string) => Task[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export function MarketingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = usePersistedState<Project[]>('mktg_projects', mockProjects);
  const [campaigns, setCampaigns] = usePersistedState<Campaign[]>('mktg_campaigns', mockCampaigns);
  const [content, setContent] = usePersistedState<ContentItem[]>('mktg_content', mockContent);
  const [budgetEntries, setBudgetEntries] = usePersistedState<BudgetEntry[]>('mktg_budget', mockBudgetEntries);
  const [collaborators, setCollaborators] = usePersistedState<Collaborator[]>('mktg_collaborators', mockCollaborators);
  const [strategies, setStrategies] = usePersistedState<Strategy[]>('mktg_strategies', mockStrategies);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  
  const [briefs, setBriefs] = usePersistedState<ProjectBrief[]>('mktg_briefs', []);
  const [searchQuery, setSearchQuery] = usePersistedState<string>('mktg_search', '');

  // Load tasks from DB
  useEffect(() => {
    if (!user) return;
    
    const loadTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);
      
      if (!error && data) {
        const mapped: Task[] = data.map((t: any) => ({
          id: t.id,
          projectId: t.project_id,
          title: t.title,
          description: t.description || '',
          assigneeId: t.assignee_id || '',
          status: t.status as any,
          priority: t.priority as any,
          dueDate: t.due_date || '',
          channel: t.channel || undefined,
          planStepId: t.plan_step_id || undefined,
          resources: t.resources || [],
          notes: t.notes || '',
          createdAt: t.created_at,
          completionToken: t.completion_token,
          completedResources: t.completed_resources || [],
        }));
        setTasks(mapped);
      }
      setTasksLoaded(true);
    };
    
    loadTasks();

    // Realtime subscription
    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const t = payload.new as any;
          setTasks(prev => {
            if (prev.find(p => p.id === t.id)) return prev;
            return [...prev, {
              id: t.id, projectId: t.project_id, title: t.title, description: t.description || '',
              assigneeId: t.assignee_id || '', status: t.status, priority: t.priority,
              dueDate: t.due_date || '', channel: t.channel || undefined,
              planStepId: t.plan_step_id || undefined, resources: t.resources || [],
              notes: t.notes || '', createdAt: t.created_at,
              completionToken: t.completion_token, completedResources: t.completed_resources || [],
            }];
          });
        } else if (payload.eventType === 'UPDATE') {
          const t = payload.new as any;
          setTasks(prev => prev.map(p => p.id === t.id ? {
            ...p, title: t.title, description: t.description || '',
            assigneeId: t.assignee_id || '', status: t.status, priority: t.priority,
            dueDate: t.due_date || '', channel: t.channel || undefined,
            planStepId: t.plan_step_id || undefined, resources: t.resources || [],
            notes: t.notes || '', completedResources: t.completed_resources || [],
          } : p));
        } else if (payload.eventType === 'DELETE') {
          const t = payload.old as any;
          setTasks(prev => prev.filter(p => p.id !== t.id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const addProject = useCallback((project: Project) => setProjects(prev => [...prev, project]), []);
  const updateProject = useCallback((id: string, data: Partial<Project>) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p)), []);
  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Delete tasks from DB for this project
    if (user) {
      supabase.from('tasks').delete().eq('project_id', id).eq('user_id', user.id).then(() => {});
    }
    setTasks(prev => prev.filter(t => t.projectId !== id));
    setCampaigns(prev => prev.filter(c => c.projectId !== id));
    setContent(prev => prev.filter(c => c.projectId !== id));
    setStrategies(prev => prev.filter(s => s.projectId !== id));
    setBriefs(prev => prev.filter(b => b.projectId !== id));
  }, [user]);

  const addCampaign = useCallback((campaign: Campaign) => setCampaigns(prev => [...prev, campaign]), []);
  const updateCampaign = useCallback((id: string, data: Partial<Campaign>) =>
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)), []);
  const deleteCampaign = useCallback((id: string) => setCampaigns(prev => prev.filter(c => c.id !== id)), []);

  const addContent = useCallback((item: ContentItem) => setContent(prev => [...prev, item]), []);
  const updateContent = useCallback((id: string, data: Partial<ContentItem>) =>
    setContent(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)), []);
  const deleteContent = useCallback((id: string) => setContent(prev => prev.filter(c => c.id !== id)), []);

  const addCollaborator = useCallback((collaborator: Collaborator) => setCollaborators(prev => [...prev, collaborator]), []);
  const updateCollaborator = useCallback((id: string, data: Partial<Collaborator>) =>
    setCollaborators(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)), []);
  const deleteCollaborator = useCallback((id: string) => setCollaborators(prev => prev.filter(c => c.id !== id)), []);

  const addTask = useCallback(async (task: Task) => {
    if (!user) return;
    // Insert into DB
    const { data, error } = await supabase.from('tasks').insert({
      id: task.id,
      user_id: user.id,
      project_id: task.projectId,
      title: task.title,
      description: task.description,
      assignee_id: task.assigneeId,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      channel: task.channel || null,
      plan_step_id: task.planStepId || null,
      resources: task.resources || [],
      notes: task.notes || '',
    } as any).select('completion_token').single();
    
    if (!error && data) {
      const newTask = { ...task, completionToken: (data as any).completion_token };
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } else {
      // Fallback: add locally
      setTasks(prev => [...prev, task]);
      return task;
    }
  }, [user]);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    // Update locally first
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    // Then sync to DB
    const dbData: any = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.assigneeId !== undefined) dbData.assignee_id = data.assigneeId;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.priority !== undefined) dbData.priority = data.priority;
    if (data.dueDate !== undefined) dbData.due_date = data.dueDate;
    if (data.channel !== undefined) dbData.channel = data.channel;
    if (data.planStepId !== undefined) dbData.plan_step_id = data.planStepId;
    if (data.resources !== undefined) dbData.resources = data.resources;
    if (data.notes !== undefined) dbData.notes = data.notes;
    
    if (Object.keys(dbData).length > 0) {
      await supabase.from('tasks').update(dbData).eq('id', id);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  }, []);

  const addStrategy = useCallback((strategy: Strategy) => setStrategies(prev => [...prev, strategy]), []);
  const updateStrategy = useCallback((id: string, data: Partial<Strategy>) =>
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, ...data } : s)), []);

  const addBudgetEntry = useCallback((entry: BudgetEntry) => setBudgetEntries(prev => [...prev, entry]), []);

  const addBrief = useCallback((brief: ProjectBrief) => setBriefs(prev => [...prev, brief]), []);
  const updateBrief = useCallback((id: string, data: Partial<ProjectBrief>) =>
    setBriefs(prev => prev.map(b => b.id === id ? { ...b, ...data } : b)), []);
  const getBriefByProject = useCallback((projectId: string) => briefs.find(b => b.projectId === projectId), [briefs]);

  const getProjectById = useCallback((id: string) => projects.find(p => p.id === id), [projects]);
  const getCampaignsByProject = useCallback((projectId: string) => campaigns.filter(c => c.projectId === projectId), [campaigns]);
  const getContentByProject = useCallback((projectId: string) => content.filter(c => c.projectId === projectId), [content]);
  const getTasksByProject = useCallback((projectId: string) => tasks.filter(t => t.projectId === projectId), [tasks]);
  const getTasksByAssignee = useCallback((assigneeId: string) => tasks.filter(t => t.assigneeId === assigneeId), [tasks]);
  const getStrategyByProject = useCallback((projectId: string) => strategies.find(s => s.projectId === projectId), [strategies]);
  const getCollaboratorById = useCallback((id: string) => collaborators.find(c => c.id === id), [collaborators]);
  const getTasksByPlanStep = useCallback((stepId: string) => tasks.filter(t => t.planStepId === stepId), [tasks]);

  return (
    <MarketingContext.Provider value={{
      projects, campaigns, content, budgetEntries, collaborators, tasks, strategies, briefs,
      addProject, updateProject, deleteProject,
      addCampaign, updateCampaign, deleteCampaign,
      addContent, updateContent, deleteContent,
      addCollaborator, updateCollaborator, deleteCollaborator,
      addTask, updateTask, deleteTask,
      addStrategy, updateStrategy,
      addBudgetEntry,
      addBrief, updateBrief, getBriefByProject,
      getProjectById, getCampaignsByProject, getContentByProject,
      getTasksByProject, getTasksByAssignee, getStrategyByProject, getCollaboratorById, getTasksByPlanStep,
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
