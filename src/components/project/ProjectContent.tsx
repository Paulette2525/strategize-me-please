import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { CONTENT_STATUS_LABELS, CHANNEL_LABELS, Channel, ContentStatus } from '@/types/marketing';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const contentTypes = [
  { value: 'post', label: 'Post' },
  { value: 'email', label: 'Email' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'visual', label: 'Visuel' },
  { value: 'video', label: 'Vidéo' },
  { value: 'article', label: 'Article' },
];

export default function ProjectContent({ projectId }: { projectId: string }) {
  const { getContentByProject, addContent } = useMarketing();
  const content = getContentByProject(projectId);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('post');
  const [channel, setChannel] = useState<Channel>('social');

  const handleCreate = () => {
    if (!title.trim()) return;
    addContent({
      id: crypto.randomUUID(),
      projectId,
      title: title.trim(),
      type: type as any,
      status: 'idea',
      channel,
      createdAt: new Date().toISOString(),
      author: '',
    });
    setTitle(''); setType('post'); setChannel('social');
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Nouveau contenu</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajouter un contenu</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Titre</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre du contenu" /></div>
              <div><Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{contentTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Canal</Label>
                <Select value={channel} onValueChange={v => setChannel(v as Channel)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(CHANNEL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full">Ajouter</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {content.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-sm text-muted-foreground">Aucun contenu pour ce projet</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {content.map(c => (
            <Card key={c.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{contentTypes.find(t => t.value === c.type)?.label} • {CHANNEL_LABELS[c.channel]}</p>
                </div>
                <Badge variant="outline" className="text-xs">{CONTENT_STATUS_LABELS[c.status]}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
