import { NextResponse } from 'next/server';
import { callTwinDb } from '@/lib/happyrobot-twindb';
import { extractDashboardData } from '@/lib/happyrobot-dashboard-schema';
import {
  mockClientProfiles,
  mockItineraries,
  mockLeads,
  mockTranscript,
  mockWhisperPrompts,
} from '@/lib/mock-data';
import { getDemoState } from '@/lib/mission-control-store';

const DEFAULT_ENDPOINT = '/dashboard/live';

const mockDashboardPayload = {
  leads: mockLeads,
  itineraries: mockItineraries,
  transcript: mockTranscript,
  whisperPrompts: mockWhisperPrompts,
  clientProfiles: mockClientProfiles,
  source: 'mock' as const,
};

export async function GET() {
  const endpoint =
    process.env.HAPPYROBOT_TWINDB_DASHBOARD_ENDPOINT ?? DEFAULT_ENDPOINT;

  const hasTwinDbConfig =
    Boolean(process.env.HAPPYROBOT_TWINDB_BASE_URL) &&
    Boolean(process.env.HAPPYROBOT_TWINDB_API_KEY);

  if (!hasTwinDbConfig) {
    const state = await getDemoState();
    const eventLeads = state.events.map((event) => ({
      id: event.id,
      name: event.caller_name,
      status: event.call_outcome === 'no_outcome' ? 'completed' as const : 'ready-for-handoff' as const,
      aiProgress: 100,
      sentiment: event.call_outcome === 'no_outcome' ? 'neutral' as const : 'positive' as const,
      budget: event.budget_eur ? `€${event.budget_eur.toLocaleString('en-US')}` : 'Not specified',
      preferences: [event.experience_style, event.traveler_profile].filter(Boolean),
      destination: event.destination,
      assignedAgent: 'Sofia',
    }));
    const eventProfiles = Object.fromEntries(state.events.map((event) => [event.id, {
      id: event.id,
      name: event.caller_name,
      budget: event.budget_eur ? `€${event.budget_eur.toLocaleString('en-US')}` : 'Not specified',
      preferences: [event.experience_style, event.traveler_profile].filter(Boolean),
      previousTrips: [],
      vipStatus: 'silver' as const,
      notes: [event.one_sentence_summary, event.no_gos && `No-gos: ${event.no_gos}`, event.objection && `Objection: ${event.objection}`].filter(Boolean).join(' '),
    }]));

    return NextResponse.json({
      ...mockDashboardPayload,
      leads: [...eventLeads, ...mockDashboardPayload.leads],
      clientProfiles: { ...mockDashboardPayload.clientProfiles, ...eventProfiles },
      activity: {
        events: state.events,
        callbacks: state.callbacks,
        bookings: state.bookings,
      },
    }, { status: 200 });
  }

  try {
    const result = await callTwinDb({
      endpoint,
      method: 'GET',
    });

    if (!result.ok) {
      return NextResponse.json(mockDashboardPayload, { status: 200 });
    }

    const parsed = extractDashboardData(result.data);
    if (!parsed) {
      return NextResponse.json(mockDashboardPayload, { status: 200 });
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch {
    return NextResponse.json(mockDashboardPayload, { status: 200 });
  }
}
