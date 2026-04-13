import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CHANNEL_LABELS, CHANNEL_COLORS, Channel } from '@/types/marketing';

export default function ProjectBudget({ projectId }: { projectId: string }) {
  const { getProjectById, getCampaignsByProject, budgetEntries } = useMarketing();
  const project = getProjectById(projectId);
  const campaigns = getCampaignsByProject(projectId);
  const entries = budgetEntries.filter(e => e.projectId === projectId);

  if (!project) return null;

  const spentByChannel = campaigns.reduce((acc, c) => {
    acc[c.channel] = (acc[c.channel] || 0) + c.spent;
    return acc;
  }, {} as Record<string, number>);

  const budgetByChannel = campaigns.reduce((acc, c) => {
    acc[c.channel] = (acc[c.channel] || 0) + c.budget;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">Budget Total du Projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{project.spent.toLocaleString()} € dépensé</span>
            <span className="font-medium">{project.budget.toLocaleString()} € alloué</span>
          </div>
          <Progress value={project.budget > 0 ? (project.spent / project.budget) * 100 : 0} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            Restant: {(project.budget - project.spent).toLocaleString()} €
          </p>
        </CardContent>
      </Card>

      {Object.keys(spentByChannel).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Répartition par Canal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(spentByChannel).map(([ch, spent]) => {
              const budget = budgetByChannel[ch] || 0;
              return (
                <div key={ch}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHANNEL_COLORS[ch as Channel] }} />
                      <span>{CHANNEL_LABELS[ch as Channel]}</span>
                    </div>
                    <span className="text-muted-foreground">{spent.toLocaleString()} € / {budget.toLocaleString()} €</span>
                  </div>
                  <Progress value={budget > 0 ? (spent / budget) * 100 : 0} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {campaigns.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">ROI par Campagne</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {campaigns.filter(c => c.roi > 0).map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-sm font-bold text-success">{c.roi}x</span>
              </div>
            ))}
            {campaigns.filter(c => c.roi > 0).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune donnée ROI disponible</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
