import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Megaphone, FolderKanban, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { CHANNEL_LABELS, CHANNEL_COLORS, Channel } from '@/types/marketing';

export default function Dashboard() {
  const { projects, campaigns, content } = useMarketing();

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const avgRoi = projects.filter(p => p.roi > 0).reduce((sum, p) => sum + p.roi, 0) / projects.filter(p => p.roi > 0).length;

  const kpis = [
    { label: 'Budget Total', value: `${(totalBudget / 1000).toFixed(0)}k €`, change: 12, icon: DollarSign, color: 'text-primary' },
    { label: 'Dépensé', value: `${(totalSpent / 1000).toFixed(0)}k €`, change: -5, icon: Target, color: 'text-warning' },
    { label: 'Campagnes Actives', value: activeCampaigns, change: 8, icon: Megaphone, color: 'text-success' },
    { label: 'ROI Moyen', value: `${avgRoi.toFixed(1)}x`, change: 15, icon: TrendingUp, color: 'text-accent' },
  ];

  const budgetByProject = projects.map(p => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name,
    budget: p.budget,
    spent: p.spent,
  }));

  const channelData = Object.entries(
    campaigns.reduce((acc, c) => {
      acc[c.channel] = (acc[c.channel] || 0) + c.spent;
      return acc;
    }, {} as Record<string, number>)
  ).map(([channel, value]) => ({
    name: CHANNEL_LABELS[channel as Channel],
    value,
    color: CHANNEL_COLORS[channel as Channel],
  }));

  const monthlyData = [
    { month: 'Jan', revenue: 12000, spend: 8500 },
    { month: 'Fév', revenue: 15000, spend: 9200 },
    { month: 'Mar', revenue: 18000, spend: 11000 },
    { month: 'Avr', revenue: 22000, spend: 12500 },
    { month: 'Mai', revenue: 28000, spend: 14000 },
    { month: 'Juin', revenue: 32000, spend: 15500 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de vos stratégies marketing</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-heading font-bold mt-1">{kpi.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {kpi.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs font-medium ${kpi.change > 0 ? 'text-success' : 'text-destructive'}`}>
                  {Math.abs(kpi.change)}%
                </span>
                <span className="text-xs text-muted-foreground">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Revenue vs Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} €`} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="spend" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={false} name="Dépenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Dépenses par Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                    {channelData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} €`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center -mt-2">
                {channelData.map((ch) => (
                  <div key={ch.name} className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ch.color }} />
                    <span className="text-xs text-muted-foreground">{ch.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget by project */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Budget par Projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetByProject} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis type="number" fontSize={12} tickFormatter={(v) => `${v / 1000}k €`} />
                <YAxis dataKey="name" type="category" fontSize={12} width={120} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} €`} />
                <Bar dataKey="budget" fill="hsl(221, 83%, 53%)" radius={[0, 4, 4, 0]} name="Budget" opacity={0.3} />
                <Bar dataKey="spent" fill="hsl(221, 83%, 53%)" radius={[0, 4, 4, 0]} name="Dépensé" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent campaigns & projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading">Projets Actifs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.filter(p => p.status === 'active').slice(0, 4).map(project => (
              <div key={project.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.campaignCount} campagnes</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{project.roi}x ROI</p>
                  <div className="w-20 h-1.5 bg-muted rounded-full mt-1">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading">Campagnes Récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.filter(c => c.status === 'active').slice(0, 4).map(campaign => {
              const project = projects.find(p => p.id === campaign.projectId);
              return (
                <div key={campaign.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">{project?.name}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {campaign.channel.toUpperCase()}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
