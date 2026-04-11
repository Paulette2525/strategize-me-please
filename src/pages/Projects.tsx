import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { PROJECT_STATUS_LABELS, CHANNEL_LABELS, Channel } from '@/types/marketing';
import { Progress } from '@/components/ui/progress';

export default function Projects() {
  const { projects, campaigns } = useMarketing();
  const [filter, setFilter] = useState('');

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Projets</h1>
          <p className="text-muted-foreground mt-1">{projects.length} projets au total</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Nouveau Projet
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrer les projets..."
          className="pl-9"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(project => {
          const projectCampaigns = campaigns.filter(c => c.projectId === project.id);
          const progress = Math.round((project.spent / project.budget) * 100);

          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                    <CardTitle className="text-base font-heading">{project.name}</CardTitle>
                  </div>
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {PROJECT_STATUS_LABELS[project.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {project.channels.map(ch => (
                    <Badge key={ch} variant="outline" className="text-xs font-normal">
                      {CHANNEL_LABELS[ch]}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{project.spent.toLocaleString()} / {project.budget.toLocaleString()} €</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm pt-1 border-t">
                  <span className="text-muted-foreground">{projectCampaigns.length} campagnes</span>
                  <span className="font-medium text-primary">{project.roi}x ROI</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
