import { NextRequest, NextResponse } from 'next/server';
import { callTwinDb } from '@/lib/happyrobot-twindb';
import { z } from 'zod';

const proxyPayloadSchema = z.object({
  endpoint: z.string().min(1).max(200).regex(/^\/[a-zA-Z0-9/_-]+$/),
  method: z.enum(['GET', 'POST']).default('GET'),
  query: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  body: z.unknown().optional(),
}).strict();

const isAllowedEndpoint = (endpoint: string) => {
  const configured = process.env.HAPPYROBOT_TWINDB_ALLOWED_ENDPOINTS ??
    process.env.HAPPYROBOT_TWINDB_DASHBOARD_ENDPOINT ?? '/dashboard/live';
  return configured.split(',').map((value) => value.trim()).includes(endpoint);
};

export async function GET() {
  const hasRequiredEnv =
    Boolean(process.env.HAPPYROBOT_TWINDB_BASE_URL) &&
    Boolean(process.env.HAPPYROBOT_TWINDB_API_KEY);

  return NextResponse.json(
    {
      service: 'happyrobot-twindb',
      configured: hasRequiredEnv,
      message: hasRequiredEnv
        ? 'Happy Robot TWIN DB is configured.'
        : 'Missing HAPPYROBOT_TWINDB_BASE_URL or HAPPYROBOT_TWINDB_API_KEY',
    },
    { status: hasRequiredEnv ? 200 : 500 }
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  const parsed = proxyPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request payload.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const payload = parsed.data;
  if (!isAllowedEndpoint(payload.endpoint)) {
    return NextResponse.json({ error: 'Endpoint is not allowed.' }, { status: 403 });
  }

  try {
    const result = await callTwinDb({
      endpoint: payload.endpoint,
      method: payload.method,
      query: payload.query,
      body: payload.body,
    });

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown server error.';

    return NextResponse.json(
      {
        error: 'Failed to connect to Happy Robot TWIN DB.',
        details: message,
      },
      { status: 500 }
    );
  }
}
