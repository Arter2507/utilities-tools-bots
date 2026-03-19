export type EventPriority = "low" | "medium" | "high";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  notes?: string;
  color: string; // hex color
  priority?: EventPriority;
  createdAt: string;
  source?: "google" | "local" | "task";
}

export type CalendarEventInput = Omit<CalendarEvent, "id" | "createdAt"> & {
  createdAt?: string;
};
