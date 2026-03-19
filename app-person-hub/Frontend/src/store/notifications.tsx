import { createContext, useContextSelector } from "use-context-selector";
import { useEffect, useRef, useState } from "react";
import { NotificationSchema, safeParseArray } from "./schemas";

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  createdAt: string;
  read: boolean;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  addNotification: (title: string, body?: string) => void;
  markNotificationRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue>({} as NotificationContextValue);

const STORAGE_KEY = "app_notifications_v1";

function readNotifications(): NotificationItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return safeParseArray(NotificationSchema, parsed);
  } catch {
    return [];
  }
}

function writeNotifications(items: NotificationItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dismissTimers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    setNotifications(readNotifications());
  }, []);

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

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markNotificationRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications<T>(selector: (value: NotificationContextValue) => T) {
  return useContextSelector(NotificationContext, selector);
}
