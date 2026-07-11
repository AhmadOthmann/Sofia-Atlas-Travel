import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addMissionControlEvent, getDemoState } from '@/lib/mission-control-store';
import { isAuthorizedWebhook } from '@/lib/webhook-auth';

const eventSchema = z.object({
  event_type: z.string().default('qualification_completed'),
  session_id: z.string().min(1),
  caller_name: z.string().default('Unknown caller'),
  caller_email: z.string().default(''),
  caller_phone: z.string().default(''),
  destination: z.string().default('Not specified'),
  travel_dates: z.string().default('Flexible'),
  trip_length_days: z.coerce.number().nonnegative().default(0),
  num_travelers: z.coerce.number().nonnegative().default(0),
  traveler_profile: z.string().default(''),
  budget_eur: z.coerce.number().nonnegative().default(0),
  experience_style: z.string().default('mixed'),
  no_gos: z.string().default(''),
  objection: z.string().default(''),
  call_outcome: z.enum(['book_consultation', 'send_itinerary', 'schedule_callback', 'no_outcome']),
  one_sentence_summary: z.string().default(''),
}).passthrough();

export async function GET(request: NextRequest) {
  if (!isAuthorizedWebhook(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(await getDemoState());
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedWebhook(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid event', details: parsed.error.flatten() }, { status: 400 });
  }
  const event = await addMissionControlEvent({ ...parsed.data, id: randomUUID(), created_at: new Date().toISOString() });
  return NextResponse.json({ accepted: true, event }, { status: 201 });
}
