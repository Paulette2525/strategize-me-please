import { useParams, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useMarketing } from '@/contexts/MarketingContext';
import { Badge } from '@/components/ui/badge';
import { PROJECT_STATUS_LABELS } from '@/types/marketing';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ProjectOverview from '@/components/project/ProjectOverview';
import ProjectStrategy from '@/components/project/ProjectStrategy';
import ProjectTasks from '@/components/project/ProjectTasks';

import ProjectAnalytics from '@/components/project/ProjectAnalytics';

const tabs = [
  { label: 'Vue d\'ensemble', path: 'overview' },
  { label: 'Stratégie', path: 'strategy' },
  { label: 'Tâches', path: 'tasks' },
  { label: 'Analytics', path: 'analytics' },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById } = useMarketing();
  const navigate = useNavigate();
  const project = getProjectById(id || '');

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Projet introuvable</p>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />Retour aux projets
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color }} />
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
          {PROJECT_STATUS_LABELS[project.status]}
        </Badge>
      </div>

      <nav className="flex gap-1 border-b overflow-x-auto">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={`/projects/${id}/${tab.path}`}
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="overview" element={<ProjectOverview projectId={project.id} />} />
        <Route path="strategy" element={<ProjectStrategy projectId={project.id} />} />
        <Route path="tasks" element={<ProjectTasks projectId={project.id} />} />
        <Route path="analytics" element={<ProjectAnalytics projectId={project.id} />} />
        <Route path="" element={<Navigate to="overview" replace />} />
      </Routes>
    </div>
  );
}
