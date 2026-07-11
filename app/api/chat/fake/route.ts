import { NextResponse } from 'next/server';
import { mockTranscript } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(
    {
      conversationId: 'fake-travel-chat-1',
      channel: 'web',
      participant: {
        role: 'customer',
        name: 'Alex',
      },
      agent: {
        role: 'ai',
        name: 'Atlas Travel Agent',
      },
      topic: 'Italy honeymoon travel planning',
      recommendation: {
        action: 'call',
        phone: '+498941433933',
        note: 'Call to finalize itinerary and payment options.',
      },
      messages: mockTranscript,
    },
    { status: 200 }
  );
}
