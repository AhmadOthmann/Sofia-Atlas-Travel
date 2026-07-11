import { z } from 'zod';

const leadSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  status: z.enum(['qualifying', 'in-call', 'ready-for-handoff', 'completed']),
  aiProgress: z.number(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  budget: z.string(),
  preferences: z.array(z.string()),
  destination: z.string().optional(),
  callDuration: z.string().optional(),
  assignedAgent: z.string().optional(),
});

const itinerarySchema = z.object({
  id: z.string(),
  leadName: z.string(),
  destination: z.string(),
  duration: z.string(),
  status: z.enum(['pending-review', 'approved', 'revision-needed']),
  highlights: z.array(z.string()),
  estimatedValue: z.string(),
  createdAt: z.string(),
});

const transcriptMessageSchema = z.object({
  id: z.string(),
  speaker: z.enum(['ai', 'customer']),
  message: z.string(),
  timestamp: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
});

const whisperPromptSchema = z.object({
  id: z.string(),
  suggestion: z.string(),
  reason: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
});

const clientProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  budget: z.string(),
  preferences: z.array(z.string()),
  previousTrips: z.array(z.string()),
  vipStatus: z.enum(['platinum', 'gold', 'silver']),
  notes: z.string(),
});

export const dashboardDataSchema = z.object({
  leads: z.array(leadSchema),
  itineraries: z.array(itinerarySchema),
  transcript: z.array(transcriptMessageSchema),
  whisperPrompts: z.array(whisperPromptSchema),
  clientProfiles: z.record(z.string(), clientProfileSchema),
});

const dashboardEnvelopeSchema = z.union([
  dashboardDataSchema,
  z.object({ data: dashboardDataSchema }),
  z.object({ result: dashboardDataSchema }),
]);

export type DashboardData = z.infer<typeof dashboardDataSchema>;

export const extractDashboardData = (raw: unknown): DashboardData | null => {
  const parsedEnvelope = dashboardEnvelopeSchema.safeParse(raw);
  if (!parsedEnvelope.success) {
    return null;
  }

  const data = parsedEnvelope.data;
  if ('data' in data) {
    return data.data;
  }
  if ('result' in data) {
    return data.result;
  }
  return data;
};
