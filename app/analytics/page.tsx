'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  Clock,
  Euro,
  Bot,
  Target,
  CheckCircle,
  Calendar,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: typeof TrendingUp;
  color: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Leads',
    value: '247',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'text-primary',
  },
  {
    title: 'Calls Handled',
    value: '1,842',
    change: '+8%',
    trend: 'up',
    icon: Phone,
    color: 'text-info',
  },
  {
    title: 'Avg. Call Duration',
    value: '6m 24s',
    change: '-15%',
    trend: 'down',
    icon: Clock,
    color: 'text-success',
  },
  {
    title: 'Revenue Generated',
    value: '€2.4M',
    change: '+23%',
    trend: 'up',
    icon: Euro,
    color: 'text-warning',
  },
];

interface AgentPerformance {
  name: string;
  callsHandled: number;
  successRate: number;
  avgDuration: string;
  satisfaction: number;
}

const agentPerformance: AgentPerformance[] = [
  { name: 'Copilot Alpha', callsHandled: 847, successRate: 94.2, avgDuration: '5m 32s', satisfaction: 4.8 },
  { name: 'Luxury Concierge', callsHandled: 523, successRate: 91.8, avgDuration: '7m 15s', satisfaction: 4.7 },
  { name: 'Itinerary Bot', callsHandled: 472, successRate: 89.5, avgDuration: '6m 48s', satisfaction: 4.5 },
];

interface WeeklyData {
  day: string;
  calls: number;
  conversions: number;
}

const weeklyData: WeeklyData[] = [
  { day: 'Mon', calls: 45, conversions: 12 },
  { day: 'Tue', calls: 52, conversions: 15 },
  { day: 'Wed', calls: 48, conversions: 14 },
  { day: 'Thu', calls: 61, conversions: 18 },
  { day: 'Fri', calls: 55, conversions: 16 },
  { day: 'Sat', calls: 32, conversions: 8 },
  { day: 'Sun', calls: 28, conversions: 6 },
];

interface TopDestination {
  name: string;
  leads: number;
  revenue: string;
  growth: number;
}

const topDestinations: TopDestination[] = [
  { name: 'Italy', leads: 42, revenue: '€385K', growth: 15 },
  { name: 'Japan', leads: 38, revenue: '€420K', growth: 22 },
  { name: 'Maldives', leads: 31, revenue: '€510K', growth: 8 },
  { name: 'Switzerland', leads: 28, revenue: '€295K', growth: 12 },
  { name: 'French Polynesia', leads: 24, revenue: '€380K', growth: 18 },
];

const maxCalls = Math.max(...weeklyData.map(d => d.calls));

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Performance metrics and insights
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last 30 days</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                      <div className={cn(
                        'mt-1 flex items-center gap-1 text-sm',
                        stat.trend === 'up' ? 'text-success' : 'text-destructive'
                      )}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{stat.change} vs last month</span>
                      </div>
                    </div>
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg bg-muted',
                      stat.color
                    )}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  Weekly Call Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-2" style={{ height: '200px' }}>
                  {weeklyData.map((data) => (
                    <div key={data.day} className="flex flex-1 flex-col items-center gap-2">
                      <div className="relative w-full flex flex-col items-center gap-1" style={{ height: '160px' }}>
                        <div
                          className="w-full max-w-8 rounded-t bg-primary/20"
                          style={{ height: `${(data.calls / maxCalls) * 100}%` }}
                        />
                        <div
                          className="absolute bottom-0 w-full max-w-8 rounded-t bg-primary"
                          style={{ height: `${(data.conversions / maxCalls) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-primary/20" />
                    <span className="text-muted-foreground">Total Calls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-primary" />
                    <span className="text-muted-foreground">Conversions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Destinations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Top Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDestinations.map((dest, index) => (
                    <div key={dest.name} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">{dest.name}</p>
                          <p className="font-semibold text-foreground">{dest.revenue}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{dest.leads} leads</span>
                          <span className="text-success">+{dest.growth}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Agent Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-primary" />
                AI Agent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Agent</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Calls Handled</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Success Rate</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Avg. Duration</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformance.map((agent) => (
                      <tr key={agent.name} className="border-b border-border last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info/10">
                              <Bot className="h-4 w-4 text-info" />
                            </div>
                            <span className="font-medium text-foreground">{agent.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-foreground">{agent.callsHandled.toLocaleString()}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-success"
                                style={{ width: `${agent.successRate}%` }}
                              />
                            </div>
                            <span className="text-sm text-foreground">{agent.successRate}%</span>
                          </div>
                        </td>
                        <td className="py-4 text-foreground">{agent.avgDuration}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-foreground">{agent.satisfaction}</span>
                            <span className="text-warning">★</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AI Resolution Rate</p>
                    <p className="text-2xl font-bold text-foreground">87.3%</p>
                    <p className="text-xs text-success">+5.2% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Time to Quote</p>
                    <p className="text-2xl font-bold text-foreground">2.4 hours</p>
                    <p className="text-xs text-success">-18% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info/10">
                    <Users className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Client Retention</p>
                    <p className="text-2xl font-bold text-foreground">94.7%</p>
                    <p className="text-xs text-success">+2.1% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
