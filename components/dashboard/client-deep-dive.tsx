'use client';

import { cn } from '@/lib/utils';
import type {
  ClientProfile,
  TranscriptMessage,
  WhisperPrompt,
} from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Wallet,
  Heart,
  Plane,
  Crown,
  MessageSquare,
  Lightbulb,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ClientDeepDiveProps {
  profile: ClientProfile | null;
  transcript: TranscriptMessage[];
  whisperPrompts: WhisperPrompt[];
  sentimentScore: number;
}

function SentimentGauge({ score }: { score: number }) {
  // Score from 0-100, where 50 is neutral
  const rotation = ((score - 50) / 50) * 90;
  const color =
    score >= 70
      ? 'text-success'
      : score >= 40
      ? 'text-warning'
      : 'text-destructive';

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-48 overflow-hidden">
        {/* Gauge background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <div
            className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full border-8 border-muted"
            style={{
              clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
            }}
          />
          {/* Colored arc */}
          <div
            className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full"
            style={{
              background: `conic-gradient(
                from 180deg,
                oklch(0.55 0.2 25) 0deg,
                oklch(0.78 0.12 80) 90deg,
                oklch(0.65 0.18 145) 180deg
              )`,
              clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
              opacity: 0.3,
            }}
          />
        </div>
        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 h-20 w-0.5 origin-bottom bg-foreground transition-transform duration-500"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-foreground" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className={cn('text-2xl font-bold', color)}>{score}%</span>
        <span className="text-sm text-muted-foreground">Sentiment</span>
      </div>
    </div>
  );
}

function VIPBadge({ status }: { status: ClientProfile['vipStatus'] }) {
  const colors = {
    platinum: 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900',
    gold: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900',
    silver: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800',
  };

  return (
    <Badge className={cn('gap-1 px-2 py-0.5', colors[status])}>
      <Crown className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function ClientDeepDive({
  profile,
  transcript,
  whisperPrompts,
  sentimentScore,
}: ClientDeepDiveProps) {
  if (!profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-background p-6">
        <div className="rounded-full bg-muted p-4">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No Client Selected
        </h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Select a lead from the Action Feed to view client details and live
          call metrics
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
        <h2 className="text-xl font-semibold text-foreground">Client Context</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live insights and conversation history
        </p>
      </div>

      <div>
        <div className="p-6">
          {/* Client Profile */}
          <Card className="mb-6 border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {profile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {profile.name}
                    </h3>
                    <VIPBadge status={profile.vipStatus} />
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Wallet className="h-4 w-4 text-primary" />
                      <span>{profile.budget}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="mt-5">
                <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>Preferences</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.preferences.map((pref) => (
                    <Badge
                      key={pref}
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Previous Trips */}
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Plane className="h-4 w-4" />
                  <span>Previous Trips</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.previousTrips.map((trip) => (
                    <span
                      key={trip}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {trip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">{profile.notes}</p>
              </div>
            </CardContent>
          </Card>

          {/* Live Call Metrics */}
          <Card className="mb-6 border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Live Call Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <SentimentGauge score={sentimentScore} />
            </CardContent>
          </Card>

          {/* Live Transcript */}
          <Card className="mb-6 border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                Live Transcript
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                {transcript.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.speaker === 'ai' ? 'flex-row' : 'flex-row-reverse'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium',
                        message.speaker === 'ai'
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-primary/20 text-primary'
                      )}
                    >
                      {message.speaker === 'ai' ? 'AI' : 'C'}
                    </div>
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-3 py-2',
                        message.speaker === 'ai'
                          ? 'bg-muted text-foreground'
                          : 'bg-primary/10 text-foreground'
                      )}
                    >
                      <p className="text-sm">{message.message}</p>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Whisper Prompts */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Lightbulb className="h-4 w-4" />
                AI Whisper Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                {whisperPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className={cn(
                      'rounded-lg border p-3',
                      prompt.priority === 'high'
                        ? 'border-primary/50 bg-primary/5'
                        : prompt.priority === 'medium'
                        ? 'border-secondary/50 bg-secondary/5'
                        : 'border-border bg-muted/30'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {prompt.priority === 'high' && (
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {prompt.suggestion}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {prompt.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
