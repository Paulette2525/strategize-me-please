import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Link2, FileText, Edit3, Save } from 'lucide-react';
import { useState } from 'react';
import { CHANNEL_LABELS, Channel, StrategyResource, ChannelDashboardEntry } from '@/types/marketing';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const allChannels: Channel[] = ['seo', 'ads', 'email', 'social', 'content', 'influencer', 'affiliate', 'pr'];

const CHANNEL_STATUS_LABELS: Record<string, string> = {
  planned: 'À lancer',
  active: 'En cours',
  optimizing: 'Optimisation',
  paused: 'En pause',
};

export default function ProjectStrategy({ projectId }: { projectId: string }) {
  const { getStrategyByProject, addStrategy, updateStrategy, collaborators, getTasksByPlanStep } = useMarketing();
  const strategy = getStrategyByProject(projectId);

  const [editing, setEditing] = useState<string | null>(null);
  const [actionPlan, setActionPlan] = useState(strategy?.actionPlan || []);
  const [resources, setResources] = useState<StrategyResource[]>(strategy?.resources || []);
  const [channelDashboard, setChannelDashboard] = useState<ChannelDashboardEntry[]>(
    (strategy as any)?.channelDashboard || []
  );
  const [newStep, setNewStep] = useState('');
  const [newStepDesc, setNewStepDesc] = useState('');
  const [newResLabel, setNewResLabel] = useState('');
  const [newResUrl, setNewResUrl] = useState('');

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

  const addChannelEntry = (channel: Channel) => {
    setChannelDashboard(prev => [...prev, {
      id: crypto.randomUUID(),
      channel,
      objective: '',
      budget: 0,
      responsibleId: '',
      status: 'planned' as const,
    }]);
  };

  const updateChannelEntry = (id: string, data: Partial<ChannelDashboardEntry>) => {
    setChannelDashboard(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  const removeChannelEntry = (id: string) => {
    setChannelDashboard(prev => prev.filter(e => e.id !== id));
  };

  const usedChannels = channelDashboard.map(e => e.channel);
  const availableChannels = allChannels.filter(ch => !usedChannels.includes(ch));

  return (
    <div className="space-y-6">
      {/* Channel Dashboard */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Tableau de bord des canaux</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              if (editing === 'channels') {
                saveSection({ channelDashboard, activeChannels: channelDashboard.map(e => e.channel) });
              } else {
                setEditing('channels');
              }
            }}>
              {editing === 'channels' ? <><Save className="h-3.5 w-3.5 mr-1" />Sauvegarder</> : <><Edit3 className="h-3.5 w-3.5 mr-1" />Modifier</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {channelDashboard.length === 0 && editing !== 'channels' && (
            <p className="text-sm text-muted-foreground text-center py-6">Ajoutez des canaux marketing pour organiser votre stratégie</p>
          )}
          {channelDashboard.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Canal</TableHead>
                    <TableHead>Objectif</TableHead>
                    <TableHead>Budget (€)</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Statut</TableHead>
                    {editing === 'channels' && <TableHead></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelDashboard.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Badge variant="outline">{CHANNEL_LABELS[entry.channel]}</Badge>
                      </TableCell>
                      <TableCell>
                        {editing === 'channels' ? (
                          <Input value={entry.objective} onChange={e => updateChannelEntry(entry.id, { objective: e.target.value })} placeholder="Objectif..." className="h-8 text-sm" />
                        ) : (
                          <span className="text-sm">{entry.objective || '—'}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editing === 'channels' ? (
                          <Input type="number" value={entry.budget} onChange={e => updateChannelEntry(entry.id, { budget: Number(e.target.value) })} className="h-8 w-24 text-sm" />
                        ) : (
                          <span className="text-sm font-medium">{entry.budget > 0 ? `${entry.budget.toLocaleString()} €` : '—'}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editing === 'channels' ? (
                          <Select value={entry.responsibleId} onValueChange={v => updateChannelEntry(entry.id, { responsibleId: v })}>
                            <SelectTrigger className="h-8 w-32 text-sm"><SelectValue placeholder="Choisir" /></SelectTrigger>
                            <SelectContent>
                              {collaborators.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm">{collaborators.find(c => c.id === entry.responsibleId)?.name || '—'}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editing === 'channels' ? (
                          <Select value={entry.status} onValueChange={v => updateChannelEntry(entry.id, { status: v as ChannelDashboardEntry['status'] })}>
                            <SelectTrigger className="h-8 w-32 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Object.entries(CHANNEL_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="secondary" className="text-xs">{CHANNEL_STATUS_LABELS[entry.status]}</Badge>
                        )}
                      </TableCell>
                      {editing === 'channels' && (
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeChannelEntry(entry.id)}><X className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {editing === 'channels' && availableChannels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
              <span className="text-sm text-muted-foreground mr-2">Ajouter :</span>
              {availableChannels.map(ch => (
                <Button key={ch} variant="outline" size="sm" className="text-xs" onClick={() => addChannelEntry(ch)}>
                  <Plus className="h-3 w-3 mr-1" />{CHANNEL_LABELS[ch]}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
          {(editing === 'plan' ? actionPlan : strategy?.actionPlan || actionPlan).map((step, i) => (
            <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 group">
              <Checkbox checked={step.done} onCheckedChange={() => {
                if (editing === 'plan') togglePlanStep(step.id);
                else {
                  const id = ensureStrategy();
                  const updated = (strategy?.actionPlan || []).map(s => s.id === step.id ? { ...s, done: !s.done } : s);
                  updateStrategy(id, { actionPlan: updated });
                }
              }} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${step.done ? 'line-through text-muted-foreground' : ''}`}>{i + 1}. {step.step}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
                  {(() => {
                    const stepTasks = getTasksByPlanStep(step.id);
                    const doneTasks = stepTasks.filter(t => t.status === 'done').length;
                    return stepTasks.length > 0 ? (
                      <Badge variant="secondary" className="text-[10px]">{doneTasks}/{stepTasks.length} tâches</Badge>
                    ) : null;
                  })()}
                </div>
              </div>
              {editing === 'plan' && (
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0" onClick={() => removePlanStep(step.id)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
          {editing === 'plan' && (
            <div className="flex gap-2 pt-2">
              <Input value={newStep} onChange={e => setNewStep(e.target.value)} placeholder="Nouvelle étape..." className="flex-1" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPlanStep())} />
              <Input value={newStepDesc} onChange={e => setNewStepDesc(e.target.value)} placeholder="Description (optionnel)" className="flex-1" />
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
    </div>
  );
}
