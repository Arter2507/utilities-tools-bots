import type { CalendarEvent } from "../types";
import { DayCell } from "./DayCell";
import { getLunarLabel } from "../utils/lunar";
import { toDateKey, isSameDay } from "../utils/date";

interface CalendarGridProps {
  dates: Date[];
  currentMonth: number;
  eventsByDate: Map<string, CalendarEvent[]>;
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function CalendarGrid({
  dates,
  currentMonth,
  eventsByDate,
  onSelectDate,
  onSelectEvent,
}: CalendarGridProps) {
  const today = new Date();

  return (
    <div className="grid grid-cols-7 gap-0 overflow-hidden rounded-xl border border-border/70">
      {dates.map((date) => {
        const key = toDateKey(date);
        const events = eventsByDate.get(key) ?? [];
        return (
          <DayCell
            key={key}
            date={date}
            isCurrentMonth={date.getMonth() === currentMonth}
            isToday={isSameDay(date, today)}
            lunarLabel={getLunarLabel(date)}
            events={events}
            onSelectDate={onSelectDate}
            onSelectEvent={onSelectEvent}
          />
        );
      })}
    </div>
  );
}
