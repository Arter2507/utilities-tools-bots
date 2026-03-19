import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { z } from "zod";
import type { CalendarEvent, CalendarEventInput } from "@/modules/calendar/types";
import { fetchEvents, createEvent as createEventApi, updateEvent as updateEventApi, deleteEvent as deleteEventApi } from "@/modules/calendar/api/calendarApi";

export type ProjectColumn = "todo" | "in-progress" | "done";

export interface ProjectTask {
  id: string;
  title: string;
  tagColor: string;
  dueDate?: string; // YYYY-MM-DD
  column: ProjectColumn;
  createdAt: string;
}

export type FinanceType = "income" | "expense";

export interface FinanceTransaction {
  id: string;
  title: string;
  amount: number;
  type: FinanceType;
  category: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface HealthCycle {
  id: string;
  startDate: string; // YYYY-MM-DD
  lengthDays: number;
  createdAt: string;
}

export interface HealthLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  mood: number; // 1-5
  note?: string;
  createdAt: string;
}

export interface JourneyEntry {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  imageUrl?: string;
  createdAt: string;
}

export interface LoveAnniversary {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
}

export interface LoveData {
  startDate: string;
  anniversaries: LoveAnniversary[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  createdAt: string;
  read: boolean;
}

interface AppDataContextValue {
  events: CalendarEvent[];
  calendarEvents: CalendarEvent[];
  tasks: ProjectTask[];
  transactions: FinanceTransaction[];
  cycles: HealthCycle[];
  logs: HealthLog[];
  journeyEntries: JourneyEntry[];
  loveData: LoveData;
  cycleLength: number;
  notifications: NotificationItem[];
  isLoading: boolean;
  createEvent: (payload: CalendarEventInput) => Promise<void>;
  updateEvent: (id: string, payload: CalendarEventInput) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  createTask: (payload: Omit<ProjectTask, "id" | "createdAt">) => void;
  updateTask: (id: string, payload: Omit<ProjectTask, "id" | "createdAt">) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, column: ProjectColumn, index?: number) => void;
  reorderTasks: (column: ProjectColumn, orderedIds: string[]) => void;
  createTransaction: (payload: Omit<FinanceTransaction, "id" | "createdAt">) => void;
  deleteTransaction: (id: string) => void;
  createCycle: (payload: Omit<HealthCycle, "id" | "createdAt">) => void;
  createLog: (payload: Omit<HealthLog, "id" | "createdAt">) => void;
  setCycleLength: (length: number) => void;
  createJourneyEntry: (payload: Omit<JourneyEntry, "id" | "createdAt">) => void;
  createLoveAnniversary: (payload: Omit<LoveAnniversary, "id" | "createdAt">) => void;
  updateLoveStartDate: (date: string) => void;
  markNotificationRead: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextValue>({} as AppDataContextValue);

const TASKS_STORAGE_KEY = "project_board_tasks_v1";
const FINANCE_STORAGE_KEY = "finance_transactions_v1";
const HEALTH_CYCLE_STORAGE_KEY = "health_cycles_v1";
const HEALTH_LOG_STORAGE_KEY = "health_logs_v1";
const JOURNEY_STORAGE_KEY = "journey_entries_v1";
const LOVE_STORAGE_KEY = "love_data_v1";
const CYCLE_LENGTH_KEY = "health_cycle_length_v1";
const NOTIFICATIONS_KEY = "app_notifications_v1";

const defaultTasks: ProjectTask[] = [
  {
    id: "task-1",
    title: "Set sprint priorities",
    tagColor: "#F59E7A",
    dueDate: "2026-03-20",
    column: "todo",
    createdAt: "2026-03-15T09:20:00.000Z",
  },
  {
    id: "task-2",
    title: "Review Calendar UX",
    tagColor: "#7AB8F5",
    dueDate: "2026-03-22",
    column: "in-progress",
    createdAt: "2026-03-15T10:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Ship ProjectBoard",
    tagColor: "#6FD3B0",
    dueDate: "2026-03-25",
    column: "done",
    createdAt: "2026-03-15T11:30:00.000Z",
  },
];

const defaultTransactions: FinanceTransaction[] = [
  {
    id: "txn-1",
    title: "Salary",
    amount: 4500,
    type: "income",
    category: "Income",
    date: "2026-03-01",
    createdAt: "2026-03-01T08:00:00.000Z",
  },
  {
    id: "txn-2",
    title: "Grocery",
    amount: 120,
    type: "expense",
    category: "Food",
    date: "2026-03-14",
    createdAt: "2026-03-14T10:00:00.000Z",
  },
  {
    id: "txn-3",
    title: "Gym Membership",
    amount: 45,
    type: "expense",
    category: "Health",
    date: "2026-03-12",
    createdAt: "2026-03-12T09:30:00.000Z",
  },
];

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

const defaultLoveData: LoveData = {
  startDate: "2024-10-15",
  anniversaries: [
    {
      id: "love-1",
      title: "First Date",
      date: "2024-10-20",
      note: "Coffee shop weekend",
      createdAt: "2024-10-20T08:00:00.000Z",
    },
  ],
};

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagColor: z.string(),
  dueDate: z.string().optional(),
  column: z.enum(["todo", "in-progress", "done"]),
  createdAt: z.string().optional(),
});

const TransactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.number(),
  type: z.enum(["income", "expense"]),
  category: z.string(),
  date: z.string(),
  createdAt: z.string().optional(),
});

const CycleSchema = z.object({
  id: z.string(),
  startDate: z.string(),
  lengthDays: z.number(),
  createdAt: z.string().optional(),
});

const LogSchema = z.object({
  id: z.string(),
  date: z.string(),
  weight: z.number(),
  mood: z.number(),
  note: z.string().optional(),
  createdAt: z.string().optional(),
});

const JourneySchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  date: z.string(),
  imageUrl: z.string().optional(),
  createdAt: z.string().optional(),
});

const LoveDataSchema = z.object({
  startDate: z.string(),
  anniversaries: z.array(z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    note: z.string().optional(),
    createdAt: z.string().optional(),
  })),
});

const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string().optional(),
  createdAt: z.string(),
  read: z.boolean(),
});

function readTasks(): ProjectTask[] {
  const raw = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = z.array(TaskSchema).safeParse(parsed);
    if (!result.success) return [];
    return result.data.map((task) => ({
      ...task,
      createdAt: task.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function writeTasks(tasks: ProjectTask[]) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function readTransactions(): FinanceTransaction[] {
  const raw = localStorage.getItem(FINANCE_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = z.array(TransactionSchema).safeParse(parsed);
    if (!result.success) return [];
    return result.data.map((txn) => ({
      ...txn,
      createdAt: txn.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function writeTransactions(transactions: FinanceTransaction[]) {
  localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(transactions));
}

function readCycles(): HealthCycle[] {
  const raw = localStorage.getItem(HEALTH_CYCLE_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = z.array(CycleSchema).safeParse(parsed);
    if (!result.success) return [];
    return result.data.map((cycle) => ({
      ...cycle,
      createdAt: cycle.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function writeCycles(cycles: HealthCycle[]) {
  localStorage.setItem(HEALTH_CYCLE_STORAGE_KEY, JSON.stringify(cycles));
}

function readLogs(): HealthLog[] {
  const raw = localStorage.getItem(HEALTH_LOG_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = z.array(LogSchema).safeParse(parsed);
    if (!result.success) return [];
    return result.data.map((log) => ({
      ...log,
      createdAt: log.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function readJourneyEntries(): JourneyEntry[] {
  const raw = localStorage.getItem(JOURNEY_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = z.array(JourneySchema).safeParse(parsed);
    if (!result.success) return [];
    return result.data.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function writeJourneyEntries(entries: JourneyEntry[]) {
  localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(entries));
}

function readLoveData(): LoveData | null {
  const raw = localStorage.getItem(LOVE_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = LoveDataSchema.safeParse(parsed);
    if (!result.success) return null;
    return {
      startDate: result.data.startDate,
      anniversaries: result.data.anniversaries.map((item) => ({
        ...item,
        createdAt: item.createdAt ?? new Date().toISOString(),
      })),
    };
  } catch {
    return null;
  }
}

function writeLoveData(data: LoveData) {
  localStorage.setItem(LOVE_STORAGE_KEY, JSON.stringify(data));
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

function readNotifications(): NotificationItem[] {
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = z.array(NotificationSchema).safeParse(parsed);
    if (!result.success) return [];
    return result.data;
  } catch {
    return [];
  }
}

function writeNotifications(items: NotificationItem[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
}

function writeLogs(logs: HealthLog[]) {
  localStorage.setItem(HEALTH_LOG_STORAGE_KEY, JSON.stringify(logs));
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [cycles, setCycles] = useState<HealthCycle[]>([]);
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([]);
  const [loveData, setLoveData] = useState<LoveData>(defaultLoveData);
  const [cycleLength, setCycleLengthState] = useState<number>(28);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dismissTimers = useRef<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    Promise.all([
      fetchEvents(),
      Promise.resolve(readTasks()),
      Promise.resolve(readTransactions()),
      Promise.resolve(readCycles()),
      Promise.resolve(readLogs()),
      Promise.resolve(readJourneyEntries()),
      Promise.resolve(readLoveData()),
      Promise.resolve(readCycleLength()),
      Promise.resolve(readNotifications()),
    ])
      .then(([calendarEvents, storedTasks, storedTransactions, storedCycles, storedLogs, storedJourney, storedLove, storedCycleLength, storedNotifications]) => {
        if (!active) return;
        setEvents(calendarEvents);
        if (storedTasks.length > 0) {
          setTasks(storedTasks);
        } else {
          setTasks(defaultTasks);
          writeTasks(defaultTasks);
        }
        if (storedTransactions.length > 0) {
          setTransactions(storedTransactions);
        } else {
          setTransactions(defaultTransactions);
          writeTransactions(defaultTransactions);
        }
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
        if (storedJourney.length > 0) {
          setJourneyEntries(storedJourney);
        } else {
          setJourneyEntries(defaultJourneyEntries);
          writeJourneyEntries(defaultJourneyEntries);
        }
        if (storedLove) {
          setLoveData(storedLove);
        } else {
          setLoveData(defaultLoveData);
          writeLoveData(defaultLoveData);
        }
        setCycleLengthState(storedCycleLength);
        setNotifications(storedNotifications);
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const createEvent = async (payload: CalendarEventInput) => {
    const created = await createEventApi(payload);
    setEvents((prev) => [...prev, created]);
    addNotification("New calendar event", created.title);
  };

  const updateEvent = async (id: string, payload: CalendarEventInput) => {
    const updated = await updateEventApi(id, payload);
    if (!updated) return;
    setEvents((prev) => prev.map((event) => (event.id === updated.id ? updated : event)));
  };

  const deleteEvent = async (id: string) => {
    await deleteEventApi(id);
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const createTask = (payload: Omit<ProjectTask, "id" | "createdAt">) => {
    const created: ProjectTask = {
      ...payload,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => {
      const next = [...prev, created];
      writeTasks(next);
      return next;
    });
    addNotification("New task", created.title);
  };

  const updateTask = (id: string, payload: Omit<ProjectTask, "id" | "createdAt">) => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === id ? { ...payload, id, createdAt: task.createdAt } : task
      );
      writeTasks(next);
      return next;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.filter((task) => task.id !== id);
      writeTasks(next);
      return next;
    });
  };

  const moveTask = (id: string, column: ProjectColumn, index?: number) => {
    setTasks((prev) => {
      const moving = prev.find((task) => task.id === id);
      if (!moving) return prev;
      const remaining = prev.filter((task) => task.id !== id);
      const updated: ProjectTask = { ...moving, column };
      let next = remaining;
      if (typeof index === "number") {
        const columnTasks = remaining.filter((task) => task.column === column);
        const otherTasks = remaining.filter((task) => task.column !== column);
        const boundedIndex = Math.max(0, Math.min(index, columnTasks.length));
        const newColumnTasks = [...columnTasks.slice(0, boundedIndex), updated, ...columnTasks.slice(boundedIndex)];
        next = [...otherTasks, ...newColumnTasks];
      } else {
        next = [...remaining, updated];
      }
      writeTasks(next);
      return next;
    });
  };

  const reorderTasks = (column: ProjectColumn, orderedIds: string[]) => {
    setTasks((prev) => {
      const columnTasks = prev.filter((task) => task.column === column);
      const otherTasks = prev.filter((task) => task.column !== column);
      const ordered = orderedIds
        .map((id) => columnTasks.find((task) => task.id === id))
        .filter(Boolean) as ProjectTask[];
      const next = [...otherTasks, ...ordered];
      writeTasks(next);
      return next;
    });
  };

  const calendarEvents = useMemo(() => {
    const derived = tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        date: task.dueDate as string,
        startTime: "17:00",
        endTime: "17:30",
        notes: "Deadline from ProjectBoard",
        color: task.tagColor,
        priority: "medium" as const,
        createdAt: task.createdAt,
        source: "task" as const,
      }));
    return [...events, ...derived];
  }, [events, tasks]);

  const addNotification = (title: string, body?: string) => {
    const item: NotificationItem = {
      id: `noti-${Date.now()}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => {
      const next = [item, ...prev].slice(0, 50);
      writeNotifications(next);
      return next;
    });
    const timer = window.setTimeout(() => {
      setNotifications((prev) => {
        const next = prev.filter((noti) => noti.id !== item.id);
        writeNotifications(next);
        return next;
      });
      dismissTimers.current.delete(item.id);
    }, 10000);
    dismissTimers.current.set(item.id, timer);
  };

  const createTransaction = (payload: Omit<FinanceTransaction, "id" | "createdAt">) => {
    const created: FinanceTransaction = {
      ...payload,
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => {
      const next = [created, ...prev];
      writeTransactions(next);
      return next;
    });
    addNotification("Finance updated", `${created.title} · ${created.type}`);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => {
      const next = prev.filter((txn) => txn.id !== id);
      writeTransactions(next);
      return next;
    });
  };

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

  const createLoveAnniversary = (payload: Omit<LoveAnniversary, "id" | "createdAt">) => {
    const created: LoveAnniversary = {
      ...payload,
      id: `love-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLoveData((prev) => {
      const next = { ...prev, anniversaries: [created, ...prev.anniversaries] };
      writeLoveData(next);
      return next;
    });
    addNotification("New anniversary", created.title);
  };

  const updateLoveStartDate = (date: string) => {
    setLoveData((prev) => {
      const next = { ...prev, startDate: date };
      writeLoveData(next);
      return next;
    });
    addNotification("Love start date updated", date);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, read: true } : item));
      writeNotifications(next);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      dismissTimers.current.forEach((timer) => window.clearTimeout(timer));
      dismissTimers.current.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      events,
      calendarEvents,
      tasks,
      transactions,
      cycles,
      logs,
      journeyEntries,
      loveData,
      cycleLength,
      notifications,
      isLoading,
      createEvent,
      updateEvent,
      deleteEvent,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
      reorderTasks,
      createTransaction,
      deleteTransaction,
      createCycle,
      createLog,
      setCycleLength,
      createJourneyEntry,
      createLoveAnniversary,
      updateLoveStartDate,
      markNotificationRead,
    }),
    [
      events,
      calendarEvents,
      tasks,
      transactions,
      cycles,
      logs,
      journeyEntries,
      loveData,
      cycleLength,
      notifications,
      isLoading,
      createEvent,
      updateEvent,
      deleteEvent,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
      reorderTasks,
      createTransaction,
      deleteTransaction,
      createCycle,
      createLog,
      setCycleLength,
      createJourneyEntry,
      createLoveAnniversary,
      updateLoveStartDate,
      markNotificationRead,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  return useContextSelector(AppDataContext, (value) => value);
}

export function useAppSelector<T>(selector: (value: AppDataContextValue) => T) {
  return useContextSelector(AppDataContext, selector);
}
