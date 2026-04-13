import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

export default function ProjectStrategy({ projectId }: { projectId: string }) {
  const { getStrategyByProject, addStrategy, updateStrategy } = useMarketing();
  const strategy = getStrategyByProject(projectId);
  const [showAdd, setShowAdd] = useState(false);
  const [objective, setObjective] = useState('');
  const [kpiLabel, setKpiLabel] = useState('');
  const [kpiTarget, setKpiTarget] = useState('');
  const [notes, setNotes] = useState(strategy?.notes || '');

  const ensureStrategy = () => {
    if (!strategy) {
      addStrategy({
        id: crypto.randomUUID(),
        projectId,
        objectives: [],
        targetKPIs: [],
        timeline: [],
        notes: '',
      });
    }
  };

  const handleAddObjective = () => {
    if (!objective.trim()) return;
    ensureStrategy();
    const s = getStrategyByProject(projectId);
    if (s) {
      updateStrategy(s.id, { objectives: [...s.objectives, objective.trim()] });
    } else {
      addStrategy({
        id: crypto.randomUUID(),
        projectId,
        objectives: [objective.trim()],
        targetKPIs: [],
        timeline: [],
        notes: '',
      });
    }
    setObjective('');
  };

  const handleAddKPI = () => {
    if (!kpiLabel.trim()) return;
    const s = getStrategyByProject(projectId);
    const newKPI = { label: kpiLabel.trim(), target: Number(kpiTarget) || 0, current: 0 };
    if (s) {
      updateStrategy(s.id, { targetKPIs: [...s.targetKPIs, newKPI] });
    } else {
      addStrategy({
        id: crypto.randomUUID(),
        projectId,
        objectives: [],
        targetKPIs: [newKPI],
        timeline: [],
        notes: '',
      });
    }
    setKpiLabel('');
    setKpiTarget('');
  };

  return (
    <div className="space-y-6">
      {/* Objectives */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Objectifs</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(!strategy || strategy.objectives.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">Définissez les objectifs de votre stratégie</p>
          )}
          {strategy?.objectives.map((obj, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Target className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm">{obj}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={objective} onChange={e => setObjective(e.target.value)} placeholder="Nouvel objectif..." onKeyDown={e => e.key === 'Enter' && handleAddObjective()} />
            <Button size="sm" onClick={handleAddObjective}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">KPIs Cibles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(!strategy || strategy.targetKPIs.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun KPI défini</p>
          )}
          {strategy?.targetKPIs.map((kpi, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/50">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{kpi.label}</span>
                <span className="text-muted-foreground">{kpi.current} / {kpi.target}</span>
              </div>
              <Progress value={kpi.target > 0 ? (kpi.current / kpi.target) * 100 : 0} className="h-1.5" />
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={kpiLabel} onChange={e => setKpiLabel(e.target.value)} placeholder="Nom du KPI" className="flex-1" />
            <Input type="number" value={kpiTarget} onChange={e => setKpiTarget(e.target.value)} placeholder="Cible" className="w-24" />
            <Button size="sm" onClick={handleAddKPI}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Notes stratégiques</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={e => {
              setNotes(e.target.value);
              const s = getStrategyByProject(projectId);
              if (s) updateStrategy(s.id, { notes: e.target.value });
            }}
            placeholder="Notes, idées, points importants..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
