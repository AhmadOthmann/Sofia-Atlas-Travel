'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageCircle, PhoneCall, RefreshCw, User, Bot } from 'lucide-react';

type ChatMessage = {
  id: string;
  speaker: 'ai' | 'customer';
  message: string;
  timestamp: string;
};

type FakeChatResponse = {
  conversationId: string;
  channel: string;
  participant: {
    role: string;
    name: string;
  };
  agent: {
    role: string;
    name: string;
  };
  topic: string;
  recommendation: {
    action: 'call';
    phone: string;
    note: string;
  };
  messages: ChatMessage[];
};

const fallbackChat: FakeChatResponse = {
  conversationId: 'fallback-chat',
  channel: 'web',
  participant: {
    role: 'customer',
    name: 'Traveler',
  },
  agent: {
    role: 'ai',
    name: 'Atlas Travel Agent',
  },
  topic: 'Travel plan discussion',
  recommendation: {
    action: 'call',
    phone: '+498941433933',
    note: 'Call our specialist to finalize your itinerary.',
  },
  messages: [
    {
      id: 'f1',
      speaker: 'customer',
      message: 'Can you help me plan a luxury trip to Italy?',
      timestamp: '10:30:00',
    },
    {
      id: 'f2',
      speaker: 'ai',
      message: 'Absolutely. I can design a custom plan with hotels, transfers, and tours.',
      timestamp: '10:30:15',
    },
    {
      id: 'f3',
      speaker: 'ai',
      message: 'To confirm the details quickly, please call +498941433933.',
      timestamp: '10:30:30',
    },
  ],
};

export default function ChatPage() {
  const [chatData, setChatData] = useState<FakeChatResponse>(fallbackChat);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/fake', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      const data = (await response.json()) as FakeChatResponse;
      if (data?.messages?.length) {
        setChatData(data);
      }
    } catch {
      // Keep fallback chat when backend is unavailable.
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadChat();
  }, []);

  const phoneHref = useMemo(() => `tel:${chatData.recommendation.phone}`, [chatData]);

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col overflow-y-auto bg-background">
        <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Fake Travel Chat</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Backend-powered mock chat between customer and travel AI agent
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void loadChat();
              }}
            >
              <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="h-4 w-4 text-primary" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {chatData.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.speaker === 'ai' ? 'flex-row' : 'flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                      message.speaker === 'ai'
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-primary/20 text-primary'
                    )}
                  >
                    {message.speaker === 'ai' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>

                  <div
                    className={cn(
                      'max-w-[85%] rounded-xl px-3 py-2',
                      message.speaker === 'ai'
                        ? 'bg-muted text-foreground'
                        : 'bg-primary/10 text-foreground'
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Topic:</span> {chatData.topic}
                </p>
                <p>
                  <span className="font-medium text-foreground">Customer:</span> {chatData.participant.name}
                </p>
                <p>
                  <span className="font-medium text-foreground">Agent:</span> {chatData.agent.name}
                </p>
                <Badge variant="outline" className="mt-1">
                  {chatData.channel}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-primary">Bot Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-foreground">{chatData.recommendation.note}</p>
                <Button asChild className="w-full">
                  <a href={phoneHref}>
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Call {chatData.recommendation.phone}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
