export interface Lead {
  id: string;
  name: string;
  avatar?: string;
  status: 'qualifying' | 'in-call' | 'ready-for-handoff' | 'completed';
  aiProgress: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  budget: string;
  preferences: string[];
  destination?: string;
  callDuration?: string;
  assignedAgent?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'in-call';
  currentLead?: string;
  callsHandled: number;
}

export interface Itinerary {
  id: string;
  leadName: string;
  destination: string;
  duration: string;
  status: 'pending-review' | 'approved' | 'revision-needed';
  highlights: string[];
  estimatedValue: string;
  createdAt: string;
}

export interface TranscriptMessage {
  id: string;
  speaker: 'ai' | 'customer';
  message: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface WhisperPrompt {
  id: string;
  suggestion: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ClientProfile {
  id: string;
  name: string;
  avatar?: string;
  budget: string;
  preferences: string[];
  previousTrips: string[];
  vipStatus: 'platinum' | 'gold' | 'silver';
  notes: string;
}

export interface GlobalKPIs {
  timeToQuote: {
    value: string;
    trend: 'up' | 'down' | 'stable';
    change: string;
  };
  aiAccuracy: {
    value: number;
    trend: 'up' | 'down' | 'stable';
  };
  activeLeads: number;
  handoffsToday: number;
}
