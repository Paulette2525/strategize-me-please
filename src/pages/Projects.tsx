import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PROJECT_STATUS_LABELS } from '@/types/marketing';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Projects() {
  const { projects, addProject } = useMarketing();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#6366f1'];

  const handleCreate = () => {
    if (!name.trim()) return;
    const project = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      status: 'active' as const,
      budget: 0,
      spent: 0,
      channels: [],
      startDate: new Date().toISOString().split('T')[0],
      color: colors[projects.length % colors.length],
      campaignCount: 0,
      roi: 0,
      teamIds: [],
      objectives: [],
      progress: 0,
    };
    addProject(project);
    setName('');
    setDescription('');
    setOpen(false);
    navigate(`/projects/${project.id}/overview`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Projets</h1>
          <p className="text-muted-foreground mt-1">Gérez tous vos projets marketing</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nouveau Projet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un projet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Nom du projet</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Lancement Produit X" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Objectifs et contexte du projet..." />
              </div>
              <Button onClick={handleCreate} className="w-full">Créer le projet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-1">Aucun projet</h3>
            <p className="text-muted-foreground text-sm mb-4">Créez votre premier projet marketing pour commencer</p>
            <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Créer un projet</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}/overview`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-4 w-4 rounded-full shrink-0 mt-1" style={{ backgroundColor: project.color }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold truncate">{project.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description || 'Aucune description'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {PROJECT_STATUS_LABELS[project.status]}
                  </Badge>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={e => e.stopPropagation()}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={e => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Le projet « {project.name} » et toutes ses données seront supprimés.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteProject(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
