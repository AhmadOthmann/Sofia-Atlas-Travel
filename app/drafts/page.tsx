'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  FileText,
  MapPin,
  Calendar,
  Euro,
  Check,
  X,
  Edit,
  Eye,
  Clock,
  User,
} from 'lucide-react';

interface Draft {
  id: string;
  leadName: string;
  destination: string;
  duration: string;
  status: 'pending-review' | 'approved' | 'revision-needed';
  highlights: string[];
  estimatedValue: string;
  createdAt: string;
  lastEdited: string;
  version: number;
}

const mockDrafts: Draft[] = [
  {
    id: 'draft-1',
    leadName: 'Sarah M.',
    destination: 'Japan - Tokyo, Kyoto, Hakone',
    duration: '14 Days',
    status: 'pending-review',
    highlights: ['Aman Tokyo', 'Private Tea Ceremony', 'Kaiseki Experience', 'Mount Fuji Views'],
    estimatedValue: '€145,000',
    createdAt: '2 hours ago',
    lastEdited: '30 minutes ago',
    version: 3,
  },
  {
    id: 'draft-2',
    leadName: 'David L.',
    destination: 'Switzerland - Zermatt, St. Moritz',
    duration: '10 Days',
    status: 'pending-review',
    highlights: ['The Chedi Andermatt', 'Private Ski Guide', 'Glacier Express', 'Fondue Experience'],
    estimatedValue: '€95,000',
    createdAt: '4 hours ago',
    lastEdited: '2 hours ago',
    version: 2,
  },
  {
    id: 'draft-3',
    leadName: 'Amanda C.',
    destination: 'French Polynesia - Bora Bora, Tahiti',
    duration: '12 Days',
    status: 'revision-needed',
    highlights: ['Four Seasons Overwater Villa', 'Private Island Picnic', 'Sunset Cruise'],
    estimatedValue: '€180,000',
    createdAt: '1 day ago',
    lastEdited: '6 hours ago',
    version: 4,
  },
  {
    id: 'draft-4',
    leadName: 'John D.',
    destination: 'Tuscany, Italy',
    duration: '8 Days',
    status: 'approved',
    highlights: ['Private Villa', 'Wine Estate Tour', 'Truffle Hunting', 'Cooking Class'],
    estimatedValue: '€78,000',
    createdAt: '3 days ago',
    lastEdited: '1 day ago',
    version: 5,
  },
  {
    id: 'draft-5',
    leadName: 'Robert K.',
    destination: 'South Africa - Cape Town, Kruger',
    duration: '11 Days',
    status: 'approved',
    highlights: ['Singita Safari Lodge', 'Private Game Drives', 'Table Mountain', 'Wine Tasting'],
    estimatedValue: '€62,000',
    createdAt: '5 days ago',
    lastEdited: '3 days ago',
    version: 2,
  },
  {
    id: 'draft-6',
    leadName: 'Elena V.',
    destination: 'Maldives - Private Island',
    duration: '7 Days',
    status: 'pending-review',
    highlights: ['Soneva Fushi Villa', 'Private Yacht', 'Underwater Dining', 'Spa Retreat'],
    estimatedValue: '€210,000',
    createdAt: '6 hours ago',
    lastEdited: '1 hour ago',
    version: 1,
  },
];

const statusConfig = {
  'pending-review': { label: 'Pending Review', className: 'bg-warning/10 text-warning border-warning/20' },
  'approved': { label: 'Approved', className: 'bg-success/10 text-success border-success/20' },
  'revision-needed': { label: 'Revision Needed', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function DraftsPage() {
  const [filter, setFilter] = useState<'all' | 'pending-review' | 'approved' | 'revision-needed'>('all');
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(mockDrafts[0]);

  const filteredDrafts = filter === 'all' ? mockDrafts : mockDrafts.filter(d => d.status === filter);

  const stats = {
    total: mockDrafts.length,
    pending: mockDrafts.filter(d => d.status === 'pending-review').length,
    approved: mockDrafts.filter(d => d.status === 'approved').length,
    revision: mockDrafts.filter(d => d.status === 'revision-needed').length,
  };

  return (
    <DashboardLayout>
      {/* Drafts List */}
      <div className="flex-1 overflow-y-auto border-r border-border bg-card lg:max-w-2xl">
        <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">Itinerary Drafts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and approve AI-generated travel proposals
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
              <p className="text-xs text-muted-foreground">Total</p>
            </button>
            <button
              onClick={() => setFilter('pending-review')}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                filter === 'pending-review' ? 'border-warning bg-warning/5' : 'border-border hover:bg-muted/50'
              )}
            >
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                filter === 'approved' ? 'border-success bg-success/5' : 'border-border hover:bg-muted/50'
              )}
            >
              <p className="text-2xl font-bold text-success">{stats.approved}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </button>
            <button
              onClick={() => setFilter('revision-needed')}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                filter === 'revision-needed' ? 'border-destructive bg-destructive/5' : 'border-border hover:bg-muted/50'
              )}
            >
              <p className="text-2xl font-bold text-destructive">{stats.revision}</p>
              <p className="text-xs text-muted-foreground">Revision</p>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filteredDrafts.map((draft) => (
            <Card
              key={draft.id}
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50',
                selectedDraft?.id === draft.id && 'border-primary bg-primary/5'
              )}
              onClick={() => setSelectedDraft(draft)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{draft.leadName}</span>
                      <Badge variant="outline" className={statusConfig[draft.status].className}>
                        {statusConfig[draft.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{draft.destination}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{draft.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="h-3.5 w-3.5" />
                        <span>{draft.estimatedValue}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{draft.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Draft Detail */}
      <div className="flex-1 overflow-y-auto bg-background">
        {selectedDraft ? (
          <div>
            <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedDraft.destination}</h2>
                  <p className="text-sm text-muted-foreground">For {selectedDraft.leadName} - Version {selectedDraft.version}</p>
                </div>
                <Badge variant="outline" className={statusConfig[selectedDraft.status].className}>
                  {statusConfig[selectedDraft.status].label}
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
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold text-foreground">{selectedDraft.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <Euro className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Est. Value</p>
                        <p className="font-semibold text-foreground">{selectedDraft.estimatedValue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                        <FileText className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Version</p>
                        <p className="font-semibold text-foreground">v{selectedDraft.version}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trip Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedDraft.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Draft History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Last edited</p>
                        <p className="text-xs text-muted-foreground">{selectedDraft.lastEdited}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Created by AI</p>
                        <p className="text-xs text-muted-foreground">{selectedDraft.createdAt}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              {selectedDraft.status !== 'approved' && (
                <div className="flex gap-3">
                  <Button className="flex-1 gap-2">
                    <Check className="h-4 w-4" />
                    Approve Draft
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Edit className="h-4 w-4" />
                    Request Revision
                  </Button>
                  <Button variant="ghost" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">Select a draft to view details</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
