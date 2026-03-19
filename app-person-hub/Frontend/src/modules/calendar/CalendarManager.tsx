import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CalendarGrid } from "./components/CalendarGrid";
import { EventListMobile } from "./components/EventListMobile";
import { EventModal } from "./components/EventModal";
import { CompactCalendarMobile } from "./components/CompactCalendarMobile";
import type { CalendarEvent, CalendarEventInput } from "./types";
import { getMonthGrid, getMonthLabel, parseDateKey } from "./utils/date";
import { WEEKDAYS } from "./constants";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/store/calendar";

export default function CalendarManager() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const calendarEvents = useCalendar((state) => state.calendarEvents);
  const createEvent = useCalendar((state) => state.createEvent);
  const updateEvent = useCalendar((state) => state.updateEvent);
  const deleteEvent = useCalendar((state) => state.deleteEvent);
  const isLoading = useCalendar((state) => state.isLoading);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "compact">("list");
  const navigate = useNavigate();

  const gridDates = useMemo(() => getMonthGrid(viewDate), [viewDate]);
  const currentMonth = viewDate.getMonth();

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    calendarEvents.forEach((event) => {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    });
    map.forEach((list) => list.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    return map;
  }, [calendarEvents]);

  const monthKey = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}`;
  const datesWithEvents = useMemo(() => {
    return Array.from(eventsByDate.keys())
      .filter((key) => key.startsWith(monthKey))
      .sort();
  }, [eventsByDate, monthKey]);

  const openModalForDate = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openModalForEvent = (event: CalendarEvent) => {
    setSelectedDate(parseDateKey(event.date));
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: CalendarEventInput) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, payload);
    } else {
      await createEvent(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Calendar Manager</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] uppercase tracking-wide">
              Mock Google API
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{getMonthLabel(viewDate)}</h1>
          <p className="text-muted-foreground">Track solar & lunar schedules with full event control.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewDate(new Date())}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Today
          </button>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card/60 p-1">
            <button
              type="button"
              className="rounded-md p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => openModalForDate(new Date())}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/50 p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
            <span>{isLoading ? "Syncing events..." : "Synced from local mock"}</span>
          </div>
          <span className="hidden text-right md:inline">Week starts on Sunday</span>
        </div>

        <div className="mb-3 flex items-center justify-between md:hidden">
          <p className="text-xs text-muted-foreground">Mobile view</p>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/70 p-1 text-xs">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              className={cn(
                "rounded-full px-3 py-1",
                mobileView === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setMobileView("compact")}
              className={cn(
                "rounded-full px-3 py-1",
                mobileView === "compact" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              Compact
            </button>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={cn(
                "px-2",
                index === 0 && "text-[hsl(var(--weekend-sun))]",
                index === 6 && "text-[hsl(var(--weekend-sat))]"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="mt-3 hidden md:block">
          <CalendarGrid
            dates={gridDates}
            currentMonth={currentMonth}
            eventsByDate={eventsByDate}
            onSelectDate={openModalForDate}
            onSelectEvent={(event) => {
              if (event.source === "task") {
                navigate("/project-board");
                return;
              }
              openModalForEvent(event);
            }}
          />
        </div>

        <div className="mt-3 md:hidden">
          {mobileView === "list" ? (
            <EventListMobile
              datesWithEvents={datesWithEvents}
              eventsByDate={eventsByDate}
              onSelectDate={openModalForDate}
              onSelectEvent={(event) => {
                if (event.source === "task") {
                  navigate("/project-board");
                  return;
                }
                openModalForEvent(event);
              }}
            />
          ) : (
            <CompactCalendarMobile
              dates={gridDates}
              currentMonth={currentMonth}
              eventsByDate={eventsByDate}
              onSelectDate={openModalForDate}
            />
          )}
        </div>
      </div>

      <EventModal
        open={isModalOpen}
        date={selectedDate}
        event={editingEvent}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
