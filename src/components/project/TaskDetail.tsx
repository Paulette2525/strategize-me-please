import { useParams, useNavigate } from 'react-router-dom';
import { useMarketing } from '@/contexts/MarketingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Link2, FileText, Layout, Trash2, ExternalLink } from 'lucide-react';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TaskStatus, TaskPriority, TaskResource } from '@/types/marketing';
import { useState } from 'react';

const resourceTypeLabels: Record<TaskResource['type'], { label: string; icon: typeof Link2 }> = {
  link: { label: 'Lien', icon: Link2 },
  note: { label: 'Note', icon: FileText },
  schema: { label: 'Schéma', icon: Layout },
};

export default function TaskDetail({ projectId }: { projectId: string }) {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask, collaborators, getStrategyByProject } = useMarketing();
  const task = tasks.find(t => t.id === taskId);
  const strategy = getStrategyByProject(projectId);
  const planSteps = strategy?.actionPlan || [];

  const [newResLabel, setNewResLabel] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResNote, setNewResNote] = useState('');
  const [newResType, setNewResType] = useState<TaskResource['type']>('link');

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Tâche introuvable</p>
        <Button variant="outline" onClick={() => navigate(`/projects/${projectId}/tasks`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />Retour aux tâches
        </Button>
      </div>
    );
  }

  const assignee = collaborators.find(c => c.id === task.assigneeId);
  const linkedStep = task.planStepId ? planSteps.find(s => s.id === task.planStepId) : null;

  const goBack = () => {
    if (task.planStepId) {
      navigate(`/projects/${projectId}/plan-step/${task.planStepId}`);
    } else {
      navigate(`/projects/${projectId}/tasks`);
    }
  };

  const addResource = () => {
    if (!newResLabel.trim()) return;
    const resource: TaskResource = {
      id: crypto.randomUUID(),
      label: newResLabel.trim(),
      url: newResUrl.trim() || undefined,
      note: newResNote.trim() || undefined,
      type: newResType,
    };
    updateTask(task.id, { resources: [...(task.resources || []), resource] });
    setNewResLabel(''); setNewResUrl(''); setNewResNote('');
  };

  const removeResource = (resId: string) => {
    updateTask(task.id, { resources: (task.resources || []).filter(r => r.id !== resId) });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <Input
            value={task.title}
            onChange={e => updateTask(task.id, { title: e.target.value })}
            className="text-xl font-heading font-bold border-none shadow-none px-0 h-auto focus-visible:ring-0"
          />
          {linkedStep && (
            <Badge variant="outline" className="text-xs mt-1">{linkedStep.step}</Badge>
          )}
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={task.description}
            onChange={e => updateTask(task.id, { description: e.target.value })}
            placeholder="Décrivez la tâche en détail..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Ressources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(task.resources || []).length > 0 && (
            <div className="space-y-2">
              {(task.resources || []).map(res => {
                const ResIcon = resourceTypeLabels[res.type].icon;
                return (
                  <div key={res.id} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                    <ResIcon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{res.label}</p>
                      {res.url && (
                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                          <ExternalLink className="h-3 w-3" />{res.url}
                        </a>
                      )}
                      {res.note && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{res.note}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeResource(res.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add resource form */}
          <div className="border rounded-lg p-3 space-y-3">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Input value={newResLabel} onChange={e => setNewResLabel(e.target.value)} placeholder="Titre de la ressource" />
              <Select value={newResType} onValueChange={v => setNewResType(v as TaskResource['type'])}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Lien</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="schema">Schéma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newResType === 'link' && (
              <Input value={newResUrl} onChange={e => setNewResUrl(e.target.value)} placeholder="https://..." />
            )}
            {(newResType === 'note' || newResType === 'schema') && (
              <Textarea value={newResNote} onChange={e => setNewResNote(e.target.value)} placeholder="Contenu..." className="min-h-[60px]" />
            )}
            <Button size="sm" onClick={addResource} disabled={!newResLabel.trim()}>
              <Plus className="h-4 w-4 mr-1" />Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Completed Resources (from external collaborator) */}
      {task.completedResources && task.completedResources.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-green-800">✅ Ressources du collaborateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {task.completedResources.map((res: any, idx: number) => (
              <div key={res.id || idx} className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-white">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{res.label}</p>
                  {res.url && (
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                      <ExternalLink className="h-3 w-3" />{res.url}
                    </a>
                  )}
                  {res.note && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{res.note}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notes & Strategy */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Notes & Stratégie</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={task.notes || ''}
            onChange={e => updateTask(task.id, { notes: e.target.value })}
            placeholder="Ajoutez vos notes de stratégie, idées, schémas textuels..."
            className="min-h-[150px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
