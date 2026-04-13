import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Target, MessageSquare, Edit3, Save, Plus, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { ClientAvatar, ProjectBrief } from '@/types/marketing';

const emptyAvatar: ClientAvatar = {
  name: '', age: '', occupation: '',
  problems: [], desires: [], objections: [],
};

function AvatarListField({ label, items, onAdd, onRemove }: {
  label: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
}) {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 mt-1 mb-2">
        {items.map((item, i) => (
          <Badge key={i} variant="secondary" className="gap-1">
            {item}
            <button type="button" onClick={() => onRemove(i)} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Ajouter..."
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          className="flex-1"
        />
        <Button type="button" size="sm" variant="outline" onClick={handleAdd}><Plus className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}

export default function ProjectOverview({ projectId }: { projectId: string }) {
  const { getProjectById, getBriefByProject, addBrief, updateBrief, collaborators, getTasksByProject } = useMarketing();
  const project = getProjectById(projectId);
  const brief = getBriefByProject(projectId);
  const tasks = getTasksByProject(projectId);

  const [editing, setEditing] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<ClientAvatar>(brief?.avatar || emptyAvatar);
  const [targetAudience, setTargetAudience] = useState(brief?.targetAudience || '');
  const [market, setMarket] = useState(brief?.market || '');
  const [positioning, setPositioning] = useState(brief?.positioning || '');
  const [keyMessage, setKeyMessage] = useState(brief?.keyMessage || '');
  const [notes, setNotes] = useState(brief?.notes || '');

  useEffect(() => {
    if (brief) {
      setAvatar(brief.avatar);
      setTargetAudience(brief.targetAudience);
      setMarket(brief.market);
      setPositioning(brief.positioning);
      setKeyMessage(brief.keyMessage);
      setNotes(brief.notes);
    }
  }, [brief]);

  if (!project) return null;

  const saveBrief = () => {
    const data = { avatar, targetAudience, market, positioning, keyMessage, notes };
    if (brief) {
      updateBrief(brief.id, data);
    } else {
      addBrief({ id: crypto.randomUUID(), projectId, ...data });
    }
    setEditing(null);
  };

  const handleAddListItem = (field: 'problems' | 'desires' | 'objections', item: string) => {
    setAvatar(prev => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const handleRemoveListItem = (field: 'problems' | 'desires' | 'objections', index: number) => {
    setAvatar(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const teamMembers = collaborators.filter(c => project.teamIds.includes(c.id));
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  

  const fieldLabels: Record<string, string> = {
    problems: 'Problèmes / Douleurs',
    desires: 'Désirs / Objectifs',
    objections: 'Objections / Freins',
  };

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tâches', value: `${doneTasks}/${tasks.length}`, sub: 'terminées' },
          { label: 'Équipe', value: teamMembers.length, sub: 'membres' },
          { label: 'Créé le', value: new Date(project.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }), sub: '' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-xl font-heading font-bold">{s.value}</p>
              <p className="text-sm font-medium">{s.label}</p>
              {s.sub && <p className="text-xs text-muted-foreground">{s.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Avatar Client */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Avatar Client / Persona
            </CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={() => editing === 'avatar' ? saveBrief() : setEditing('avatar')}>
              {editing === 'avatar' ? <><Save className="h-3.5 w-3.5 mr-1" />Sauvegarder</> : <><Edit3 className="h-3.5 w-3.5 mr-1" />Modifier</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editing === 'avatar' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Nom du persona</Label><Input value={avatar.name} onChange={e => setAvatar(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Marie, 35 ans" /></div>
                <div><Label>Âge / Tranche</Label><Input value={avatar.age} onChange={e => setAvatar(p => ({ ...p, age: e.target.value }))} placeholder="25-45 ans" /></div>
                <div><Label>Occupation</Label><Input value={avatar.occupation} onChange={e => setAvatar(p => ({ ...p, occupation: e.target.value }))} placeholder="Entrepreneur, Salarié..." /></div>
              </div>
              {(['problems', 'desires', 'objections'] as const).map(field => (
                <AvatarListField
                  key={field}
                  label={fieldLabels[field]}
                  items={avatar[field]}
                  onAdd={(item) => handleAddListItem(field, item)}
                  onRemove={(index) => handleRemoveListItem(field, index)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {avatar.name ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><span className="text-xs text-muted-foreground">Persona</span><p className="text-sm font-medium">{avatar.name || '—'}</p></div>
                    <div><span className="text-xs text-muted-foreground">Âge</span><p className="text-sm font-medium">{avatar.age || '—'}</p></div>
                    <div><span className="text-xs text-muted-foreground">Occupation</span><p className="text-sm font-medium">{avatar.occupation || '—'}</p></div>
                  </div>
                  {(['problems', 'desires', 'objections'] as const).map(field => (
                    avatar[field].length > 0 && (
                      <div key={field}>
                        <span className="text-xs text-muted-foreground">{field === 'problems' ? 'Problèmes' : field === 'desires' ? 'Désirs' : 'Objections'}</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {avatar[field].map((item, i) => <Badge key={i} variant="outline" className="text-xs">{item}</Badge>)}
                        </div>
                      </div>
                    )
                  ))}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Cliquez sur Modifier pour définir votre avatar client</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cible & Positionnement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Cible & Marché
              </CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => editing === 'target' ? saveBrief() : setEditing('target')}>
                {editing === 'target' ? <Save className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editing === 'target' ? (
              <div className="space-y-3">
                <div><Label>Audience cible</Label><Textarea value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="Décrivez votre audience cible..." /></div>
                <div><Label>Marché / Segment</Label><Input value={market} onChange={e => setMarket(e.target.value)} placeholder="Ex: SaaS B2B, E-commerce mode..." /></div>
              </div>
            ) : (
              <div className="space-y-2">
                {targetAudience ? (
                  <>
                    <div><span className="text-xs text-muted-foreground">Audience</span><p className="text-sm">{targetAudience}</p></div>
                    <div><span className="text-xs text-muted-foreground">Marché</span><p className="text-sm">{market || '—'}</p></div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Définissez votre cible et marché</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Positionnement
              </CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => editing === 'positioning' ? saveBrief() : setEditing('positioning')}>
                {editing === 'positioning' ? <Save className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editing === 'positioning' ? (
              <div className="space-y-3">
                <div><Label>Proposition de valeur</Label><Textarea value={positioning} onChange={e => setPositioning(e.target.value)} placeholder="Qu'est-ce qui vous rend unique ?" /></div>
                <div><Label>Message clé</Label><Input value={keyMessage} onChange={e => setKeyMessage(e.target.value)} placeholder="Le message principal à communiquer" /></div>
              </div>
            ) : (
              <div className="space-y-2">
                {positioning ? (
                  <>
                    <div><span className="text-xs text-muted-foreground">Proposition de valeur</span><p className="text-sm">{positioning}</p></div>
                    <div><span className="text-xs text-muted-foreground">Message clé</span><p className="text-sm">{keyMessage || '—'}</p></div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Définissez votre positionnement</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Notes du projet</CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={() => editing === 'notes' ? saveBrief() : setEditing('notes')}>
              {editing === 'notes' ? <Save className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editing === 'notes' ? (
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes libres sur le projet..." className="min-h-[120px]" />
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notes || 'Aucune note pour le moment'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
