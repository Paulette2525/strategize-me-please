import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap } from 'lucide-react';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TaskStatus, TaskPriority } from '@/types/marketing';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const columns: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-primary/10 text-primary',
  high: 'bg-warning/10 text-warning',
  urgent: 'bg-destructive/10 text-destructive',
};

export default function ProjectTasks({ projectId }: { projectId: string }) {
  const { getTasksByProject, addTask, updateTask, collaborators, getActionsByProject } = useMarketing();
  const tasks = getTasksByProject(projectId);
  const actions = getActionsByProject(projectId);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [actionId, setActionId] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleCreate = () => {
    if (!title.trim()) return;
    addTask({
      id: crypto.randomUUID(),
      projectId,
      title: title.trim(),
      description: description.trim(),
      assigneeId,
      status: 'todo',
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      actionId: actionId || undefined,
      createdAt: new Date().toISOString(),
    });
    setTitle(''); setDescription(''); setAssigneeId(''); setPriority('medium'); setDueDate(''); setActionId('');
    setOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = () => setDragOverColumn(null);

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) updateTask(taskId, { status });
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Nouvelle tâche</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Créer une tâche</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Titre</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre de la tâche" /></div>
              <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Détails..." /></div>
              <div><Label>Assigné à</Label>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {collaborators.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {actions.length > 0 && (
                <div><Label>Action marketing liée</Label>
                  <Select value={actionId} onValueChange={setActionId}>
                    <SelectTrigger><SelectValue placeholder="Aucune (optionnel)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      {actions.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Priorité</Label>
                  <Select value={priority} onValueChange={v => setPriority(v as TaskPriority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TASK_PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Échéance</Label><Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
              </div>
              <Button onClick={handleCreate} className="w-full">Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(status => {
          const colTasks = tasks.filter(t => t.status === status);
          const isOver = dragOverColumn === status;
          return (
            <div
              key={status}
              className="space-y-2"
              onDragOver={e => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, status)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{TASK_STATUS_LABELS[status]}</h3>
                <Badge variant="outline" className="text-xs">{colTasks.length}</Badge>
              </div>
              <div className={`space-y-2 min-h-[100px] rounded-lg p-1 transition-colors ${isOver ? 'bg-primary/5 ring-2 ring-primary/20' : ''}`}>
                {colTasks.map(task => {
                  const assignee = collaborators.find(c => c.id === task.assigneeId);
                  const linkedAction = task.actionId ? actions.find(a => a.id === task.actionId) : null;
                  const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date();
                  const isDragging = draggedTaskId === task.id;
                  return (
                    <Card
                      key={task.id}
                      draggable
                      onDragStart={e => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-grab active:cursor-grabbing transition-all ${isDragging ? 'opacity-40 scale-95' : 'hover:shadow-sm'}`}
                    >
                      <CardContent className="p-3">
                        <p className="text-sm font-medium mb-2">{task.title}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`text-[10px] ${priorityColors[task.priority]}`} variant="secondary">
                            {TASK_PRIORITY_LABELS[task.priority]}
                          </Badge>
                          {isOverdue && <Badge variant="destructive" className="text-[10px]">En retard</Badge>}
                          {linkedAction && (
                            <Badge variant="outline" className="text-[10px] flex items-center gap-1">
                              <Zap className="h-2.5 w-2.5" />{linkedAction.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {assignee ? (
                            <div className="flex items-center gap-1.5">
                              <div className="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-medium text-primary-foreground" style={{ backgroundColor: assignee.color }}>
                                {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <span className="text-[10px] text-muted-foreground">{assignee.name.split(' ')[0]}</span>
                            </div>
                          ) : <span className="text-[10px] text-muted-foreground">Non assigné</span>}
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
