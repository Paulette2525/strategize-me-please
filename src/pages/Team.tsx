import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { COLLABORATOR_ROLE_LABELS, CollaboratorRole } from '@/types/marketing';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Team() {
  const { collaborators, addCollaborator, tasks, projects } = useMarketing();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<CollaboratorRole>('marketer');

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

  const handleCreate = () => {
    if (!name.trim()) return;
    addCollaborator({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      avatar: '',
      role,
      color: colors[collaborators.length % colors.length],
    });
    setName('');
    setEmail('');
    setRole('marketer');
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Équipe</h1>
          <p className="text-muted-foreground mt-1">Gérez vos collaborateurs et suivez leur performance</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Ajouter un membre</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un collaborateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Nom complet</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Jean Dupont" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@example.com" />
              </div>
              <div>
                <Label>Rôle</Label>
                <Select value={role} onValueChange={v => setRole(v as CollaboratorRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(COLLABORATOR_ROLE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full">Ajouter</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {collaborators.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-1">Aucun collaborateur</h3>
            <p className="text-muted-foreground text-sm mb-4">Ajoutez les membres de votre équipe</p>
            <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Ajouter</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collaborators.map(collab => {
            const collabTasks = tasks.filter(t => t.assigneeId === collab.id);
            const done = collabTasks.filter(t => t.status === 'done').length;
            const inProgress = collabTasks.filter(t => t.status === 'in_progress').length;
            const overdue = collabTasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length;
            const assignedProjects = [...new Set(collabTasks.map(t => t.projectId))];

            return (
              <Card key={collab.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground shrink-0"
                      style={{ backgroundColor: collab.color }}
                    >
                      {collab.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{collab.name}</p>
                      <p className="text-xs text-muted-foreground">{collab.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mb-3">{COLLABORATOR_ROLE_LABELS[collab.role]}</Badge>
                  <div className="grid grid-cols-3 gap-2 text-center mt-3">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-lg font-bold text-success">{done}</p>
                      <p className="text-[10px] text-muted-foreground">Terminées</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-lg font-bold text-primary">{inProgress}</p>
                      <p className="text-[10px] text-muted-foreground">En cours</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-lg font-bold text-destructive">{overdue}</p>
                      <p className="text-[10px] text-muted-foreground">En retard</p>
                    </div>
                  </div>
                  {assignedProjects.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-3">
                      {assignedProjects.length} projet{assignedProjects.length > 1 ? 's' : ''} assigné{assignedProjects.length > 1 ? 's' : ''}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
