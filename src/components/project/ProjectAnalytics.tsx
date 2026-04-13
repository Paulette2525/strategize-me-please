import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ACTION_STATUS_LABELS } from '@/types/marketing';

export default function ProjectAnalytics({ projectId }: { projectId: string }) {
  const { getTasksByProject, getActionsByProject, collaborators, getProjectById } = useMarketing();
  const project = getProjectById(projectId);
  const tasks = getTasksByProject(projectId);
  const actions = getActionsByProject(projectId);

  if (!project) return null;

  const taskStats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length,
  };
  const taskCompletion = taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0;

  // Collaborator performance on this project
  const projectCollabIds = [...new Set(tasks.map(t => t.assigneeId).filter(Boolean))];
  const collabPerf = projectCollabIds.map(cid => {
    const collab = collaborators.find(c => c.id === cid);
    const collabTasks = tasks.filter(t => t.assigneeId === cid);
    const done = collabTasks.filter(t => t.status === 'done').length;
    const overdue = collabTasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length;
    return { collab, total: collabTasks.length, done, overdue };
  }).filter(c => c.collab);

  // Action performance
  const actionPerf = actions.map(a => ({
    name: a.name,
    type: a.type,
    status: a.status,
    spent: a.spent,
    impressions: a.metrics.impressions,
    clicks: a.metrics.clicks,
    conversions: a.metrics.conversions,
    revenue: a.metrics.revenue,
    roi: a.spent > 0 ? Math.round(((a.metrics.revenue - a.spent) / a.spent) * 100) : 0,
  }));

  const totalSpent = actions.reduce((s, a) => s + a.spent, 0);
  const totalRevenue = actions.reduce((s, a) => s + a.metrics.revenue, 0);
  const globalROI = totalSpent > 0 ? Math.round(((totalRevenue - totalSpent) / totalSpent) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Progression', value: `${taskCompletion}%`, color: 'text-foreground' },
          { label: 'Tâches terminées', value: `${taskStats.done}/${taskStats.total}`, color: 'text-success' },
          { label: 'En retard', value: taskStats.overdue, color: taskStats.overdue > 0 ? 'text-destructive' : 'text-foreground' },
          { label: 'ROI Global', value: `${globalROI}%`, color: globalROI >= 0 ? 'text-success' : 'text-destructive' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">Progression du Projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{taskStats.done} tâches terminées sur {taskStats.total}</span>
            <span className="font-medium">{taskCompletion}%</span>
          </div>
          <Progress value={taskCompletion} className="h-3" />
        </CardContent>
      </Card>

      {/* Action performance table */}
      {actionPerf.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Performance des Actions Marketing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Action</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Statut</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Dépensé</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Clics</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Conv.</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Revenus</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {actionPerf.map((a, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-2">
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.type}</p>
                      </td>
                      <td className="py-2 px-2">
                        <Badge variant="secondary" className="text-[10px]">{ACTION_STATUS_LABELS[a.status]}</Badge>
                      </td>
                      <td className="text-right py-2 px-2">{a.spent.toLocaleString()} €</td>
                      <td className="text-right py-2 px-2">{a.clicks.toLocaleString()}</td>
                      <td className="text-right py-2 px-2">{a.conversions.toLocaleString()}</td>
                      <td className="text-right py-2 px-2">{a.revenue.toLocaleString()} €</td>
                      <td className={`text-right py-2 px-2 font-medium ${a.roi >= 0 ? 'text-success' : 'text-destructive'}`}>{a.roi}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collaborator performance */}
      {collabPerf.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Performance des Collaborateurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {collabPerf.map(cp => (
              <div key={cp.collab!.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground" style={{ backgroundColor: cp.collab!.color }}>
                  {cp.collab!.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{cp.collab!.name}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{cp.done}/{cp.total} terminées</span>
                    {cp.overdue > 0 && <span className="text-destructive">{cp.overdue} en retard</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-heading font-bold">{cp.total > 0 ? Math.round((cp.done / cp.total) * 100) : 0}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {actions.length === 0 && tasks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12 text-sm text-muted-foreground">
            Ajoutez des tâches et des actions marketing pour voir les analytics
          </CardContent>
        </Card>
      )}
    </div>
  );
}
