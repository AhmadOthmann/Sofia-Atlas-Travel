import 'server-only';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type MissionControlEvent = {
  id: string;
  event_type: string;
  session_id: string;
  caller_name: string;
  caller_email: string;
  caller_phone: string;
  destination: string;
  travel_dates: string;
  trip_length_days: number;
  num_travelers: number;
  traveler_profile: string;
  budget_eur: number;
  experience_style: string;
  no_gos: string;
  objection: string;
  call_outcome: 'book_consultation' | 'send_itinerary' | 'schedule_callback' | 'no_outcome';
  one_sentence_summary: string;
  created_at: string;
};

export type CallbackRequest = {
  id: string;
  caller_name: string;
  caller_phone: string;
  requested_at: string;
  reason: string;
  status: 'scheduled';
  created_at: string;
};

export type Booking = {
  id: string;
  name: string;
  email: string;
  date: string;
  notes: string;
  status: 'confirmed';
  created_at: string;
};

type DemoState = {
  events: MissionControlEvent[];
  callbacks: CallbackRequest[];
  bookings: Booking[];
};

const seedState: DemoState = {
  events: [
    {
      id: 'demo-event-1',
      event_type: 'qualification_completed',
      session_id: 'demo-sofia-call-001',
      caller_name: 'Lea Schneider',
      caller_email: 'lea@example.com',
      caller_phone: '+4915112345678',
      destination: 'Lisbon and the Algarve',
      travel_dates: 'September, flexible by one week',
      trip_length_days: 9,
      num_travelers: 2,
      traveler_profile: 'couple',
      budget_eur: 8500,
      experience_style: 'cultural and relaxation',
      no_gos: 'no large resorts',
      objection: 'uncertain about final dates',
      call_outcome: 'book_consultation',
      one_sentence_summary: 'A couple planning a flexible nine-day Portugal trip with an 8,500 EUR budget.',
      created_at: '2026-04-18T12:00:00.000Z',
    },
  ],
  callbacks: [],
  bookings: [],
};

const stateFile = process.env.MISSION_CONTROL_DATA_FILE ??
  (process.env.VERCEL ? '/tmp/sofia-atlas-demo.json' : path.join(process.cwd(), '.data', 'sofia-atlas-demo.json'));

let writeQueue = Promise.resolve();

async function loadState(): Promise<DemoState> {
  try {
    return JSON.parse(await readFile(stateFile, 'utf8')) as DemoState;
  } catch {
    return structuredClone(seedState);
  }
}

async function saveState(state: DemoState) {
  await mkdir(path.dirname(stateFile), { recursive: true });
  await writeFile(stateFile, JSON.stringify(state, null, 2), 'utf8');
}

async function updateState<T>(change: (state: DemoState) => T | Promise<T>): Promise<T> {
  let result!: T;
  writeQueue = writeQueue.then(async () => {
    const state = await loadState();
    result = await change(state);
    await saveState(state);
  });
  await writeQueue;
  return result;
}

export const getDemoState = loadState;

export const addMissionControlEvent = (event: MissionControlEvent) =>
  updateState((state) => {
    state.events.unshift(event);
    state.events = state.events.slice(0, 100);
    return event;
  });

export const addCallback = (callback: CallbackRequest) =>
  updateState((state) => {
    state.callbacks.unshift(callback);
    return callback;
  });

export const addBooking = (booking: Booking) =>
  updateState((state) => {
    state.bookings.unshift(booking);
    return booking;
  });
