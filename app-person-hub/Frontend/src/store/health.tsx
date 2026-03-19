import { createContext, useContextSelector } from "use-context-selector";
import { useEffect, useMemo, useState } from "react";
import { CycleSchema, LogSchema, safeParseArray } from "./schemas";
import { useNotifications } from "./notifications";

export interface HealthCycle {
  id: string;
  startDate: string;
  lengthDays: number;
  createdAt: string;
}

export interface HealthLog {
  id: string;
  date: string;
  weight: number;
  mood: number;
  note?: string;
  createdAt: string;
}

interface HealthContextValue {
  cycles: HealthCycle[];
  logs: HealthLog[];
  cycleLength: number;
  createCycle: (payload: Omit<HealthCycle, "id" | "createdAt">) => void;
  createLog: (payload: Omit<HealthLog, "id" | "createdAt">) => void;
  setCycleLength: (length: number) => void;
}

const HealthContext = createContext<HealthContextValue>({} as HealthContextValue);

const CYCLE_STORAGE_KEY = "health_cycles_v1";
const LOG_STORAGE_KEY = "health_logs_v1";
const CYCLE_LENGTH_KEY = "health_cycle_length_v1";

const defaultCycles: HealthCycle[] = [
  {
    id: "cycle-1",
    startDate: "2026-03-03",
    lengthDays: 5,
    createdAt: "2026-03-03T07:00:00.000Z",
  },
];

const defaultLogs: HealthLog[] = [
  {
    id: "log-1",
    date: "2026-03-10",
    weight: 55.2,
    mood: 4,
    note: "Energetic",
    createdAt: "2026-03-10T08:00:00.000Z",
  },
  {
    id: "log-2",
    date: "2026-03-13",
    weight: 55.0,
    mood: 3,
    note: "Tired",
    createdAt: "2026-03-13T08:00:00.000Z",
  },
  {
    id: "log-3",
    date: "2026-03-15",
    weight: 54.8,
    mood: 5,
    note: "Great",
    createdAt: "2026-03-15T08:00:00.000Z",
  },
];

function readCycles(): HealthCycle[] {
  const raw = localStorage.getItem(CYCLE_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = safeParseArray(CycleSchema, parsed);
    return list.map((cycle) => ({
      ...cycle,
      createdAt: cycle.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function writeCycles(items: HealthCycle[]) {
  localStorage.setItem(CYCLE_STORAGE_KEY, JSON.stringify(items));
}

function readLogs(): HealthLog[] {
  const raw = localStorage.getItem(LOG_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = safeParseArray(LogSchema, parsed);
    return list.map((log) => ({
      ...log,
      createdAt: log.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function writeLogs(items: HealthLog[]) {
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(items));
}

function readCycleLength(): number {
  const raw = localStorage.getItem(CYCLE_LENGTH_KEY);
  if (!raw) return 28;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 28;
}

function writeCycleLength(length: number) {
  localStorage.setItem(CYCLE_LENGTH_KEY, String(length));
}

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const addNotification = useNotifications((state) => state.addNotification);
  const [cycles, setCycles] = useState<HealthCycle[]>([]);
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [cycleLength, setCycleLengthState] = useState<number>(28);

  useEffect(() => {
    const storedCycles = readCycles();
    const storedLogs = readLogs();
    const storedLength = readCycleLength();

    if (storedCycles.length > 0) {
      setCycles(storedCycles);
    } else {
      setCycles(defaultCycles);
      writeCycles(defaultCycles);
    }

    if (storedLogs.length > 0) {
      setLogs(storedLogs);
    } else {
      setLogs(defaultLogs);
      writeLogs(defaultLogs);
    }

    setCycleLengthState(storedLength);
  }, []);

  const createCycle = (payload: Omit<HealthCycle, "id" | "createdAt">) => {
    const created: HealthCycle = {
      ...payload,
      id: `cycle-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCycles((prev) => {
      const next = [created, ...prev];
      writeCycles(next);
      return next;
    });
    addNotification("Cycle updated", `Start ${created.startDate}`);
  };

  const createLog = (payload: Omit<HealthLog, "id" | "createdAt">) => {
    const created: HealthLog = {
      ...payload,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLogs((prev) => {
      const next = [created, ...prev];
      writeLogs(next);
      return next;
    });
    addNotification("Health log added", `${created.date} · Mood ${created.mood}`);
  };

  const setCycleLength = (length: number) => {
    setCycleLengthState(length);
    writeCycleLength(length);
    addNotification("Cycle length updated", `${length} days`);
  };

  const value = useMemo(
    () => ({ cycles, logs, cycleLength, createCycle, createLog, setCycleLength }),
    [cycles, logs, cycleLength]
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth<T>(selector: (value: HealthContextValue) => T) {
  return useContextSelector(HealthContext, selector);
}
