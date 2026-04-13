import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CHANNEL_LABELS, CHANNEL_COLORS, Channel } from '@/types/marketing';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ProjectAnalytics({ projectId }: { projectId: string }) {
  const { getCampaignsByProject, getTasksByProject, getContentByProject } = useMarketing();
  const campaigns = getCampaignsByProject(projectId);
  const tasks = getTasksByProject(projectId);
  const content = getContentByProject(projectId);

  const channelPerformance = Object.entries(
    campaigns.reduce((acc, c) => {
      if (!acc[c.channel]) acc[c.channel] = { impressions: 0, clicks: 0, conversions: 0, spent: 0 };
      acc[c.channel].impressions += c.impressions;
      acc[c.channel].clicks += c.clicks;
      acc[c.channel].conversions += c.conversions;
      acc[c.channel].spent += c.spent;
      return acc;
    }, {} as Record<string, { impressions: number; clicks: number; conversions: number; spent: number }>)
  ).map(([ch, data]) => ({
    name: CHANNEL_LABELS[ch as Channel],
    ...data,
    color: CHANNEL_COLORS[ch as Channel],
  }));

  const taskStats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length,
  };

  const contentStats = [
    { name: 'Idées', value: content.filter(c => c.status === 'idea').length, color: 'hsl(220, 9%, 46%)' },
    { name: 'Rédaction', value: content.filter(c => c.status === 'writing').length, color: 'hsl(221, 83%, 53%)' },
    { name: 'Review', value: content.filter(c => c.status === 'review').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Publié', value: content.filter(c => c.status === 'published').length, color: 'hsl(142, 71%, 45%)' },
  ].filter(s => s.value > 0);

  return (
    <div className="space-y-6">
      {/* Task completion */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total tâches', value: taskStats.total, color: 'text-foreground' },
          { label: 'Terminées', value: taskStats.done, color: 'text-success' },
          { label: 'En cours', value: taskStats.inProgress, color: 'text-primary' },
          { label: 'En retard', value: taskStats.overdue, color: 'text-destructive' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {channelPerformance.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Performance par Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="hsl(221, 83%, 53%)" name="Clics" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversions" fill="hsl(142, 71%, 45%)" name="Conversions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {contentStats.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Pipeline de Contenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={contentStats} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={4}>
                    {contentStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {contentStats.map(s => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-muted-foreground">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {channelPerformance.length === 0 && contentStats.length === 0 && (
        <Card>
          <CardContent className="text-center py-12 text-sm text-muted-foreground">
            Ajoutez des campagnes et du contenu pour voir les analytics
          </CardContent>
        </Card>
      )}
    </div>
  );
}
