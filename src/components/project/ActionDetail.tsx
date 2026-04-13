import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Plus, X, Edit3, BarChart3, FileText, DollarSign, Search, Target, Mail, Users, Link2, PenTool, ListChecks } from 'lucide-react';
import { useState } from 'react';
import {
  ACTION_STATUS_LABELS, ActionStatus, ActionContent, ContentStatus, CONTENT_STATUS_LABELS,
  TASK_PRIORITY_LABELS, TaskPriority, SEOData, AdsData, EmailData, InfluencerData, AffiliateData, ContentPlanData,
} from '@/types/marketing';

function getActionCategory(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('seo')) return 'seo';
  if (t.includes('facebook') || t.includes('instagram')) return 'ads-meta';
  if (t.includes('tiktok')) return 'ads-tiktok';
  if (t.includes('google')) return 'ads-google';
  if (t.includes('email')) return 'email';
  if (t.includes('influence')) return 'influencer';
  if (t.includes('affili')) return 'affiliate';
  if (t.includes('contenu') || t.includes('content')) return 'content';
  return 'generic';
}

// ---- SEO Section ----
function SEOSection({ data, onChange }: { data: SEOData; onChange: (d: SEOData) => void }) {
  const [kw, setKw] = useState('');
  const [page, setPage] = useState('');

  const addKeyword = () => {
    if (!kw.trim()) return;
    onChange({ ...data, keywords: [...data.keywords, { id: crypto.randomUUID(), keyword: kw.trim(), volume: 0, difficulty: 'moyen', position: 0, page: page.trim() }] });
    setKw(''); setPage('');
  };

  const addChecklist = (label: string) => {
    if (!label.trim()) return;
    onChange({ ...data, checklist: [...data.checklist, { id: crypto.randomUUID(), label: label.trim(), done: false }] });
  };

  const toggleCheck = (id: string) => {
    onChange({ ...data, checklist: data.checklist.map(c => c.id === id ? { ...c, done: !c.done } : c) });
  };

  const [newCheck, setNewCheck] = useState('');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2"><Search className="h-4 w-4 text-primary" />Mots-clés cibles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mot-clé</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Difficulté</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Page</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.keywords.map(k => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.keyword}</TableCell>
                  <TableCell>
                    <Input type="number" value={k.volume} className="w-20 h-7 text-xs" onChange={e => onChange({ ...data, keywords: data.keywords.map(x => x.id === k.id ? { ...x, volume: Number(e.target.value) } : x) })} />
                  </TableCell>
                  <TableCell>
                    <Select value={k.difficulty} onValueChange={v => onChange({ ...data, keywords: data.keywords.map(x => x.id === k.id ? { ...x, difficulty: v } : x) })}>
                      <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facile">Facile</SelectItem>
                        <SelectItem value="moyen">Moyen</SelectItem>
                        <SelectItem value="difficile">Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={k.position} className="w-16 h-7 text-xs" onChange={e => onChange({ ...data, keywords: data.keywords.map(x => x.id === k.id ? { ...x, position: Number(e.target.value) } : x) })} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{k.page || '—'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onChange({ ...data, keywords: data.keywords.filter(x => x.id !== k.id) })}><X className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-2 mt-3">
            <Input value={kw} onChange={e => setKw(e.target.value)} placeholder="Mot-clé..." className="flex-1" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())} />
            <Input value={page} onChange={e => setPage(e.target.value)} placeholder="Page cible (optionnel)" className="w-40" />
            <Button size="sm" onClick={addKeyword}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary" />Checklist SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.checklist.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 group">
              <Checkbox checked={c.done} onCheckedChange={() => toggleCheck(c.id)} />
              <span className={`text-sm flex-1 ${c.done ? 'line-through text-muted-foreground' : ''}`}>{c.label}</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100" onClick={() => onChange({ ...data, checklist: data.checklist.filter(x => x.id !== c.id) })}><X className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={newCheck} onChange={e => setNewCheck(e.target.value)} placeholder="Ajouter un élément..." className="flex-1" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChecklist(newCheck); setNewCheck(''); } }} />
            <Button size="sm" onClick={() => { addChecklist(newCheck); setNewCheck(''); }}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Ads Section (Meta/TikTok/Google) ----
function AdsSection({ data, onChange, platform }: { data: AdsData; onChange: (d: AdsData) => void; platform: string }) {
  const [audName, setAudName] = useState('');
  const [audSize, setAudSize] = useState('');
  const [crName, setCrName] = useState('');
  const [crFormat, setCrFormat] = useState('');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2"><Target className="h-4 w-4 text-primary" />KPIs {platform}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'CPM (€)', key: 'cpm' as const },
              { label: 'CPC (€)', key: 'cpc' as const },
              { label: 'CTR (%)', key: 'ctr' as const },
              { label: 'ROAS', key: 'roas' as const },
            ].map(m => (
              <div key={m.key} className="text-center p-3 rounded-lg bg-muted/50">
                <Input type="number" step="0.01" value={data.kpis[m.key]} className="text-center text-lg font-bold h-8 border-0 bg-transparent" onChange={e => onChange({ ...data, kpis: { ...data.kpis, [m.key]: Number(e.target.value) } })} />
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div><Label>Budget quotidien (€)</Label><Input type="number" value={data.dailyBudget} onChange={e => onChange({ ...data, dailyBudget: Number(e.target.value) })} /></div>
            <div><Label>Budget total (€)</Label><Input type="number" value={data.totalBudget} onChange={e => onChange({ ...data, totalBudget: Number(e.target.value) })} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-heading flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Audiences</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.audiences.map(a => (
            <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 group">
              <div className="flex-1"><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-muted-foreground">Taille : {a.size}</p></div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100" onClick={() => onChange({ ...data, audiences: data.audiences.filter(x => x.id !== a.id) })}><X className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={audName} onChange={e => setAudName(e.target.value)} placeholder="Nom de l'audience" className="flex-1" />
            <Input value={audSize} onChange={e => setAudSize(e.target.value)} placeholder="Taille estimée" className="w-32" />
            <Button size="sm" onClick={() => { if (audName.trim()) { onChange({ ...data, audiences: [...data.audiences, { id: crypto.randomUUID(), name: audName.trim(), size: audSize.trim() }] }); setAudName(''); setAudSize(''); } }}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-heading flex items-center gap-2"><PenTool className="h-4 w-4 text-primary" />Créatives</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.creatives.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 group">
              <div className="flex-1"><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.format}</p></div>
              <Select value={c.status} onValueChange={v => onChange({ ...data, creatives: data.creatives.map(x => x.id === c.id ? { ...x, status: v } : x) })}>
                <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="ready">Prêt</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="paused">Pausé</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100" onClick={() => onChange({ ...data, creatives: data.creatives.filter(x => x.id !== c.id) })}><X className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={crName} onChange={e => setCrName(e.target.value)} placeholder="Nom du créatif" className="flex-1" />
            <Input value={crFormat} onChange={e => setCrFormat(e.target.value)} placeholder="Format (vidéo, image...)" className="w-40" />
            <Button size="sm" onClick={() => { if (crName.trim()) { onChange({ ...data, creatives: [...data.creatives, { id: crypto.randomUUID(), name: crName.trim(), format: crFormat.trim(), status: 'draft' }] }); setCrName(''); setCrFormat(''); } }}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Email Section ----
function EmailSection({ data, onChange }: { data: EmailData; onChange: (d: EmailData) => void }) {
  const [segName, setSegName] = useState('');
  const [seqName, setSeqName] = useState('');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-heading flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />KPIs Email</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Taux d'ouverture (%)", key: 'openRate' as const },
              { label: 'Taux de clic (%)', key: 'clickRate' as const },
              { label: 'Taux désinscription (%)', key: 'unsubRate' as const },
            ].map(m => (
              <div key={m.key} className="text-center p-3 rounded-lg bg-muted/50">
                <Input type="number" step="0.1" value={data.kpis[m.key]} className="text-center text-lg font-bold h-8 border-0 bg-transparent" onChange={e => onChange({ ...data, kpis: { ...data.kpis, [m.key]: Number(e.target.value) } })} />
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-heading">Segments</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.segments.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 group">
              <div className="flex-1"><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.size.toLocaleString()} contacts</p></div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100" onClick={() => onChange({ ...data, segments: data.segments.filter(x => x.id !== s.id) })}><X className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={segName} onChange={e => setSegName(e.target.value)} placeholder="Nom du segment" className="flex-1" />
            <Button size="sm" onClick={() => { if (segName.trim()) { onChange({ ...data, segments: [...data.segments, { id: crypto.randomUUID(), name: segName.trim(), size: 0 }] }); setSegName(''); } }}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-heading">Séquences</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.sequences.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 group">
              <div className="flex-1"><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.emails} emails — {s.status}</p></div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100" onClick={() => onChange({ ...data, sequences: data.sequences.filter(x => x.id !== s.id) })}><X className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={seqName} onChange={e => setSeqName(e.target.value)} placeholder="Nom de la séquence" className="flex-1" />
            <Button size="sm" onClick={() => { if (seqName.trim()) { onChange({ ...data, sequences: [...data.sequences, { id: crypto.randomUUID(), name: seqName.trim(), emails: 0, status: 'brouillon' }] }); setSeqName(''); } }}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Influencer Section ----
function InfluencerSection({ data, onChange }: { data: InfluencerData; onChange: (d: InfluencerData) => void }) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('');
  const [followers, setFollowers] = useState('');

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base font-heading flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Influenceurs</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Plateforme</TableHead>
              <TableHead>Abonnés</TableHead>
              <TableHead>Budget (€)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.influencers.map(inf => (
              <TableRow key={inf.id}>
                <TableCell className="font-medium">{inf.name}</TableCell>
                <TableCell>{inf.platform}</TableCell>
                <TableCell>{inf.followers}</TableCell>
                <TableCell><Input type="number" value={inf.budget} className="w-20 h-7 text-xs" onChange={e => onChange({ ...data, influencers: data.influencers.map(x => x.id === inf.id ? { ...x, budget: Number(e.target.value) } : x) })} /></TableCell>
                <TableCell>
                  <Select value={inf.status} onValueChange={v => onChange({ ...data, influencers: data.influencers.map(x => x.id === inf.id ? { ...x, status: v } : x) })}>
                    <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">À contacter</SelectItem>
                      <SelectItem value="negotiation">Négociation</SelectItem>
                      <SelectItem value="confirmed">Confirmé</SelectItem>
                      <SelectItem value="delivered">Livré</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onChange({ ...data, influencers: data.influencers.filter(x => x.id !== inf.id) })}><X className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex gap-2 mt-3">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" className="flex-1" />
          <Input value={platform} onChange={e => setPlatform(e.target.value)} placeholder="Plateforme" className="w-28" />
          <Input value={followers} onChange={e => setFollowers(e.target.value)} placeholder="Abonnés" className="w-28" />
          <Button size="sm" onClick={() => { if (name.trim()) { onChange({ ...data, influencers: [...data.influencers, { id: crypto.randomUUID(), name: name.trim(), platform: platform.trim(), followers: followers.trim(), budget: 0, status: 'contact' }] }); setName(''); setPlatform(''); setFollowers(''); } }}><Plus className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Affiliate Section ----
function AffiliateSection({ data, onChange }: { data: AffiliateData; onChange: (d: AffiliateData) => void }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base font-heading flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" />Affiliés</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Commission (%)</TableHead>
              <TableHead>Lien</TableHead>
              <TableHead>Conversions</TableHead>
              <TableHead>Revenus (€)</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.affiliates.map(a => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell><Input type="number" value={a.commission} className="w-16 h-7 text-xs" onChange={e => onChange({ ...data, affiliates: data.affiliates.map(x => x.id === a.id ? { ...x, commission: Number(e.target.value) } : x) })} /></TableCell>
                <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">{a.link}</TableCell>
                <TableCell><Input type="number" value={a.conversions} className="w-16 h-7 text-xs" onChange={e => onChange({ ...data, affiliates: data.affiliates.map(x => x.id === a.id ? { ...x, conversions: Number(e.target.value) } : x) })} /></TableCell>
                <TableCell><Input type="number" value={a.revenue} className="w-20 h-7 text-xs" onChange={e => onChange({ ...data, affiliates: data.affiliates.map(x => x.id === a.id ? { ...x, revenue: Number(e.target.value) } : x) })} /></TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onChange({ ...data, affiliates: data.affiliates.filter(x => x.id !== a.id) })}><X className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex gap-2 mt-3">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" className="flex-1" />
          <Input value={link} onChange={e => setLink(e.target.value)} placeholder="Lien de tracking" className="flex-1" />
          <Button size="sm" onClick={() => { if (name.trim()) { onChange({ ...data, affiliates: [...data.affiliates, { id: crypto.randomUUID(), name: name.trim(), commission: 0, link: link.trim(), conversions: 0, revenue: 0 }] }); setName(''); setLink(''); } }}><Plus className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Tasks linked section ----
function LinkedTasks({ actionId, projectId }: { actionId: string; projectId: string }) {
  const { getTasksByAction, addTask, collaborators } = useMarketing();
  const tasks = getTasksByAction(actionId);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const handleCreate = () => {
    if (!title.trim()) return;
    addTask({
      id: crypto.randomUUID(),
      projectId,
      title: title.trim(),
      description: '',
      assigneeId: '',
      status: 'todo',
      priority,
      dueDate: new Date().toISOString().split('T')[0],
      actionId,
      createdAt: new Date().toISOString(),
    });
    setTitle('');
    setPriority('medium');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-heading flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary" />Tâches liées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-3">Aucune tâche liée à cette action</p>}
        {tasks.map(t => {
          const assignee = collaborators.find(c => c.id === t.assigneeId);
          return (
            <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${t.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>{t.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-[10px]">{TASK_PRIORITY_LABELS[t.priority]}</Badge>
                  <span className="text-[10px] text-muted-foreground">{t.status === 'done' ? '✓ Terminé' : t.status === 'in_progress' ? '⏳ En cours' : t.status === 'review' ? '👁 Review' : '📋 À faire'}</span>
                  {assignee && <span className="text-[10px] text-muted-foreground">— {assignee.name}</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex gap-2 pt-1">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nouvelle tâche..." className="flex-1" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreate(); } }} />
          <Select value={priority} onValueChange={v => setPriority(v as TaskPriority)}>
            <SelectTrigger className="w-28 h-10"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(TASK_PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
          </Select>
          <Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Default data factories ----
const defaultSEO = (): SEOData => ({ keywords: [], backlinks: [], checklist: [
  { id: '1', label: 'Balises title et meta description optimisées', done: false },
  { id: '2', label: 'URLs propres et descriptives', done: false },
  { id: '3', label: 'Maillage interne vérifié', done: false },
  { id: '4', label: 'Images optimisées (alt, compression)', done: false },
  { id: '5', label: 'Vitesse de chargement < 3s', done: false },
  { id: '6', label: 'Mobile-friendly vérifié', done: false },
  { id: '7', label: 'Sitemap XML soumis', done: false },
] });
const defaultAds = (platform: string): AdsData => ({ platform, dailyBudget: 0, totalBudget: 0, audiences: [], creatives: [], kpis: { cpm: 0, cpc: 0, ctr: 0, roas: 0 } });
const defaultEmail = (): EmailData => ({ segments: [], sequences: [], kpis: { openRate: 0, clickRate: 0, unsubRate: 0 } });
const defaultInfluencer = (): InfluencerData => ({ influencers: [] });
const defaultAffiliate = (): AffiliateData => ({ affiliates: [] });

// ==== MAIN COMPONENT ====
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

  const category = getActionCategory(action.type);

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

  // Type-specific data handlers
  const handleSEOChange = (d: SEOData) => updateAction(actionId, { seoData: d });
  const handleAdsChange = (d: AdsData) => updateAction(actionId, { adsData: d });
  const handleEmailChange = (d: EmailData) => updateAction(actionId, { emailData: d });
  const handleInfluencerChange = (d: InfluencerData) => updateAction(actionId, { influencerData: d });
  const handleAffiliateChange = (d: AffiliateData) => updateAction(actionId, { affiliateData: d });

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

      {/* ===== TYPE-SPECIFIC SECTIONS ===== */}
      {category === 'seo' && <SEOSection data={action.seoData || defaultSEO()} onChange={handleSEOChange} />}
      {(category === 'ads-meta' || category === 'ads-tiktok' || category === 'ads-google') && (
        <AdsSection data={action.adsData || defaultAds(action.type)} onChange={handleAdsChange} platform={action.type} />
      )}
      {category === 'email' && <EmailSection data={action.emailData || defaultEmail()} onChange={handleEmailChange} />}
      {category === 'influencer' && <InfluencerSection data={action.influencerData || defaultInfluencer()} onChange={handleInfluencerChange} />}
      {category === 'affiliate' && <AffiliateSection data={action.affiliateData || defaultAffiliate()} onChange={handleAffiliateChange} />}

      {/* ===== COMMON SECTIONS ===== */}
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
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Alloué</span><span className="font-medium">{action.budget.toLocaleString()} €</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Dépensé</span><span className="font-medium">{action.spent.toLocaleString()} €</span></div>
                <div className="flex justify-between text-sm border-t pt-2"><span className="text-muted-foreground">Restant</span>
                  <span className={`font-bold ${action.budget - action.spent < 0 ? 'text-destructive' : 'text-primary'}`}>{(action.budget - action.spent).toLocaleString()} €</span>
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

      {/* Linked Tasks */}
      <LinkedTasks actionId={actionId} projectId={action.projectId} />

      {/* Contents */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Contenus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {action.contents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucun contenu pour cette action</p>}
          {action.contents.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 group">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.type}</p>
              </div>
              <Select value={c.status} onValueChange={v => updateContentStatus(c.id, v as ContentStatus)}>
                <SelectTrigger className="w-[110px] h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(CONTENT_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100" onClick={() => removeContent(c.id)}><X className="h-3.5 w-3.5" /></Button>
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

      <div className="flex justify-end">
        <Button variant="destructive" size="sm" onClick={() => { deleteAction(actionId); onBack(); }}>Supprimer cette action</Button>
      </div>
    </div>
  );
}
