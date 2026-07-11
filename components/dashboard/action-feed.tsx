'use client';

import { cn } from '@/lib/utils';
import type { Lead, Itinerary } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Smile,
  Meh,
  Frown,
  PhoneCall,
  Eye,
  Edit3,
  RefreshCw,
  Clock,
  MapPin,
} from 'lucide-react';

interface ActionFeedProps {
  leads: Lead[];
  itineraries: Itinerary[];
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
}

function SentimentIcon({ sentiment }: { sentiment: Lead['sentiment'] }) {
  if (sentiment === 'positive') {
    return <Smile className="h-4 w-4 text-success" />;
  }
  if (sentiment === 'negative') {
    return <Frown className="h-4 w-4 text-destructive" />;
  }
  return <Meh className="h-4 w-4 text-muted-foreground" />;
}

function StatusBadge({ status }: { status: Lead['status'] }) {
  const variants: Record<Lead['status'], { label: string; className: string }> = {
    qualifying: {
      label: 'Qualifying',
      className: 'bg-muted text-muted-foreground',
    },
    'in-call': {
      label: 'In Call',
      className: 'bg-info/20 text-info',
    },
    'ready-for-handoff': {
      label: 'Ready',
      className: 'bg-primary/20 text-primary',
    },
    completed: {
      label: 'Completed',
      className: 'bg-success/20 text-success',
    },
  };

  const { label, className } = variants[status];

  return (
    <Badge variant="secondary" className={cn('text-xs font-medium', className)}>
      {label}
    </Badge>
  );
}

export function ActionFeed({
  leads,
  itineraries,
  selectedLeadId,
  onSelectLead,
}: ActionFeedProps) {
  const activeLeads = leads.filter(
    (l) => l.status !== 'completed'
  );
  const pendingItineraries = itineraries.filter(
    (i) => i.status === 'pending-review' || i.status === 'revision-needed'
  );

  return (
    <div className="border-r border-border bg-card">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">
          Real-time Action Feed
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor AI interactions and manage handoffs
        </p>
      </div>

      <div>
        <div className="p-6">
          {/* Handoff Queue */}
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Handoff Queue
              </h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {activeLeads.length} Active
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              {activeLeads.map((lead) => (
                <Card
                  key={lead.id}
                  className={cn(
                    'cursor-pointer transition-all duration-200',
                    'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
                    selectedLeadId === lead.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  )}
                  onClick={() => onSelectLead(lead.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                          {lead.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {lead.name}
                            </span>
                            <SentimentIcon sentiment={lead.sentiment} />
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{lead.destination}</span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={lead.status} />
                    </div>

                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          AI Progress
                        </span>
                        <span className="font-medium text-foreground">
                          {lead.aiProgress}%
                        </span>
                      </div>
                      <Progress value={lead.aiProgress} className="h-1.5" />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{lead.callDuration}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Eye className="mr-1.5 h-3 w-3" />
                          View Draft
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <PhoneCall className="mr-1.5 h-3 w-3" />
                          Take Over
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Drafts for Review */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Drafts for Review
              </h2>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                {pendingItineraries.length} Pending
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              {pendingItineraries.map((itinerary) => (
                <Card
                  key={itinerary.id}
                  className="border-border bg-card transition-all duration-200 hover:border-secondary/50"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm font-medium text-foreground">
                          {itinerary.leadName} - {itinerary.destination.split(' - ')[0]}
                        </CardTitle>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {itinerary.duration} | {itinerary.estimatedValue}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          itinerary.status === 'revision-needed'
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-primary/20 text-primary'
                        )}
                      >
                        {itinerary.status === 'revision-needed'
                          ? 'Needs Revision'
                          : 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {itinerary.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Created {itinerary.createdAt}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                        >
                          <RefreshCw className="mr-1.5 h-3 w-3" />
                          Redraft
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs"
                        >
                          <Edit3 className="mr-1.5 h-3 w-3" />
                          Edit & Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
