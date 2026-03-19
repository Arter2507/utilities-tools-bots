import { createContext, useContextSelector } from "use-context-selector";
import { useEffect, useMemo, useState } from "react";
import { JourneySchema, safeParseArray } from "./schemas";
import { useNotifications } from "./notifications";

export interface JourneyEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  createdAt: string;
}

interface JourneyContextValue {
  journeyEntries: JourneyEntry[];
  createJourneyEntry: (payload: Omit<JourneyEntry, "id" | "createdAt">) => void;
}

const JourneyContext = createContext<JourneyContextValue>({} as JourneyContextValue);

const STORAGE_KEY = "journey_entries_v1";

const defaultJourneyEntries: JourneyEntry[] = [
  {
    id: "journey-1",
    title: "First Sprint",
    content: "Started Personal Hub MVP and aligned on core modules.",
    date: "2026-03-10",
    imageUrl: "",
    createdAt: "2026-03-10T08:00:00.000Z",
  },
];

function readJourneyEntries(): JourneyEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = safeParseArray(JourneySchema, parsed);
    return list.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function writeJourneyEntries(entries: JourneyEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const addNotification = useNotifications((state) => state.addNotification);
  const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([]);

  useEffect(() => {
    const stored = readJourneyEntries();
    if (stored.length > 0) {
      setJourneyEntries(stored);
    } else {
      setJourneyEntries(defaultJourneyEntries);
      writeJourneyEntries(defaultJourneyEntries);
    }
  }, []);

  const createJourneyEntry = (payload: Omit<JourneyEntry, "id" | "createdAt">) => {
    const created: JourneyEntry = {
      ...payload,
      id: `journey-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setJourneyEntries((prev) => {
      const next = [created, ...prev];
      writeJourneyEntries(next);
      return next;
    });
    addNotification("Journey updated", created.title);
  };

  const value = useMemo(
    () => ({ journeyEntries, createJourneyEntry }),
    [journeyEntries]
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney<T>(selector: (value: JourneyContextValue) => T) {
  return useContextSelector(JourneyContext, selector);
}
