import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TASK_STATUS_LABELS } from '@/types/marketing';

export default function ProjectOverview({ projectId }: { projectId: string }) {
  const { getProjectById, getCampaignsByProject, getTasksByProject, getContentByProject, collaborators } = useMarketing();
  const project = getProjectById(projectId);
  const campaigns = getCampaignsByProject(projectId);
  const tasks = getTasksByProject(projectId);
  const content = getContentByProject(projectId);

  if (!project) return null;

  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const teamMembers = collaborators.filter(c => project.teamIds.includes(c.id));

  const stats = [
    { label: 'Campagnes', value: campaigns.length, sub: `${activeCampaigns} actives` },
    { label: 'Tâches', value: tasks.length, sub: `${doneTasks} terminées` },
    { label: 'Contenus', value: content.length, sub: `${content.filter(c => c.status === 'published').length} publiés` },
    { label: 'Équipe', value: teamMembers.length, sub: 'membres' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-heading font-bold">{s.value}</p>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{project.spent.toLocaleString()} € dépensé</span>
            <span className="font-medium">{project.budget.toLocaleString()} € total</span>
          </div>
          <Progress value={project.budget > 0 ? (project.spent / project.budget) * 100 : 0} className="h-2" />
        </CardContent>
      </Card>

      {/* Recent tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Tâches récentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune tâche</p>}
          {tasks.slice(0, 5).map(task => {
            const assignee = collaborators.find(c => c.id === task.assigneeId);
            return (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className={`h-2 w-2 rounded-full ${task.status === 'done' ? 'bg-success' : task.status === 'in_progress' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                <span className="text-sm flex-1 truncate">{task.title}</span>
                {assignee && (
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium text-primary-foreground" style={{ backgroundColor: assignee.color }}>
                    {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <Badge variant="outline" className="text-[10px]">{TASK_STATUS_LABELS[task.status]}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
