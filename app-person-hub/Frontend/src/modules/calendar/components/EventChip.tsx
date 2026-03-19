import type { CalendarEvent } from "../types";
import { cn } from "@/lib/utils";

interface EventChipProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  className?: string;
}

function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized.length === 3
    ? sanitized.split("").map((c) => c + c).join("")
    : sanitized,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function EventChip({ event, onClick, className }: EventChipProps) {
  return (
    <button
      type="button"
      onClick={(mouseEvent) => {
        mouseEvent.stopPropagation();
        onClick?.(event);
      }}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer",
        "hover:opacity-90",
        className
      )}
      style={{
        border: `1px solid ${event.color}`,
        backgroundColor: hexToRgba(event.color, 0.16),
        color: event.color,
      }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: event.color }} />
      <span className="truncate">{event.title}</span>
    </button>
  );
}
