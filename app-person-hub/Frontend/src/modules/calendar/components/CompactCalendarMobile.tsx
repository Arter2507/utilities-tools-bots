import type { CalendarEvent } from "../types";
import { cn } from "@/lib/utils";
import { getLunarLabel } from "../utils/lunar";
import { isSameDay, toDateKey } from "../utils/date";

interface CompactCalendarMobileProps {
  dates: Date[];
  currentMonth: number;
  eventsByDate: Map<string, CalendarEvent[]>;
  onSelectDate: (date: Date) => void;
}

export function CompactCalendarMobile({
  dates,
  currentMonth,
  eventsByDate,
  onSelectDate,
}: CompactCalendarMobileProps) {
  const today = new Date();

  return (
    <div className="grid grid-cols-7 gap-1">
      {dates.map((date) => {
        const key = toDateKey(date);
        const events = eventsByDate.get(key) ?? [];
        const isCurrentMonth = date.getMonth() === currentMonth;
        const isToday = isSameDay(date, today);
        const weekday = date.getDay();
        const isSunday = weekday === 0;
        const isSaturday = weekday === 6;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectDate(date)}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border border-border/60 px-1 py-2 text-[11px]",
              "transition-colors hover:bg-card",
              isCurrentMonth ? "bg-card/60" : "bg-card/30 text-muted-foreground",
              isToday && "border-primary/70 bg-primary/10"
            )}
          >
            <span
              className={cn(
                "font-semibold",
                isSunday && "text-[hsl(var(--weekend-sun))]",
                isSaturday && "text-[hsl(var(--weekend-sat))]"
              )}
            >
              {date.getDate()}
            </span>
            <span className="text-[9px] text-muted-foreground">{getLunarLabel(date)}</span>
            {events.length > 0 && (
              <span className="mt-1 text-[9px] font-semibold text-primary">{events.length}•</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
