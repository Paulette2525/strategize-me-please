import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, FolderKanban, Users, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { COLLABORATOR_ROLE_LABELS } from '@/types/marketing';

export default function Dashboard() {
  const { projects, tasks, collaborators, campaigns } = useMarketing();
  const navigate = useNavigate();

  const activeProjects = projects.filter(p => p.status === 'active');
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const overdueTasks = tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date());
  const completedTasks = tasks.filter(t => t.status === 'done');
  const activeCampaigns = campaigns.filter(c => c.status === 'active');

  const kpis = [
    { label: 'Projets actifs', value: activeProjects.length, icon: FolderKanban, color: 'text-primary' },
    { label: 'Collaborateurs', value: collaborators.length, icon: Users, color: 'text-accent' },
    { label: 'Tâches terminées', value: `${completedTasks.length}/${tasks.length}`, icon: CheckCircle2, color: 'text-success' },
    { label: 'Tâches en retard', value: overdueTasks.length, icon: AlertTriangle, color: 'text-destructive' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard CEO</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de toutes vos stratégies marketing</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-heading font-bold mt-1">{kpi.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget global */}
      {totalBudget > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Budget Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {totalSpent.toLocaleString()} € / {totalBudget.toLocaleString()} €
              </span>
              <span className="text-sm font-medium">{Math.round((totalSpent / totalBudget) * 100)}%</span>
            </div>
            <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Progression projets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading">Progression des Projets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun projet actif. Créez votre premier projet pour commencer.
              </p>
            )}
            {activeProjects.slice(0, 5).map(project => (
              <div
                key={project.id}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}/overview`)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                  <span className="font-medium text-sm flex-1 truncate">{project.name}</span>
                  <Badge variant="secondary" className="text-xs">{project.progress}%</Badge>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tâches urgentes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading">Tâches Urgentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueTasks.length === 0 && tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune tâche urgente pour le moment.
              </p>
            )}
            {[...overdueTasks, ...tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done' && !overdueTasks.includes(t))]
              .slice(0, 5)
              .map(task => {
                const project = projects.find(p => p.id === task.projectId);
                const assignee = collaborators.find(c => c.id === task.assigneeId);
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
                return (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${isOverdue ? 'bg-destructive' : task.priority === 'urgent' ? 'bg-warning' : 'bg-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{project?.name} • {assignee?.name || 'Non assigné'}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>

      {/* Performance équipe */}
      {collaborators.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading">Performance de l'Équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {collaborators.slice(0, 6).map(collab => {
                const collabTasks = tasks.filter(t => t.assigneeId === collab.id);
                const done = collabTasks.filter(t => t.status === 'done').length;
                const total = collabTasks.length;
                return (
                  <div key={collab.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground shrink-0"
                      style={{ backgroundColor: collab.color }}
                    >
                      {collab.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{collab.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {COLLABORATOR_ROLE_LABELS[collab.role]} • {done}/{total} tâches
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
