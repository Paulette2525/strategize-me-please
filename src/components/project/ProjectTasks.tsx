import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
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
  const { getTasksByProject, addTask, updateTask, collaborators } = useMarketing();
  const tasks = getTasksByProject(projectId);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

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
      createdAt: new Date().toISOString(),
    });
    setTitle('');
    setDescription('');
    setAssigneeId('');
    setPriority('medium');
    setDueDate('');
    setOpen(false);
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

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(status => {
          const colTasks = tasks.filter(t => t.status === status);
          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{TASK_STATUS_LABELS[status]}</h3>
                <Badge variant="outline" className="text-xs">{colTasks.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {colTasks.map(task => {
                  const assignee = collaborators.find(c => c.id === task.assigneeId);
                  const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date();
                  return (
                    <Card key={task.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-3">
                        <p className="text-sm font-medium mb-2">{task.title}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`text-[10px] ${priorityColors[task.priority]}`} variant="secondary">
                            {TASK_PRIORITY_LABELS[task.priority]}
                          </Badge>
                          {isOverdue && <Badge variant="destructive" className="text-[10px]">En retard</Badge>}
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
                        {/* Status change buttons */}
                        <div className="flex gap-1 mt-2">
                          {status !== 'todo' && (
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => {
                              const prev = columns[columns.indexOf(status) - 1];
                              updateTask(task.id, { status: prev });
                            }}>← </Button>
                          )}
                          {status !== 'done' && (
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2 ml-auto" onClick={() => {
                              const next = columns[columns.indexOf(status) + 1];
                              updateTask(task.id, { status: next });
                            }}>→</Button>
                          )}
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
