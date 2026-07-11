import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { addBooking, addCallback, addMissionControlEvent } from '@/lib/mission-control-store';
import { isAuthorizedWebhook } from '@/lib/webhook-auth';

export async function POST(request: NextRequest) {
  if (!isAuthorizedWebhook(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const timestamp = new Date().toISOString();
  const id = randomUUID();
  const event = await addMissionControlEvent({
    id,
    event_type: 'qualification_completed',
    session_id: `demo-${id}`,
    caller_name: 'Demo Caller',
    caller_email: 'caller@example.com',
    caller_phone: '+4915112345678',
    destination: 'Kyoto and Hakone',
    travel_dates: 'October 12 to October 22',
    trip_length_days: 10,
    num_travelers: 2,
    traveler_profile: 'couple',
    budget_eur: 12000,
    experience_style: 'cultural and foodie',
    no_gos: 'no shellfish',
    objection: 'concerned about travel time',
    call_outcome: 'book_consultation',
    one_sentence_summary: 'A couple planning a ten-day Japan trip focused on culture and food.',
    created_at: timestamp,
  });
  const callback = await addCallback({
    id: randomUUID(),
    caller_name: event.caller_name,
    caller_phone: event.caller_phone,
    requested_at: 'Tomorrow at 14:00',
    reason: 'Confirm final dates',
    status: 'scheduled',
    created_at: timestamp,
  });
  const booking = await addBooking({
    id: randomUUID(),
    name: event.caller_name,
    email: event.caller_email,
    date: '2026-07-15T14:00',
    notes: event.one_sentence_summary,
    status: 'confirmed',
    created_at: timestamp,
  });

  return NextResponse.json({ seeded: true, event, callback, booking }, { status: 201 });
}
