import { createContext, useContextSelector } from "use-context-selector";
import { useEffect, useMemo, useState } from "react";
import { LoveDataSchema } from "./schemas";
import { useNotifications } from "./notifications";

export interface LoveAnniversary {
  id: string;
  title: string;
  date: string;
  note?: string;
  createdAt: string;
}

export interface LoveData {
  startDate: string;
  anniversaries: LoveAnniversary[];
}

interface LoveContextValue {
  loveData: LoveData;
  createLoveAnniversary: (payload: Omit<LoveAnniversary, "id" | "createdAt">) => void;
  updateLoveStartDate: (date: string) => void;
}

const LoveContext = createContext<LoveContextValue>({} as LoveContextValue);

const STORAGE_KEY = "love_data_v1";

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

function readLoveData(): LoveData | null {
  const raw = localStorage.getItem(STORAGE_KEY);
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function LoveProvider({ children }: { children: React.ReactNode }) {
  const addNotification = useNotifications((state) => state.addNotification);
  const [loveData, setLoveData] = useState<LoveData>(defaultLoveData);

  useEffect(() => {
    const stored = readLoveData();
    if (stored) {
      setLoveData(stored);
    } else {
      setLoveData(defaultLoveData);
      writeLoveData(defaultLoveData);
    }
  }, []);

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

  const value = useMemo(
    () => ({ loveData, createLoveAnniversary, updateLoveStartDate }),
    [loveData]
  );

  return <LoveContext.Provider value={value}>{children}</LoveContext.Provider>;
}

export function useLove<T>(selector: (value: LoveContextValue) => T) {
  return useContextSelector(LoveContext, selector);
}
