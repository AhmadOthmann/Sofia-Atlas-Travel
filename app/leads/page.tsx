'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { mockLeads, mockClientProfiles } from '@/lib/mock-data';
import type { Lead } from '@/lib/types';
import {
  Search,
  Phone,
  User,
  MapPin,
  Clock,
  TrendingUp,
  Filter,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const statusConfig = {
  'qualifying': { label: 'Qualifying', color: 'bg-muted text-muted-foreground' },
  'in-call': { label: 'In Call', color: 'bg-info/20 text-info' },
  'ready-for-handoff': { label: 'Ready for Handoff', color: 'bg-success/20 text-success' },
  'completed': { label: 'Completed', color: 'bg-primary/20 text-primary' },
};

const sentimentConfig = {
  positive: { color: 'text-success', bg: 'bg-success' },
  neutral: { color: 'text-muted-foreground', bg: 'bg-muted-foreground' },
  negative: { color: 'text-destructive', bg: 'bg-destructive' },
};

const vipBadgeConfig = {
  platinum: 'bg-primary/20 text-primary border-primary/30',
  gold: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  silver: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
};

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedProfile = selectedLead
    ? mockClientProfiles[selectedLead.id]
    : null;

  return (
    <DashboardLayout>
      {/* Main Leads List */}
      <div className="flex-1 overflow-y-auto border-r border-border bg-card">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">All Leads</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredLeads.length} leads in your pipeline
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads by name or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button
                variant={selectedStatus === null ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedStatus(null)}
              >
                All
              </Button>
              {Object.entries(statusConfig).map(([key, config]) => (
                <Button
                  key={key}
                  variant={selectedStatus === key ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedStatus(key)}
                >
                  {config.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="p-4">
          <div className="space-y-3">
            {filteredLeads.map((lead) => {
              const status = statusConfig[lead.status];
              const sentiment = sentimentConfig[lead.sentiment];

              return (
                <Card
                  key={lead.id}
                  className={cn(
                    'cursor-pointer transition-all hover:border-primary/50 hover:shadow-md',
                    selectedLead?.id === lead.id && 'border-primary bg-primary/5'
                  )}
                  onClick={() => setSelectedLead(lead)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Lead Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">
                              {lead.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {lead.destination || 'No destination'}
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge className={cn('text-xs', status.color)}>
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lead.budget}
                          </Badge>
                          {lead.preferences.slice(0, 2).map((pref) => (
                            <Badge
                              key={pref}
                              variant="outline"
                              className="text-xs text-muted-foreground"
                            >
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex flex-col items-end gap-2">
                        {/* Sentiment */}
                        <div className="flex items-center gap-2">
                          <div
                            className={cn('h-2 w-2 rounded-full', sentiment.bg)}
                          />
                          <span
                            className={cn('text-xs capitalize', sentiment.color)}
                          >
                            {lead.sentiment}
                          </span>
                        </div>

                        {/* AI Progress */}
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${lead.aiProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {lead.aiProgress}%
                          </span>
                        </div>

                        {/* Call Duration */}
                        {lead.callDuration && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {lead.callDuration}
                          </div>
                        )}

                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lead Detail Panel */}
      <div className="flex-1 overflow-y-auto bg-background">
        {selectedLead && selectedProfile ? (
          <div>
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <User className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-foreground">
                        {selectedProfile.name}
                      </h2>
                      <Badge
                        className={cn(
                          'border capitalize',
                          vipBadgeConfig[selectedProfile.vipStatus]
                        )}
                      >
                        {selectedProfile.vipStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedLead.destination}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button size="sm" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Take Over
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Budget & Status */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold text-foreground">
                      {selectedProfile.budget}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      AI Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-semibold text-foreground">
                        {selectedLead.aiProgress}%
                      </p>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${selectedLead.aiProgress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.preferences.map((pref) => (
                      <Badge
                        key={pref}
                        variant="outline"
                        className="bg-muted/50"
                      >
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Previous Trips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Previous Trips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedProfile.previousTrips.map((trip) => (
                      <div
                        key={trip}
                        className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{trip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedProfile.notes}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-muted p-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Select a Lead
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Click on a lead from the list to view their full profile and details.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
