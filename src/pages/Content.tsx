import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Image, Mail, Video, Globe, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CONTENT_STATUS_LABELS, CHANNEL_LABELS, ContentStatus, ContentItem } from '@/types/marketing';

const typeIcons: Record<string, React.ElementType> = {
  article: FileText, visual: Image, email: Mail, video: Video,
  'landing-page': Globe, post: MessageSquare,
};

const statusColors: Record<ContentStatus, string> = {
  idea: 'bg-muted text-muted-foreground',
  writing: 'bg-warning/10 text-warning',
  review: 'bg-accent/10 text-accent',
  published: 'bg-success/10 text-success',
};

export default function Content() {
  const { content, projects } = useMarketing();

  const statuses: ContentStatus[] = ['idea', 'writing', 'review', 'published'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Contenus</h1>
          <p className="text-muted-foreground mt-1">{content.length} contenus au total</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Nouveau Contenu
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statuses.map(s => (
          <Card key={s}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-heading font-bold">{content.filter(c => c.status === s).length}</p>
              <p className="text-xs text-muted-foreground mt-1">{CONTENT_STATUS_LABELS[s]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map(status => (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-sm">{CONTENT_STATUS_LABELS[status]}</h3>
              <Badge variant="secondary" className="text-xs">{content.filter(c => c.status === status).length}</Badge>
            </div>
            {content.filter(c => c.status === status).map(item => {
              const project = projects.find(p => p.id === item.projectId);
              const Icon = typeIcons[item.type] || FileText;
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{project?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{CHANNEL_LABELS[item.channel]}</Badge>
                      <span className="text-xs text-muted-foreground">{item.author}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
