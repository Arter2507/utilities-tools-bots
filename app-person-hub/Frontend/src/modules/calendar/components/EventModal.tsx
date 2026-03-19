import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent, CalendarEventInput, EventPriority } from "../types";
import { EVENT_COLORS } from "../constants";
import { clampTimeRange, toDateKey } from "../utils/date";
import { TimeInput } from "./TimeInput";
import type { TimeMode } from "./TimeInput";
import { BaseModal } from "@/components/shared/BaseModal";
import { sanitizeMultiline, sanitizeText } from "@/lib/sanitize";

interface EventModalProps {
  open: boolean;
  date: Date;
  event?: CalendarEvent | null;
  onClose: () => void;
  onSave: (payload: CalendarEventInput) => void;
  onDelete?: (id: string) => void;
}

const defaultTimes = { startTime: "09:00", endTime: "10:00" };
const priorities: { label: string; value: EventPriority }[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export function EventModal({ open, date, event, onClose, onSave, onDelete }: EventModalProps) {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState(defaultTimes.startTime);
  const [endTime, setEndTime] = useState(defaultTimes.endTime);
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState(EVENT_COLORS[0].value);
  const [priority, setPriority] = useState<EventPriority>("medium");
  const [timeMode, setTimeMode] = useState<TimeMode>("24h");
  const [error, setError] = useState("");

  const isEditing = Boolean(event);

  useEffect(() => {
    if (!open) {
      return;
    }
    setTitle(event?.title ?? "");
    setEventDate(event?.date ?? toDateKey(date));
    setStartTime(event?.startTime ?? defaultTimes.startTime);
    setEndTime(event?.endTime ?? defaultTimes.endTime);
    setNotes(event?.notes ?? "");
    setColor(event?.color ?? EVENT_COLORS[0].value);
    setPriority(event?.priority ?? "medium");
    setTimeMode("24h");
    setError("");
  }, [open, date, event]);

  const isValidTime = (value: string) => {
    if (!/^\d{2}:\d{2}$/.test(value)) return false;
    const [h, m] = value.split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return false;
    if (h < 0 || h > 23) return false;
    if (m < 0 || m > 59) return false;
    return true;
  };

  const timeError = useMemo(() => {
    if (!startTime || !endTime) return "Vui lòng nhập thời gian hợp lệ.";
    if (!isValidTime(startTime) || !isValidTime(endTime)) return "Giờ/phút không hợp lệ.";
    return "";
  }, [startTime, endTime]);

  if (!open) {
    return null;
  }

  return (
    <BaseModal
      open={open}
      title={isEditing ? "Edit Event" : "New Event"}
      description="Plan your schedule with both solar and lunar dates."
      onClose={onClose}
      maxWidthClassName="max-w-2xl"
      footer={(
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {isEditing && event && onDelete && (
            <button
              type="button"
              className="rounded-lg border border-destructive/40 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(event.id)}
            >
              Delete
            </button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => {
                if (!title.trim()) {
                  setError("Title is required.");
                  return;
                }
                if (timeError) {
                  setError(timeError);
                  return;
                }
                const normalizedTime = clampTimeRange(startTime, endTime);
                const payload: CalendarEventInput = {
                  title: sanitizeText(title),
                  date: eventDate,
                  startTime: normalizedTime.start,
                  endTime: normalizedTime.end,
                  notes: sanitizeMultiline(notes),
                  color,
                  priority,
                  source: event?.source ?? "local",
                };
                onSave(payload);
              }}
            >
              {isEditing ? "Save Changes" : "Add Event"}
            </button>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Title</label>
            <input
              value={title}
              onChange={(eventInput) => setTitle(eventInput.target.value)}
              placeholder="Event title"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(eventInput) => setEventDate(eventInput.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Time Mode</label>
              <div className="flex items-center gap-2 rounded-full border border-border bg-background/70 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setTimeMode("24h")}
                  className={`rounded-full px-3 py-1 ${timeMode === "24h" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  24h
                </button>
                <button
                  type="button"
                  onClick={() => setTimeMode("12h")}
                  className={`rounded-full px-3 py-1 ${timeMode === "12h" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  12h
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <TimeInput
              label="Start"
              value={startTime}
              mode={timeMode}
              onChange={setStartTime}
            />
            <TimeInput
              label="End"
              value={endTime}
              mode={timeMode}
              onChange={setEndTime}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Notes</label>
            <textarea
              value={notes}
              onChange={(eventInput) => setNotes(eventInput.target.value)}
              placeholder="Notes, meeting link, location..."
              className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Priority</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {priorities.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      priority === option.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                    onClick={() => setPriority(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Color</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {EVENT_COLORS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs"
                    onClick={() => setColor(option.value)}
                    style={{
                      backgroundColor: option.value === color ? option.value : "transparent",
                      color: option.value === color ? "white" : "inherit",
                      borderColor: option.value,
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: option.value }}
                    />
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(error || timeError) && <p className="text-xs text-destructive">{error || timeError}</p>}
        </div>
    </BaseModal>
  );
}
