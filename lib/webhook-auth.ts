import 'server-only';

import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

export function isAuthorizedWebhook(request: NextRequest) {
  const expected = process.env.HAPPYROBOT_WEBHOOK_SECRET;
  if (!expected) return false;
  const received = request.headers.get('x-webhook-secret') ?? '';
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
}
