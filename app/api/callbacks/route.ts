import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addCallback } from '@/lib/mission-control-store';
import { isAuthorizedWebhook } from '@/lib/webhook-auth';

const callbackSchema = z.object({
  caller_name: z.string().min(1),
  caller_phone: z.string().min(3),
  requested_at: z.string().default('Next available slot'),
  reason: z.string().default('Travel consultation follow-up'),
}).passthrough();

export async function POST(request: NextRequest) {
  if (!isAuthorizedWebhook(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const parsed = callbackSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid callback', details: parsed.error.flatten() }, { status: 400 });
  }
  const callback = await addCallback({ ...parsed.data, id: randomUUID(), status: 'scheduled', created_at: new Date().toISOString() });
  return NextResponse.json({ scheduled: true, callback }, { status: 201 });
}
