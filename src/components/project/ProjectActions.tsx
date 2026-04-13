import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ChevronRight, Zap } from 'lucide-react';
import { ACTION_TYPES, ACTION_STATUS_LABELS, ActionStatus, MarketingAction } from '@/types/marketing';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ActionDetail from './ActionDetail';

const statusColors: Record<ActionStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  analyzed: 'bg-accent text-accent-foreground',
};

export default function ProjectActions({ projectId }: { projectId: string }) {
  const { getActionsByProject, addAction } = useMarketing();
  const actions = getActionsByProject(projectId);
  const [open, setOpen] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [customType, setCustomType] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    const finalType = type === 'Autre' ? customType.trim() || 'Autre' : type;
    addAction({
      id: crypto.randomUUID(),
      projectId,
      name: name.trim(),
      type: finalType,
      description: description.trim(),
      status: 'draft',
      budget: 0,
      spent: 0,
      notes: '',
      contents: [],
      metrics: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
      createdAt: new Date().toISOString(),
    });
    setName(''); setType(''); setCustomType(''); setDescription('');
    setOpen(false);
  };

  if (selectedActionId) {
    return <ActionDetail actionId={selectedActionId} onBack={() => setSelectedActionId(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Nouvelle action</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Créer une action marketing</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Nom</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Campagne TikTok Été" /></div>
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue placeholder="Choisir un type" /></SelectTrigger>
                  <SelectContent>
                    {ACTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                {type === 'Autre' && (
                  <Input value={customType} onChange={e => setCustomType(e.target.value)} placeholder="Précisez le type..." className="mt-2" />
                )}
              </div>
              <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Objectifs de cette action..." /></div>
              <Button onClick={handleCreate} className="w-full">Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {actions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Zap className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-1">Aucune action marketing</h3>
            <p className="text-muted-foreground text-sm mb-4">Créez votre première action : publicité, SEO, email, etc.</p>
            <Button onClick={() => setOpen(true)} size="sm"><Plus className="h-4 w-4 mr-2" />Créer une action</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map(action => (
            <Card
              key={action.id}
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setSelectedActionId(action.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{action.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.type}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </div>
                {action.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{action.description}</p>}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`text-[10px] ${statusColors[action.status]}`} variant="secondary">
                    {ACTION_STATUS_LABELS[action.status]}
                  </Badge>
                  {action.budget > 0 && (
                    <span className="text-[10px] text-muted-foreground">{action.spent.toLocaleString()} / {action.budget.toLocaleString()} €</span>
                  )}
                  {action.contents.length > 0 && (
                    <span className="text-[10px] text-muted-foreground">{action.contents.length} contenu(s)</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
