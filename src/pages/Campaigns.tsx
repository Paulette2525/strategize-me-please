import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STATUS_LABELS, CHANNEL_LABELS, CampaignStatus, Campaign } from '@/types/marketing';

const statusOrder: CampaignStatus[] = ['draft', 'planned', 'active', 'completed', 'analyzed'];

const statusColors: Record<CampaignStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  planned: 'bg-primary/10 text-primary',
  active: 'bg-success/10 text-success',
  completed: 'bg-accent/10 text-accent',
  analyzed: 'bg-secondary text-secondary-foreground',
};

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { projects } = useMarketing();
  const project = projects.find(p => p.id === campaign.projectId);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-sm">{campaign.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{project?.name}</p>
          </div>
          <Badge className={`text-xs ${statusColors[campaign.status]}`}>
            {STATUS_LABELS[campaign.status]}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {CHANNEL_LABELS[campaign.channel]}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(campaign.startDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })} — {new Date(campaign.endDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-sm font-medium">{(campaign.budget / 1000).toFixed(1)}k €</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Conversions</p>
            <p className="text-sm font-medium">{campaign.conversions}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">ROI</p>
            <p className="text-sm font-medium">{campaign.roi > 0 ? `${campaign.roi}x` : '—'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Campaigns() {
  const { campaigns } = useMarketing();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Campagnes</h1>
          <p className="text-muted-foreground mt-1">{campaigns.length} campagnes au total</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Nouvelle Campagne
        </Button>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {statusOrder.map(status => {
              const statusCampaigns = campaigns.filter(c => c.status === status);
              return (
                <div key={status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-sm">{STATUS_LABELS[status]}</h3>
                    <Badge variant="secondary" className="text-xs">{statusCampaigns.length}</Badge>
                  </div>
                  <div className="space-y-3">
                    {statusCampaigns.map(c => (
                      <CampaignCard key={c.id} campaign={c} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="mt-4 space-y-2">
            {campaigns.map(c => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
