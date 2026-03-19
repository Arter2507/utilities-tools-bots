import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type TimeMode = "12h" | "24h";

interface TimeValue {
  hour: string;
  minute: string;
  period?: "AM" | "PM";
}

interface TimeInputProps {
  label: string;
  value: string; // HH:mm
  mode: TimeMode;
  onChange: (next: string) => void;
  className?: string;
}

function parseTime(value: string) {
  const [h, m] = value.split(":").map((part) => Number(part));
  const hour = Number.isFinite(h) ? h : 0;
  const minute = Number.isFinite(m) ? m : 0;
  return { hour, minute };
}

function to12h(hour24: number) {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period } as const;
}

function to24h(hour12: number, period: "AM" | "PM") {
  if (period === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

function sanitizeNumber(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

export function TimeInput({ label, value, mode, onChange, className }: TimeInputProps) {
  const [time, setTime] = useState<TimeValue>({ hour: "", minute: "", period: "AM" });
  const [error, setError] = useState("");

  useEffect(() => {
    const { hour, minute } = parseTime(value);
    if (mode === "24h") {
      setTime({ hour: pad2(hour), minute: pad2(minute) });
    } else {
      const { hour12, period } = to12h(hour);
      setTime({ hour: String(hour12), minute: pad2(minute), period });
    }
    setError("");
  }, [value, mode]);

  const maxHour = mode === "24h" ? 23 : 12;
  const minHour = mode === "24h" ? 0 : 1;

  const isValid = useMemo(() => {
    if (!time.hour || !time.minute) return false;
    const hourNum = Number(time.hour);
    const minuteNum = Number(time.minute);
    if (!Number.isFinite(hourNum) || !Number.isFinite(minuteNum)) return false;
    if (hourNum < minHour || hourNum > maxHour) return false;
    if (minuteNum < 0 || minuteNum > 59) return false;
    return true;
  }, [time, minHour, maxHour]);

  const commit = (next: TimeValue) => {
    const hourNum = Number(next.hour);
    const minuteNum = Number(next.minute);
    if (!Number.isFinite(hourNum) || !Number.isFinite(minuteNum)) return;
    const hour24 = mode === "24h"
      ? hourNum
      : to24h(hourNum, (next.period ?? "AM") as "AM" | "PM");
    onChange(`${pad2(hour24)}:${pad2(minuteNum)}`);
  };

  const maybeCommit = (next: TimeValue) => {
    if (next.hour.length < 1 || next.minute.length < 1) return;
    const hourNum = Number(next.hour);
    const minuteNum = Number(next.minute);
    if (!Number.isFinite(hourNum) || !Number.isFinite(minuteNum)) return;
    if (hourNum < minHour || hourNum > maxHour) return;
    if (minuteNum < 0 || minuteNum > 59) return;
    commit(next);
  };

  const handleBlur = () => {
    if (!isValid) {
      setError("Giờ/phút không hợp lệ.");
      return;
    }
    setError("");
    commit(time);
  };

  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <input
          value={time.hour}
          onChange={(eventInput) => {
            const next = sanitizeNumber(eventInput.target.value).slice(0, 2);
            setTime((prev) => {
              const updated = { ...prev, hour: next };
              maybeCommit(updated);
              return updated;
            });
          }}
          onBlur={handleBlur}
          inputMode="numeric"
          placeholder={mode === "24h" ? "00" : "12"}
          className="w-14 rounded-lg border border-border bg-background px-2 py-2 text-center text-sm outline-none focus:border-primary"
        />
        <span className="text-sm text-muted-foreground">:</span>
        <input
          value={time.minute}
          onChange={(eventInput) => {
            const next = sanitizeNumber(eventInput.target.value).slice(0, 2);
            setTime((prev) => {
              const updated = { ...prev, minute: next };
              maybeCommit(updated);
              return updated;
            });
          }}
          onBlur={handleBlur}
          inputMode="numeric"
          placeholder="00"
          className="w-14 rounded-lg border border-border bg-background px-2 py-2 text-center text-sm outline-none focus:border-primary"
        />
        {mode === "12h" && (
          <select
            value={time.period}
            onChange={(eventInput) => {
              const nextPeriod = eventInput.target.value as "AM" | "PM";
              setTime((prev) => ({ ...prev, period: nextPeriod }));
              if (isValid) {
                commit({ ...time, period: nextPeriod });
              }
            }}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        )}
      </div>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
