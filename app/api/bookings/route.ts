import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addBooking } from '@/lib/mission-control-store';

const bookingSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  date: z.string().min(1),
  notes: z.string().max(1000).default(''),
});

export async function POST(request: NextRequest) {
  const parsed = bookingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking', details: parsed.error.flatten() }, { status: 400 });
  }
  const booking = await addBooking({ ...parsed.data, id: randomUUID(), status: 'confirmed', created_at: new Date().toISOString() });
  return NextResponse.json({ confirmed: true, booking }, { status: 201 });
}
