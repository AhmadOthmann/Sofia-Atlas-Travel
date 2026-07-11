'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  User,
  MapPin,
  Play,
  Download,
  Calendar,
  TrendingUp,
  Bot,
} from 'lucide-react';

interface CallRecord {
  id: string;
  clientName: string;
  destination: string;
  type: 'incoming' | 'outgoing' | 'missed';
  status: 'completed' | 'in-progress' | 'missed' | 'voicemail';
  duration: string;
  date: string;
  time: string;
  agent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  outcome?: string;
  recordingUrl?: string;
}

const mockCalls: CallRecord[] = [
  {
    id: 'call-1',
    clientName: 'John D.',
    destination: 'Tuscany, Italy',
    type: 'incoming',
    status: 'in-progress',
    duration: '4:32',
    date: 'Today',
    time: '10:24 AM',
    agent: 'Copilot Alpha',
    sentiment: 'positive',
  },
  {
    id: 'call-2',
    clientName: 'Elena V.',
    destination: 'Maldives',
    type: 'incoming',
    status: 'in-progress',
    duration: '5:48',
    date: 'Today',
    time: '10:18 AM',
    agent: 'Luxury Concierge',
    sentiment: 'positive',
  },
  {
    id: 'call-3',
    clientName: 'Sarah M.',
    destination: 'Japan',
    type: 'incoming',
    status: 'completed',
    duration: '8:15',
    date: 'Today',
    time: '09:45 AM',
    agent: 'Itinerary Bot',
    sentiment: 'positive',
    outcome: 'Itinerary draft created',
    recordingUrl: '#',
  },
  {
    id: 'call-4',
    clientName: 'Robert K.',
    destination: 'South Africa',
    type: 'outgoing',
    status: 'completed',
    duration: '3:22',
    date: 'Today',
    time: '09:15 AM',
    agent: 'Copilot Alpha',
    sentiment: 'neutral',
    outcome: 'Follow-up scheduled',
    recordingUrl: '#',
  },
  {
    id: 'call-5',
    clientName: 'Marcus T.',
    destination: 'Patagonia',
    type: 'incoming',
    status: 'completed',
    duration: '6:45',
    date: 'Yesterday',
    time: '04:30 PM',
    agent: 'Copilot Alpha',
    sentiment: 'negative',
    outcome: 'Needs human follow-up',
    recordingUrl: '#',
  },
  {
    id: 'call-6',
    clientName: 'David L.',
    destination: 'Switzerland',
    type: 'missed',
    status: 'voicemail',
    duration: '0:45',
    date: 'Yesterday',
    time: '02:15 PM',
    agent: 'N/A',
    sentiment: 'neutral',
    outcome: 'Voicemail left',
  },
  {
    id: 'call-7',
    clientName: 'Amanda C.',
    destination: 'French Polynesia',
    type: 'outgoing',
    status: 'completed',
    duration: '12:30',
    date: 'Yesterday',
    time: '11:00 AM',
    agent: 'Luxury Concierge',
    sentiment: 'positive',
    outcome: 'Booking confirmed',
    recordingUrl: '#',
  },
  {
    id: 'call-8',
    clientName: 'Peter W.',
    destination: 'New Zealand',
    type: 'incoming',
    status: 'completed',
    duration: '7:20',
    date: '2 days ago',
    time: '03:45 PM',
    agent: 'Itinerary Bot',
    sentiment: 'positive',
    outcome: 'Quote sent',
    recordingUrl: '#',
  },
];

const typeIcons = {
  incoming: PhoneIncoming,
  outgoing: PhoneOutgoing,
  missed: PhoneMissed,
};

const statusConfig = {
  'in-progress': { label: 'In Progress', className: 'bg-success/10 text-success border-success/20 animate-pulse' },
  'completed': { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
  'missed': { label: 'Missed', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  'voicemail': { label: 'Voicemail', className: 'bg-warning/10 text-warning border-warning/20' },
};

const sentimentColors = {
  positive: 'text-success',
  neutral: 'text-muted-foreground',
  negative: 'text-destructive',
};

export default function CallsPage() {
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed' | 'missed'>('all');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(mockCalls[0]);

  const filteredCalls = filter === 'all' 
    ? mockCalls 
    : filter === 'missed' 
      ? mockCalls.filter(c => c.status === 'missed' || c.status === 'voicemail')
      : mockCalls.filter(c => c.status === filter);

  const stats = {
    total: mockCalls.length,
    inProgress: mockCalls.filter(c => c.status === 'in-progress').length,
    completed: mockCalls.filter(c => c.status === 'completed').length,
    missed: mockCalls.filter(c => c.status === 'missed' || c.status === 'voicemail').length,
  };

  const totalDuration = mockCalls
    .filter(c => c.status === 'completed')
    .reduce((acc, call) => {
      const [mins, secs] = call.duration.split(':').map(Number);
      return acc + mins * 60 + secs;
    }, 0);
  const avgDuration = Math.round(totalDuration / stats.completed / 60);

  return (
    <DashboardLayout>
      {/* Calls List */}
      <div className="flex-1 overflow-y-auto border-r border-border bg-card lg:max-w-2xl">
        <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">Call History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor AI-handled and human-assisted calls
          </p>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                filter === 'all' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
              )}
            >
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Calls</p>
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                filter === 'in-progress' ? 'border-success bg-success/5' : 'border-border hover:bg-muted/50'
              )}
            >
              <p className="text-2xl font-bold text-success">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">Live Now</p>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                filter === 'completed' ? 'border-info bg-info/5' : 'border-border hover:bg-muted/50'
              )}
            >
              <p className="text-2xl font-bold text-info">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </button>
            <button
              onClick={() => setFilter('missed')}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                filter === 'missed' ? 'border-destructive bg-destructive/5' : 'border-border hover:bg-muted/50'
              )}
            >
              <p className="text-2xl font-bold text-destructive">{stats.missed}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filteredCalls.map((call) => {
            const TypeIcon = typeIcons[call.type];
            return (
              <Card
                key={call.id}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary/50',
                  selectedCall?.id === call.id && 'border-primary bg-primary/5'
                )}
                onClick={() => setSelectedCall(call)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        call.type === 'incoming' ? 'bg-success/10' : call.type === 'outgoing' ? 'bg-info/10' : 'bg-destructive/10'
                      )}>
                        <TypeIcon className={cn(
                          'h-5 w-5',
                          call.type === 'incoming' ? 'text-success' : call.type === 'outgoing' ? 'text-info' : 'text-destructive'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{call.clientName}</span>
                          <Badge variant="outline" className={statusConfig[call.status].className}>
                            {statusConfig[call.status].label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{call.destination}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{call.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{call.date}, {call.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call Detail */}
      <div className="flex-1 overflow-y-auto bg-background">
        {selectedCall ? (
          <div>
            <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Call with {selectedCall.clientName}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCall.date} at {selectedCall.time}</p>
                </div>
                <Badge variant="outline" className={statusConfig[selectedCall.status].className}>
                  {statusConfig[selectedCall.status].label}
                </Badge>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold text-foreground">{selectedCall.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                        <Bot className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Handled By</p>
                        <p className="font-semibold text-foreground">{selectedCall.agent}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        selectedCall.sentiment === 'positive' ? 'bg-success/10' : selectedCall.sentiment === 'negative' ? 'bg-destructive/10' : 'bg-muted'
                      )}>
                        <TrendingUp className={cn('h-5 w-5', sentimentColors[selectedCall.sentiment])} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sentiment</p>
                        <p className={cn('font-semibold capitalize', sentimentColors[selectedCall.sentiment])}>
                          {selectedCall.sentiment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Call Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Call Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium text-foreground">{selectedCall.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Destination Interest</p>
                      <p className="font-medium text-foreground">{selectedCall.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Call Type</p>
                      <p className="font-medium text-foreground capitalize">{selectedCall.type}</p>
                    </div>
                    {selectedCall.outcome && (
                      <div>
                        <p className="text-sm text-muted-foreground">Outcome</p>
                        <p className="font-medium text-foreground">{selectedCall.outcome}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recording */}
              {selectedCall.recordingUrl && selectedCall.status === 'completed' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Call Recording</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
                      <Button size="icon" variant="outline" className="h-12 w-12 rounded-full">
                        <Play className="h-5 w-5" />
                      </Button>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 w-0 rounded-full bg-primary" />
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                          <span>0:00</span>
                          <span>{selectedCall.duration}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 gap-2">
                  <Phone className="h-4 w-4" />
                  Call Back
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <User className="h-4 w-4" />
                  View Client Profile
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center">
              <Phone className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">Select a call to view details</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
