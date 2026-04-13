import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Check, ArrowDown, Link2, FileText, Edit3, Save } from 'lucide-react';
import { useState } from 'react';
import { CHANNEL_LABELS, Channel, FunnelStep, StrategyResource } from '@/types/marketing';
import { Checkbox } from '@/components/ui/checkbox';

const defaultFunnel: FunnelStep[] = [
  { id: '1', label: 'Attention', description: '' },
  { id: '2', label: 'Intérêt', description: '' },
  { id: '3', label: 'Désir', description: '' },
  { id: '4', label: 'Action', description: '' },
];

const allChannels: Channel[] = ['seo', 'ads', 'email', 'social', 'content', 'influencer', 'affiliate', 'pr'];

export default function ProjectStrategy({ projectId }: { projectId: string }) {
  const { getStrategyByProject, addStrategy, updateStrategy } = useMarketing();
  const strategy = getStrategyByProject(projectId);

  const [editing, setEditing] = useState<string | null>(null);
  const [activeChannels, setActiveChannels] = useState<Channel[]>(strategy?.activeChannels || []);
  const [funnel, setFunnel] = useState<FunnelStep[]>(strategy?.funnel || defaultFunnel);
  const [actionPlan, setActionPlan] = useState(strategy?.actionPlan || []);
  const [resources, setResources] = useState<StrategyResource[]>(strategy?.resources || []);
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
        funnel: defaultFunnel,
        resources: [],
        actionPlan: [],
      };
      addStrategy(s);
      return s.id;
    }
    return strategy.id;
  };

  const saveSection = (data: Partial<typeof strategy>) => {
    const id = ensureStrategy();
    updateStrategy(id, data as any);
    setEditing(null);
  };

  const toggleChannel = (ch: Channel) => {
    setActiveChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
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

  const updateFunnelStep = (id: string, description: string) => {
    setFunnel(prev => prev.map(s => s.id === id ? { ...s, description } : s));
  };

  return (
    <div className="space-y-6">
      {/* Active Channels */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Canaux Marketing Actifs</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              if (editing === 'channels') { saveSection({ activeChannels }); } else { setEditing('channels'); }
            }}>
              {editing === 'channels' ? <><Save className="h-3.5 w-3.5 mr-1" />Sauvegarder</> : <><Edit3 className="h-3.5 w-3.5 mr-1" />Modifier</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editing === 'channels' ? (
            <div className="flex flex-wrap gap-2">
              {allChannels.map(ch => (
                <Badge
                  key={ch}
                  variant={activeChannels.includes(ch) ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleChannel(ch)}
                >
                  {activeChannels.includes(ch) && <Check className="h-3 w-3 mr-1" />}
                  {CHANNEL_LABELS[ch]}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(strategy?.activeChannels || activeChannels).length > 0 ? (
                (strategy?.activeChannels || activeChannels).map(ch => (
                  <Badge key={ch} variant="default">{CHANNEL_LABELS[ch]}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucun canal sélectionné</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Funnel Marketing */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Funnel Marketing (AIDA)</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              if (editing === 'funnel') { saveSection({ funnel }); } else { setEditing('funnel'); }
            }}>
              {editing === 'funnel' ? <><Save className="h-3.5 w-3.5 mr-1" />Sauvegarder</> : <><Edit3 className="h-3.5 w-3.5 mr-1" />Modifier</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {funnel.map((step, i) => (
              <div key={step.id}>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">{i + 1}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{step.label}</p>
                    {editing === 'funnel' ? (
                      <Textarea
                        value={step.description}
                        onChange={e => updateFunnelStep(step.id, e.target.value)}
                        placeholder={`Stratégie pour l'étape "${step.label}"...`}
                        className="mt-1 min-h-[60px] text-sm"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-0.5">{step.description || 'Non défini'}</p>
                    )}
                  </div>
                </div>
                {i < funnel.length - 1 && (
                  <div className="flex justify-center py-1"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>
                )}
              </div>
            ))}
          </div>
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
                {step.description && <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>}
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
              <Input value={newStep} onChange={e => setNewStep(e.target.value)} placeholder="Nouvelle étape..." className="flex-1" onKeyDown={e => e.key === 'Enter' && addPlanStep()} />
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
