import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { STATUS_LABELS, CHANNEL_LABELS, Channel, CampaignStatus } from '@/types/marketing';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProjectCampaigns({ projectId }: { projectId: string }) {
  const { getCampaignsByProject, addCampaign } = useMarketing();
  const campaigns = getCampaignsByProject(projectId);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<Channel>('social');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [objectives, setObjectives] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    addCampaign({
      id: crypto.randomUUID(),
      projectId,
      name: name.trim(),
      channel,
      status: 'draft',
      budget: Number(budget) || 0,
      spent: 0,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      objectives: objectives.trim(),
      roi: 0, impressions: 0, clicks: 0, conversions: 0,
    });
    setName(''); setChannel('social'); setBudget(''); setStartDate(''); setEndDate(''); setObjectives('');
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Nouvelle campagne</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Créer une campagne</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Nom</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Nom de la campagne" /></div>
              <div><Label>Canal</Label>
                <Select value={channel} onValueChange={v => setChannel(v as Channel)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CHANNEL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Budget (€)</Label><Input type="number" value={budget} onChange={e => setBudget(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Début</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div><Label>Fin</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
              </div>
              <div><Label>Objectifs</Label><Textarea value={objectives} onChange={e => setObjectives(e.target.value)} placeholder="Objectifs de la campagne..." /></div>
              <Button onClick={handleCreate} className="w-full">Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {campaigns.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-sm text-muted-foreground">Aucune campagne pour ce projet</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <Card key={c.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.objectives}</p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">{CHANNEL_LABELS[c.channel]}</Badge>
                <Badge variant="outline" className="text-xs shrink-0">{STATUS_LABELS[c.status]}</Badge>
                {c.budget > 0 && <span className="text-xs text-muted-foreground shrink-0">{c.budget.toLocaleString()} €</span>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
