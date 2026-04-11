import { useMarketing } from '@/contexts/MarketingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CHANNEL_COLORS, Channel } from '@/types/marketing';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function CalendarPage() {
  const { campaigns, projects } = useMarketing();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5, 1)); // June 2024

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const getCampaignsForDay = (day: number) => {
    const date = new Date(year, month, day);
    return campaigns.filter(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return date >= start && date <= end;
    });
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold">Calendrier</h1>
        <p className="text-muted-foreground mt-1">Vue calendrier de vos campagnes</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl font-heading">
              {MONTHS[month]} {year}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {DAYS.map(d => (
              <div key={d} className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
            {days.map((day, i) => {
              const dayCampaigns = day ? getCampaignsForDay(day) : [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div
                  key={i}
                  className={`bg-card p-1.5 min-h-[80px] ${!day ? 'bg-muted/30' : ''}`}
                >
                  {day && (
                    <>
                      <span className={`text-xs font-medium inline-flex items-center justify-center h-6 w-6 rounded-full ${isToday ? 'bg-primary text-primary-foreground' : ''}`}>
                        {day}
                      </span>
                      <div className="space-y-0.5 mt-0.5">
                        {dayCampaigns.slice(0, 2).map(c => (
                          <div
                            key={c.id}
                            className="text-[10px] leading-tight px-1 py-0.5 rounded truncate text-primary-foreground"
                            style={{ backgroundColor: CHANNEL_COLORS[c.channel] }}
                            title={c.name}
                          >
                            {c.name}
                          </div>
                        ))}
                        {dayCampaigns.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">+{dayCampaigns.length - 2}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading">Campagnes ce mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {campaigns
              .filter(c => {
                const start = new Date(c.startDate);
                const end = new Date(c.endDate);
                const monthStart = new Date(year, month, 1);
                const monthEnd = new Date(year, month + 1, 0);
                return start <= monthEnd && end >= monthStart;
              })
              .map(c => {
                const project = projects.find(p => p.id === c.projectId);
                return (
                  <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: CHANNEL_COLORS[c.channel] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{project?.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{c.channel.toUpperCase()}</Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
