import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Plus, X, Edit3, BarChart3, FileText, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { ACTION_STATUS_LABELS, ActionStatus, ActionContent, ContentStatus, CONTENT_STATUS_LABELS } from '@/types/marketing';

export default function ActionDetail({ actionId, onBack }: { actionId: string; onBack: () => void }) {
  const { getActionById, updateAction, deleteAction } = useMarketing();
  const action = getActionById(actionId);

  const [editing, setEditing] = useState<string | null>(null);
  const [notes, setNotes] = useState(action?.notes || '');
  const [budget, setBudget] = useState(String(action?.budget || 0));
  const [spent, setSpent] = useState(String(action?.spent || 0));
  const [status, setStatus] = useState<ActionStatus>(action?.status || 'draft');
  const [metrics, setMetrics] = useState(action?.metrics || { impressions: 0, clicks: 0, conversions: 0, revenue: 0 });
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState('');

  if (!action) return <p className="text-muted-foreground text-center py-8">Action introuvable</p>;

  const save = (data: Partial<typeof action>) => {
    updateAction(actionId, data);
    setEditing(null);
  };

  const addContent = () => {
    if (!contentTitle.trim()) return;
    const newContent: ActionContent = {
      id: crypto.randomUUID(),
      title: contentTitle.trim(),
      type: contentType || 'post',
      status: 'idea',
      createdAt: new Date().toISOString(),
    };
    updateAction(actionId, { contents: [...action.contents, newContent] });
    setContentTitle('');
    setContentType('');
  };

  const updateContentStatus = (contentId: string, newStatus: ContentStatus) => {
    updateAction(actionId, {
      contents: action.contents.map(c => c.id === contentId ? { ...c, status: newStatus } : c),
    });
  };

  const removeContent = (contentId: string) => {
    updateAction(actionId, { contents: action.contents.filter(c => c.id !== contentId) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h2 className="text-xl font-heading font-bold">{action.name}</h2>
          <p className="text-sm text-muted-foreground">{action.type}</p>
        </div>
        <Select value={status} onValueChange={v => { setStatus(v as ActionStatus); save({ status: v as ActionStatus }); }}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(ACTION_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {action.description && (
        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{action.description}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Budget */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Budget</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => {
                if (editing === 'budget') { save({ budget: Number(budget) || 0, spent: Number(spent) || 0 }); } else { setEditing('budget'); }
              }}>
                {editing === 'budget' ? <Save className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editing === 'budget' ? (
              <div className="space-y-3">
                <div><Label>Budget alloué (€)</Label><Input type="number" value={budget} onChange={e => setBudget(e.target.value)} /></div>
                <div><Label>Dépensé (€)</Label><Input type="number" value={spent} onChange={e => setSpent(e.target.value)} /></div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Alloué</span>
                  <span className="font-medium">{action.budget.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dépensé</span>
                  <span className="font-medium">{action.spent.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground">Restant</span>
                  <span className={`font-bold ${action.budget - action.spent < 0 ? 'text-destructive' : 'text-success'}`}>
                    {(action.budget - action.spent).toLocaleString()} €
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Résultats</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => {
                if (editing === 'metrics') { save({ metrics }); } else { setEditing('metrics'); }
              }}>
                {editing === 'metrics' ? <Save className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editing === 'metrics' ? (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Impressions</Label><Input type="number" value={metrics.impressions} onChange={e => setMetrics(p => ({ ...p, impressions: Number(e.target.value) }))} /></div>
                <div><Label>Clics</Label><Input type="number" value={metrics.clicks} onChange={e => setMetrics(p => ({ ...p, clicks: Number(e.target.value) }))} /></div>
                <div><Label>Conversions</Label><Input type="number" value={metrics.conversions} onChange={e => setMetrics(p => ({ ...p, conversions: Number(e.target.value) }))} /></div>
                <div><Label>Revenus (€)</Label><Input type="number" value={metrics.revenue} onChange={e => setMetrics(p => ({ ...p, revenue: Number(e.target.value) }))} /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Impressions', value: action.metrics.impressions.toLocaleString() },
                  { label: 'Clics', value: action.metrics.clicks.toLocaleString() },
                  { label: 'Conversions', value: action.metrics.conversions.toLocaleString() },
                  { label: 'Revenus', value: `${action.metrics.revenue.toLocaleString()} €` },
                ].map(m => (
                  <div key={m.label} className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-heading font-bold">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contents */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Contenus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {action.contents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun contenu pour cette action</p>
          )}
          {action.contents.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 group">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.type}</p>
              </div>
              <Select value={c.status} onValueChange={v => updateContentStatus(c.id, v as ContentStatus)}>
                <SelectTrigger className="w-[110px] h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTENT_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100" onClick={() => removeContent(c.id)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <Input value={contentTitle} onChange={e => setContentTitle(e.target.value)} placeholder="Titre du contenu" className="flex-1" />
            <Input value={contentType} onChange={e => setContentType(e.target.value)} placeholder="Type (post, vidéo...)" className="w-[140px]" />
            <Button size="sm" onClick={addContent}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Notes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              if (editing === 'notes') { save({ notes }); } else { setEditing('notes'); }
            }}>
              {editing === 'notes' ? <Save className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editing === 'notes' ? (
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes, stratégie, idées..." className="min-h-[120px]" />
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{action.notes || 'Aucune note'}</p>
          )}
        </CardContent>
      </Card>

      {/* Delete */}
      <div className="flex justify-end">
        <Button variant="destructive" size="sm" onClick={() => { deleteAction(actionId); onBack(); }}>
          Supprimer cette action
        </Button>
      </div>
    </div>
  );
}
