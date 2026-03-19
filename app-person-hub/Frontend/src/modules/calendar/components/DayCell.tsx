import type { CalendarEvent } from "../types";
import { cn } from "@/lib/utils";
import { EventChip } from "./EventChip";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  lunarLabel: string;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function DayCell({
  date,
  isCurrentMonth,
  isToday,
  lunarLabel,
  events,
  onSelectDate,
  onSelectEvent,
}: DayCellProps) {
  const weekday = date.getDay();
  const isSunday = weekday === 0;
  const isSaturday = weekday === 6;

  return (
    <div
      className={cn(
        "group relative flex min-h-[110px] flex-col border border-border/60 bg-card/70 p-2 transition-colors",
        "hover:bg-card",
        isCurrentMonth ? "" : "bg-card/40 text-muted-foreground"
      )}
      onClick={() => onSelectDate(date)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectDate(date);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span
            className={cn(
              "text-sm font-semibold",
              isSunday && "text-[hsl(var(--weekend-sun))]",
              isSaturday && "text-[hsl(var(--weekend-sat))]",
              isToday && "rounded-full bg-primary/15 px-2 text-primary"
            )}
          >
            {date.getDate()}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {lunarLabel}
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1">
        {events.slice(0, 3).map((eventItem) => (
          <EventChip
            key={eventItem.id}
            event={eventItem}
            onClick={() => onSelectEvent(eventItem)}
            className="w-full"
          />
        ))}
        {events.length > 3 && (
          <span className="text-[11px] text-muted-foreground">+{events.length - 3} more</span>
        )}
      </div>
    </div>
  );
}
