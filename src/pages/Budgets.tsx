import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CHANNEL_LABELS, CHANNEL_COLORS, Channel } from '@/types/marketing';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Budgets() {
  const { projects, campaigns } = useMarketing();

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const remaining = totalBudget - totalSpent;

  const channelSpend = Object.entries(
    campaigns.reduce((acc, c) => {
      acc[c.channel] = (acc[c.channel] || 0) + c.spent;
      return acc;
    }, {} as Record<string, number>)
  ).map(([ch, val]) => ({
    name: CHANNEL_LABELS[ch as Channel],
    value: val,
    color: CHANNEL_COLORS[ch as Channel],
    budget: campaigns.filter(c => c.channel === ch).reduce((s, c) => s + c.budget, 0),
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold">Budgets & ROI</h1>
        <p className="text-muted-foreground mt-1">Suivi des dépenses et retour sur investissement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Budget Total</p>
            <p className="text-2xl font-heading font-bold mt-1">{totalBudget.toLocaleString()} €</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Dépensé</p>
            <p className="text-2xl font-heading font-bold mt-1 text-warning">{totalSpent.toLocaleString()} €</p>
            <Progress value={(totalSpent / totalBudget) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Restant</p>
            <p className="text-2xl font-heading font-bold mt-1 text-success">{remaining.toLocaleString()} €</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Dépenses par Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelSpend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="name" fontSize={11} angle={-25} textAnchor="end" height={60} />
                  <YAxis fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} €`} />
                  <Bar dataKey="budget" fill="hsl(221, 83%, 53%)" opacity={0.2} name="Budget" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="value" fill="hsl(221, 83%, 53%)" name="Dépensé" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Répartition par Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelSpend} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {channelSpend.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} €`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Détail par Projet</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projet</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Dépensé</TableHead>
                <TableHead className="text-right">Restant</TableHead>
                <TableHead className="text-right">Utilisation</TableHead>
                <TableHead className="text-right">ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(p => {
                const pct = Math.round((p.spent / p.budget) * 100);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{p.budget.toLocaleString()} €</TableCell>
                    <TableCell className="text-right">{p.spent.toLocaleString()} €</TableCell>
                    <TableCell className="text-right">{(p.budget - p.spent).toLocaleString()} €</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={pct} className="h-2 w-16" />
                        <span className="text-xs">{pct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">{p.roi}x</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
