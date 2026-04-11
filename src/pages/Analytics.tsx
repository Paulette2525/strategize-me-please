import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CHANNEL_LABELS, CHANNEL_COLORS, Channel } from '@/types/marketing';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

export default function Analytics() {
  const { projects, campaigns } = useMarketing();

  const channelPerformance = Object.entries(
    campaigns.reduce((acc, c) => {
      if (!acc[c.channel]) acc[c.channel] = { impressions: 0, clicks: 0, conversions: 0, spent: 0, revenue: 0 };
      acc[c.channel].impressions += c.impressions;
      acc[c.channel].clicks += c.clicks;
      acc[c.channel].conversions += c.conversions;
      acc[c.channel].spent += c.spent;
      acc[c.channel].revenue += c.spent * c.roi;
      return acc;
    }, {} as Record<string, { impressions: number; clicks: number; conversions: number; spent: number; revenue: number }>)
  ).map(([ch, data]) => ({
    channel: CHANNEL_LABELS[ch as Channel],
    color: CHANNEL_COLORS[ch as Channel],
    ...data,
    ctr: data.clicks > 0 ? ((data.clicks / data.impressions) * 100).toFixed(1) : 0,
    convRate: data.clicks > 0 ? ((data.conversions / data.clicks) * 100).toFixed(1) : 0,
    cpa: data.conversions > 0 ? (data.spent / data.conversions).toFixed(0) : 0,
  }));

  const radarData = channelPerformance.map(ch => ({
    channel: ch.channel,
    impressions: Math.min(ch.impressions / 10000, 100),
    clicks: Math.min(ch.clicks / 1000, 100),
    conversions: Math.min(ch.conversions / 100, 100),
  }));

  const projectComparison = projects.map(p => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + '...' : p.name,
    roi: p.roi,
    budget: p.budget / 1000,
    spent: p.spent / 1000,
    campaigns: campaigns.filter(c => c.projectId === p.id).length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Analyse détaillée de vos performances marketing</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Impressions', value: campaigns.reduce((s, c) => s + c.impressions, 0).toLocaleString() },
          { label: 'Clics', value: campaigns.reduce((s, c) => s + c.clicks, 0).toLocaleString() },
          { label: 'Conversions', value: campaigns.reduce((s, c) => s + c.conversions, 0).toLocaleString() },
          { label: 'CTR Moyen', value: `${(campaigns.reduce((s, c) => s + (c.clicks / Math.max(c.impressions, 1)), 0) / campaigns.length * 100).toFixed(1)}%` },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-heading font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="channels">
        <TabsList>
          <TabsTrigger value="channels">Par Canal</TabsTrigger>
          <TabsTrigger value="projects">Par Projet</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-heading">Conversions par Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                      <XAxis dataKey="channel" fontSize={11} angle={-25} textAnchor="end" height={60} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="conversions" name="Conversions" radius={[4, 4, 0, 0]}>
                        {channelPerformance.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-heading">Coût par Acquisition (CPA)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                      <XAxis type="number" fontSize={12} tickFormatter={(v) => `${v} €`} />
                      <YAxis dataKey="channel" type="category" fontSize={11} width={100} />
                      <Tooltip formatter={(v: number) => `${v} €`} />
                      <Bar dataKey="cpa" fill="hsl(262, 83%, 58%)" name="CPA" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading">Métriques détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Canal</th>
                      <th className="text-right py-2 font-medium">Impressions</th>
                      <th className="text-right py-2 font-medium">Clics</th>
                      <th className="text-right py-2 font-medium">CTR</th>
                      <th className="text-right py-2 font-medium">Conversions</th>
                      <th className="text-right py-2 font-medium">Taux Conv.</th>
                      <th className="text-right py-2 font-medium">Dépenses</th>
                      <th className="text-right py-2 font-medium">CPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelPerformance.map(ch => (
                      <tr key={ch.channel} className="border-b hover:bg-muted/50">
                        <td className="py-2 flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                          {ch.channel}
                        </td>
                        <td className="text-right py-2">{ch.impressions.toLocaleString()}</td>
                        <td className="text-right py-2">{ch.clicks.toLocaleString()}</td>
                        <td className="text-right py-2">{ch.ctr}%</td>
                        <td className="text-right py-2">{ch.conversions.toLocaleString()}</td>
                        <td className="text-right py-2">{ch.convRate}%</td>
                        <td className="text-right py-2">{ch.spent.toLocaleString()} €</td>
                        <td className="text-right py-2">{ch.cpa} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading">Comparaison des Projets — ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="roi" fill="hsl(221, 83%, 53%)" name="ROI" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Cell } from 'recharts';
