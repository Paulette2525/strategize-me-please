import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Link2, FileText, Edit3, Save, ChevronDown, ChevronRight, Calendar, User } from 'lucide-react';
import { useState } from 'react';
import { StrategyResource, Task, TaskStatus, TaskPriority, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@/types/marketing';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  urgent: 'bg-destructive/10 text-destructive',
};

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-muted text-muted-foreground',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  done: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

export default function ProjectStrategy({ projectId }: { projectId: string }) {
  const { getStrategyByProject, addStrategy, updateStrategy, getTasksByPlanStep, addTask, updateTask, collaborators, getCollaboratorById } = useMarketing();
  const strategy = getStrategyByProject(projectId);

  const [editing, setEditing] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [actionPlan, setActionPlan] = useState(strategy?.actionPlan || []);
  const [resources, setResources] = useState<StrategyResource[]>(strategy?.resources || []);
  const [newStep, setNewStep] = useState('');
  const [newStepDesc, setNewStepDesc] = useState('');
  const [newResLabel, setNewResLabel] = useState('');
  const [newResUrl, setNewResUrl] = useState('');

  // New task dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskDialogStepId, setTaskDialogStepId] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const ensureStrategy = () => {
    if (!strategy) {
      const s = {
        id: crypto.randomUUID(),
        projectId,
        objectives: [],
        targetKPIs: [],
        timeline: [],
        notes: '',
        activeChannels: [],
        resources: [],
        actionPlan: [],
      };
      addStrategy(s);
      return s.id;
    }
    return strategy.id;
  };

  const saveSection = (data: any) => {
    const id = ensureStrategy();
    updateStrategy(id, data);
    setEditing(null);
  };

  const addPlanStep = () => {
    if (!newStep.trim()) return;
    setActionPlan(prev => [...prev, { id: crypto.randomUUID(), step: newStep.trim(), description: newStepDesc.trim(), done: false }]);
    setNewStep('');
    setNewStepDesc('');
  };

  const togglePlanStep = (id: string) => {
    setActionPlan(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const removePlanStep = (id: string) => {
    setActionPlan(prev => prev.filter(s => s.id !== id));
  };

  const addResource = () => {
    if (!newResLabel.trim()) return;
    setResources(prev => [...prev, { id: crypto.randomUUID(), label: newResLabel.trim(), url: newResUrl.trim() || undefined }]);
    setNewResLabel('');
    setNewResUrl('');
  };

  const openNewTaskDialog = (stepId: string) => {
    setTaskDialogStepId(stepId);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('medium');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
    setTaskDialogOpen(true);
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({
      id: crypto.randomUUID(),
      projectId,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      assigneeId: newTaskAssignee,
      status: 'todo',
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      planStepId: taskDialogStepId,
      createdAt: new Date().toISOString(),
    });
    setTaskDialogOpen(false);
  };

  const toggleStepExpand = (stepId: string) => {
    setExpandedStep(prev => prev === stepId ? null : stepId);
  };

  return (
    <div className="space-y-6">
      {/* Plan d'action */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Plan d'Action</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              if (editing === 'plan') { saveSection({ actionPlan }); } else { setEditing('plan'); }
            }}>
              {editing === 'plan' ? <><Save className="h-3.5 w-3.5 mr-1" />Sauvegarder</> : <><Edit3 className="h-3.5 w-3.5 mr-1" />Modifier</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {(strategy?.actionPlan || actionPlan).length === 0 && editing !== 'plan' && (
            <p className="text-sm text-muted-foreground text-center py-4">Définissez les étapes de votre plan marketing</p>
          )}
          {(editing === 'plan' ? actionPlan : strategy?.actionPlan || actionPlan).map((step, i) => {
            const stepTasks = getTasksByPlanStep(step.id);
            const doneTasks = stepTasks.filter(t => t.status === 'done').length;
            const isExpanded = expandedStep === step.id;

            return (
              <div key={step.id} className="rounded-lg border bg-card overflow-hidden">
                {/* Step header - clickable */}
                <div
                  className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors group"
                  onClick={() => editing !== 'plan' && toggleStepExpand(step.id)}
                >
                  {editing !== 'plan' && (
                    <div className="mt-0.5">
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  )}
                  <Checkbox checked={step.done} onCheckedChange={(e) => {
                    e && e; // prevent propagation handled below
                    if (editing === 'plan') togglePlanStep(step.id);
                    else {
                      const id = ensureStrategy();
                      const updated = (strategy?.actionPlan || []).map(s => s.id === step.id ? { ...s, done: !s.done } : s);
                      updateStrategy(id, { actionPlan: updated });
                    }
                  }} className="mt-0.5" onClick={(e) => e.stopPropagation()} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${step.done ? 'line-through text-muted-foreground' : ''}`}>{i + 1}. {step.step}</p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{step.description}</p>
                    )}
                    {stepTasks.length > 0 && (
                      <Badge variant="secondary" className="text-[10px] mt-1">{doneTasks}/{stepTasks.length} tâches</Badge>
                    )}
                  </div>
                  {editing === 'plan' && (
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); removePlanStep(step.id); }}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                {/* Expanded tasks panel */}
                {isExpanded && editing !== 'plan' && (
                  <div className="border-t bg-muted/30 p-3 space-y-2">
                    {stepTasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-2">Aucune tâche pour cette étape</p>
                    ) : (
                      stepTasks.map(task => {
                        const assignee = task.assigneeId ? getCollaboratorById(task.assigneeId) : null;
                        return (
                          <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-md bg-background border text-sm">
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge className={`text-[10px] ${priorityColors[task.priority]}`}>{TASK_PRIORITY_LABELS[task.priority]}</Badge>
                                {assignee && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />{assignee.name}
                                  </span>
                                )}
                                {task.dueDate && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />{new Date(task.dueDate).toLocaleDateString('fr-FR')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Select value={task.status} onValueChange={(val) => updateTask(task.id, { status: val as TaskStatus })}>
                              <SelectTrigger className="w-[120px] h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {(Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]).map(([val, label]) => (
                                  <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })
                    )}
                    <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => openNewTaskDialog(step.id)}>
                      <Plus className="h-3.5 w-3.5 mr-1" />Ajouter une tâche
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
          {editing === 'plan' && (
            <div className="flex gap-2 pt-2">
              <Input value={newStep} onChange={e => setNewStep(e.target.value)} placeholder="Nouvelle étape..." className="flex-1" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPlanStep())} />
              <Textarea value={newStepDesc} onChange={e => setNewStepDesc(e.target.value)} placeholder="Description (optionnel)" className="flex-1 min-h-[40px]" />
              <Button size="sm" onClick={addPlanStep}><Plus className="h-4 w-4" /></Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Ressources</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              if (editing === 'resources') { saveSection({ resources }); } else { setEditing('resources'); }
            }}>
              {editing === 'resources' ? <><Save className="h-3.5 w-3.5 mr-1" />Sauvegarder</> : <><Edit3 className="h-3.5 w-3.5 mr-1" />Modifier</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {(strategy?.resources || resources).length === 0 && editing !== 'resources' && (
            <p className="text-sm text-muted-foreground text-center py-4">Ajoutez des liens et documents utiles</p>
          )}
          {(editing === 'resources' ? resources : strategy?.resources || resources).map(res => (
            <div key={res.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
              {res.url ? <Link2 className="h-4 w-4 text-primary shrink-0" /> : <FileText className="h-4 w-4 text-muted-foreground shrink-0" />}
              <div className="flex-1 min-w-0">
                {res.url ? (
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">{res.label}</a>
                ) : (
                  <span className="text-sm">{res.label}</span>
                )}
              </div>
              {editing === 'resources' && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setResources(prev => prev.filter(r => r.id !== res.id))}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
          {editing === 'resources' && (
            <div className="flex gap-2 pt-2">
              <Input value={newResLabel} onChange={e => setNewResLabel(e.target.value)} placeholder="Nom de la ressource" className="flex-1" />
              <Input value={newResUrl} onChange={e => setNewResUrl(e.target.value)} placeholder="URL (optionnel)" className="flex-1" />
              <Button size="sm" onClick={addResource}><Plus className="h-4 w-4" /></Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog création de tâche */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle tâche</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Titre de la tâche" />
            <Textarea value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} placeholder="Description (optionnel)" className="min-h-[60px]" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Priorité</label>
                <Select value={newTaskPriority} onValueChange={(v) => setNewTaskPriority(v as TaskPriority)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.entries(TASK_PRIORITY_LABELS) as [TaskPriority, string][]).map(([v, l]) => (
                      <SelectItem key={v} value={v} className="text-xs">{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Échéance</label>
                <Input type="date" value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Assigné</label>
              <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Non assigné" /></SelectTrigger>
                <SelectContent>
                  {collaborators.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setTaskDialogOpen(false)}>Annuler</Button>
            <Button size="sm" onClick={handleCreateTask} disabled={!newTaskTitle.trim()}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
