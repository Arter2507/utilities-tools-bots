import type { CalendarEvent } from "../types";
import { EventChip } from "./EventChip";
import { cn } from "@/lib/utils";
import { formatLunarFull } from "../utils/lunar";
import { getWeekdayLabel, parseDateKey } from "../utils/date";

interface EventListMobileProps {
  datesWithEvents: string[];
  eventsByDate: Map<string, CalendarEvent[]>;
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function EventListMobile({
  datesWithEvents,
  eventsByDate,
  onSelectDate,
  onSelectEvent,
}: EventListMobileProps) {
  if (datesWithEvents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-card/50 p-6 text-center text-sm text-muted-foreground">
        No events scheduled for this month.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {datesWithEvents.map((dateKey) => {
        const date = parseDateKey(dateKey);
        const weekday = date.getDay();
        const isSunday = weekday === 0;
        const isSaturday = weekday === 6;
        const events = eventsByDate.get(dateKey) ?? [];

        return (
          <div key={dateKey} className="rounded-xl border border-border/70 bg-card/70 p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2"
              onClick={() => onSelectDate(date)}
            >
              <div className="text-left">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isSunday && "text-[hsl(var(--weekend-sun))]",
                    isSaturday && "text-[hsl(var(--weekend-sat))]"
                  )}
                >
                  {getWeekdayLabel(date)} · {dateKey}
                </p>
                <p className="text-xs text-muted-foreground">Âm lịch: {formatLunarFull(date)}</p>
              </div>
              <span className="text-xs text-muted-foreground">{events.length} events</span>
            </button>
            <div className="mt-3 space-y-2">
              {events.map((eventItem) => (
                <div key={eventItem.id} className="flex items-center justify-between gap-2">
                  <EventChip event={eventItem} onClick={() => onSelectEvent(eventItem)} className="flex-1" />
                  <span className="text-[11px] text-muted-foreground">
                    {eventItem.startTime} - {eventItem.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
