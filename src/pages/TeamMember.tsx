import { useParams, useNavigate } from 'react-router-dom';
import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp, Timer, Shield } from 'lucide-react';
import { COLLABORATOR_ROLE_LABELS } from '@/types/marketing';

export default function TeamMember() {
  const { collaboratorId } = useParams<{ collaboratorId: string }>();
  const navigate = useNavigate();
  const { collaborators, tasks, projects } = useMarketing();

  const collab = collaborators.find(c => c.id === collaboratorId);
  if (!collab) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Collaborateur introuvable</p>
        <Button variant="outline" onClick={() => navigate('/team')}>
          <ArrowLeft className="h-4 w-4 mr-2" />Retour
        </Button>
      </div>
    );
  }

  const allTasks = tasks.filter(t => t.assigneeId === collab.id);
  const done = allTasks.filter(t => t.status === 'done');
  const inProgress = allTasks.filter(t => t.status === 'in_progress');
  const inReview = allTasks.filter(t => t.status === 'review');
  const todo = allTasks.filter(t => t.status === 'todo');
  const now = new Date();
  const overdue = allTasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < now);
  const completionRate = allTasks.length > 0 ? Math.round((done.length / allTasks.length) * 100) : 0;

  // Average delivery time (days between createdAt and now for done tasks)
  const deliveryTimes = done
    .filter(t => t.createdAt)
    .map(t => {
      const created = new Date(t.createdAt);
      const due = t.dueDate ? new Date(t.dueDate) : now;
      return Math.max(0, Math.round((due.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
    });
  const avgDelivery = deliveryTimes.length > 0 ? Math.round(deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length) : 0;

  // Reliability: % of done tasks delivered before dueDate
  const doneWithDue = done.filter(t => t.dueDate);
  const onTime = doneWithDue.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate >= new Date(t.createdAt);
  });
  const reliability = doneWithDue.length > 0 ? Math.round((onTime.length / doneWithDue.length) * 100) : 100;

  // By priority
  const byPriority = { urgent: 0, high: 0, medium: 0, low: 0 };
  allTasks.forEach(t => { if (t.priority in byPriority) byPriority[t.priority as keyof typeof byPriority]++; });

  // By project
  const projectIds = [...new Set(allTasks.map(t => t.projectId))];
  const projectStats = projectIds.map(pid => {
    const proj = projects.find(p => p.id === pid);
    const pTasks = allTasks.filter(t => t.projectId === pid);
    const pDone = pTasks.filter(t => t.status === 'done').length;
    return { name: proj?.name || 'Projet inconnu', total: pTasks.length, done: pDone, pct: pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0 };
  });

  const priorityColors: Record<string, string> = { urgent: 'text-destructive', high: 'text-orange-500', medium: 'text-primary', low: 'text-muted-foreground' };
  const priorityLabels: Record<string, string> = { urgent: 'Urgente', high: 'Haute', medium: 'Moyenne', low: 'Basse' };
  const statusLabels: Record<string, string> = { todo: 'À faire', in_progress: 'En cours', in_review: 'En review', done: 'Terminée' };
  const statusColors: Record<string, string> = { todo: 'secondary', in_progress: 'default', in_review: 'outline', done: 'default' };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/team')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground"
            style={{ backgroundColor: collab.color }}
          >
            {collab.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">{collab.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{COLLABORATOR_ROLE_LABELS[collab.role]}</Badge>
              {collab.email && <span className="text-sm text-muted-foreground">{collab.email}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <ListTodo className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold">{allTasks.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
            <p className="text-2xl font-bold text-emerald-600">{done.length}</p>
            <p className="text-xs text-muted-foreground">Terminées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold text-blue-600">{inProgress.length}</p>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold text-amber-600">{inReview.length}</p>
            <p className="text-xs text-muted-foreground">En review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-destructive" />
            <p className="text-2xl font-bold text-destructive">{overdue.length}</p>
            <p className="text-xs text-muted-foreground">En retard</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold text-primary">{reliability}%</p>
            <p className="text-xs text-muted-foreground">Fiabilité</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress & Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Progress value={completionRate} className="flex-1 h-3" />
              <span className="text-lg font-bold">{completionRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{done.length} terminées sur {allTasks.length} assignées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Délai moyen de livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{avgDelivery}</span>
              <span className="text-muted-foreground">jours</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Basé sur {deliveryTimes.length} tâche{deliveryTimes.length > 1 ? 's' : ''} terminée{deliveryTimes.length > 1 ? 's' : ''}</p>
          </CardContent>
        </Card>
      </div>

      {/* Priority breakdown & Project breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Répartition par priorité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(byPriority).map(([key, count]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${priorityColors[key]}`}>{priorityLabels[key]}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${allTasks.length > 0 ? (count / allTasks.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Répartition par projet</CardTitle>
          </CardHeader>
          <CardContent>
            {projectStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun projet assigné</p>
            ) : (
              <div className="space-y-3">
                {projectStats.map((ps, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium truncate">{ps.name}</span>
                      <span className="text-muted-foreground">{ps.done}/{ps.total}</span>
                    </div>
                    <Progress value={ps.pct} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent tasks */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tâches assignées ({allTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {allTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune tâche assignée</p>
          ) : (
            <div className="divide-y">
              {allTasks.slice(0, 20).map(task => (
                <div key={task.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.dueDate ? `Échéance : ${new Date(task.dueDate).toLocaleDateString('fr-FR')}` : 'Pas d\'échéance'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={statusColors[task.status] as any} className="text-xs">
                      {statusLabels[task.status] || task.status}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                      {priorityLabels[task.priority] || task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
