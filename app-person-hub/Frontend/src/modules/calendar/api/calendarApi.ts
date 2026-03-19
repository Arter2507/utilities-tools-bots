import type { CalendarEvent, CalendarEventInput } from "../types";
import mockEvents from "../mock/googleEvents.json";

const STORAGE_KEY = "calendar_events_v1";
const DEFAULT_PRIORITY = "medium";

const delay = (min = 300, max = 600) =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

function readStorage(): CalendarEvent[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as CalendarEvent[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStorage(events: CalendarEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function normalizeEvent(event: CalendarEvent): CalendarEvent {
  return {
    ...event,
    createdAt: event.createdAt ?? new Date().toISOString(),
    priority: event.priority ?? DEFAULT_PRIORITY,
    source: event.source ?? "google",
  };
}

function seedFromMock() {
  const seeded = (mockEvents as CalendarEvent[]).map(normalizeEvent);
  writeStorage(seeded);
  return seeded;
}

export async function fetchEvents(): Promise<CalendarEvent[]> {
  await delay();
  const stored = readStorage();
  if (stored) {
    const normalized = stored.map(normalizeEvent);
    writeStorage(normalized);
    return normalized;
  }
  return seedFromMock();
}

export async function createEvent(input: CalendarEventInput): Promise<CalendarEvent> {
  await delay();
  const current = readStorage() ?? seedFromMock();
  const created: CalendarEvent = {
    ...input,
    id: `local-${Date.now()}`,
    source: "local",
    createdAt: input.createdAt ?? new Date().toISOString(),
    priority: input.priority ?? DEFAULT_PRIORITY,
  };
  const next = [...current, created];
  writeStorage(next);
  return created;
}

export async function updateEvent(id: string, input: CalendarEventInput): Promise<CalendarEvent | null> {
  await delay();
  const current = readStorage() ?? seedFromMock();
  const index = current.findIndex((event) => event.id === id);
  if (index === -1) {
    return null;
  }
  const updated: CalendarEvent = {
    ...input,
    id,
    source: current[index].source ?? "local",
    createdAt: input.createdAt ?? current[index].createdAt ?? new Date().toISOString(),
    priority: input.priority ?? current[index].priority ?? DEFAULT_PRIORITY,
  };
  const next = [...current];
  next[index] = updated;
  writeStorage(next);
  return updated;
}

export async function deleteEvent(id: string): Promise<boolean> {
  await delay();
  const current = readStorage() ?? seedFromMock();
  const next = current.filter((event) => event.id !== id);
  const removed = next.length !== current.length;
  writeStorage(next);
  return removed;
}
