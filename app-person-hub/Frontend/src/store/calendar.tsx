import { createContext, useContextSelector } from "use-context-selector";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent, CalendarEventInput } from "@/modules/calendar/types";
import { fetchEvents, createEvent as createEventApi, updateEvent as updateEventApi, deleteEvent as deleteEventApi } from "@/modules/calendar/api/calendarApi";
import { useTasks } from "./tasks";
import { useNotifications } from "./notifications";

interface CalendarContextValue {
  events: CalendarEvent[];
  calendarEvents: CalendarEvent[];
  isLoading: boolean;
  createEvent: (payload: CalendarEventInput) => Promise<void>;
  updateEvent: (id: string, payload: CalendarEventInput) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextValue>({} as CalendarContextValue);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const tasks = useTasks((state) => state.tasks);
  const addNotification = useNotifications((state) => state.addNotification);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchEvents()
      .then((items) => {
        if (!active) return;
        setEvents(items);
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

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

  const value = useMemo(
    () => ({ events, calendarEvents, isLoading, createEvent, updateEvent, deleteEvent }),
    [events, calendarEvents, isLoading]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar<T>(selector: (value: CalendarContextValue) => T) {
  return useContextSelector(CalendarContext, selector);
}
