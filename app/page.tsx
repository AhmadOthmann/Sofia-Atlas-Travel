'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ActionFeed } from '@/components/dashboard/action-feed';
import { ClientDeepDive } from '@/components/dashboard/client-deep-dive';
import {
  extractDashboardData,
  type DashboardData,
} from '@/lib/happyrobot-dashboard-schema';
import {
  mockLeads,
  mockItineraries,
  mockTranscript,
  mockWhisperPrompts,
  mockClientProfiles,
} from '@/lib/mock-data';

const fallbackData: DashboardData = {
  leads: mockLeads,
  itineraries: mockItineraries,
  transcript: mockTranscript,
  whisperPrompts: mockWhisperPrompts,
  clientProfiles: mockClientProfiles,
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(fallbackData);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>('1');

  useEffect(() => {
    let isMounted = true;

    const loadLiveData = async () => {
      try {
        const response = await fetch('/api/dashboard/live', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          return;
        }

        const raw = (await response.json()) as unknown;
        const parsed = extractDashboardData(raw);

        if (parsed && isMounted) {
          setDashboardData(parsed);
          setSelectedLeadId((current) => {
            if (current && parsed.leads.some((lead) => lead.id === current)) {
              return current;
            }
            return parsed.leads[0]?.id ?? null;
          });
        }
      } catch {
        // Keep fallback mock data when live data is unavailable.
      }
    };

    void loadLiveData();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProfile = useMemo(() => {
    if (!selectedLeadId) return null;
    return dashboardData.clientProfiles[selectedLeadId] || null;
  }, [dashboardData.clientProfiles, selectedLeadId]);

  // Calculate sentiment score based on selected lead
  const sentimentScore = useMemo(() => {
    if (!selectedLeadId) return 50;
    const lead = dashboardData.leads.find((l) => l.id === selectedLeadId);
    if (!lead) return 50;
    return lead.sentiment === 'positive'
      ? 78
      : lead.sentiment === 'negative'
      ? 28
      : 50;
  }, [dashboardData.leads, selectedLeadId]);

  return (
    <DashboardLayout>
      {/* Middle - Action Feed */}
      <div className="flex-1 overflow-y-auto lg:max-w-xl xl:max-w-2xl">
        <ActionFeed
          leads={dashboardData.leads}
          itineraries={dashboardData.itineraries}
          selectedLeadId={selectedLeadId}
          onSelectLead={setSelectedLeadId}
        />
      </div>

      {/* Right - Client Deep Dive */}
      <div className="flex-1 overflow-y-auto">
        <ClientDeepDive
          profile={selectedProfile}
          transcript={dashboardData.transcript}
          whisperPrompts={dashboardData.whisperPrompts}
          sentimentScore={sentimentScore}
        />
      </div>
    </DashboardLayout>
  );
}
