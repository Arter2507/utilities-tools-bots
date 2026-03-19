import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HeartPulse, Plus } from "lucide-react";
import { useHealth } from "@/store/health";
import { HealthModal } from "./components/HealthModal";
import { getMonthGrid } from "@/modules/calendar/utils/date";
import { cn } from "@/lib/utils";

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HealthTracker() {
  const cycles = useHealth((state) => state.cycles);
  const logs = useHealth((state) => state.logs);
  const createCycle = useHealth((state) => state.createCycle);
  const createLog = useHealth((state) => state.createLog);
  const cycleLength = useHealth((state) => state.cycleLength);
  const setCycleLength = useHealth((state) => state.setCycleLength);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());

  const latestCycle = useMemo(() => {
    return [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
  }, [cycles]);

  const cycleDates = useMemo(() => {
    if (!latestCycle) return new Set<string>();
    const dates = new Set<string>();
    const start = new Date(latestCycle.startDate);
    for (let i = 0; i < latestCycle.lengthDays; i += 1) {
      const next = new Date(start);
      next.setDate(start.getDate() + i);
      dates.add(next.toISOString().slice(0, 10));
    }
    return dates;
  }, [latestCycle]);

  const predictedDates = useMemo(() => {
    if (!latestCycle) return new Set<string>();
    const dates = new Set<string>();
    const start = new Date(latestCycle.startDate);
    start.setDate(start.getDate() + cycleLength);
    for (let i = 0; i < latestCycle.lengthDays; i += 1) {
      const next = new Date(start);
      next.setDate(start.getDate() + i);
      dates.add(next.toISOString().slice(0, 10));
    }
    return dates;
  }, [latestCycle, cycleLength]);

  const gridDates = useMemo(() => getMonthGrid(viewDate), [viewDate]);

  const chartData = useMemo(() => {
    return [...logs]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((log) => ({
        date: formatDateLabel(log.date),
        weight: log.weight,
        mood: log.mood,
      }));
  }, [logs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HeartPulse className="h-4 w-4" />
            <span>Health Tracker</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Cycle & Wellness</h1>
          <p className="text-muted-foreground">Track your cycle, weight, and mood with quick inputs.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Quick add
        </button>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Cycle Calendar</h3>
            <p className="text-xs text-muted-foreground">Current and predicted cycle</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs">
              <span className="text-muted-foreground">Cycle</span>
              <input
                value={cycleLength}
                onChange={(eventInput) => {
                  const next = Number(eventInput.target.value.replace(/[^0-9]/g, ""));
                  if (!Number.isFinite(next)) return;
                  setCycleLength(Math.max(20, Math.min(next, 40)));
                }}
                inputMode="numeric"
                className="w-10 bg-transparent text-xs font-semibold outline-none"
              />
              <span className="text-muted-foreground">days</span>
            </div>
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-muted-foreground">
          {gridDates.map((date) => {
            const key = date.toISOString().slice(0, 10);
            const isCurrentMonth = date.getMonth() === viewDate.getMonth();
            const isCycle = cycleDates.has(key);
            const isPredicted = predictedDates.has(key);
            return (
              <div
                key={key}
                className={cn(
                  "flex h-10 items-center justify-center rounded-lg border border-border/60 text-sm",
                  isCurrentMonth ? "bg-background/70" : "bg-background/30 text-muted-foreground",
                  isCycle && "border-pink-500/60 bg-pink-500/15 text-pink-600",
                  isPredicted && !isCycle && "border-blue-400/50 bg-blue-400/10 text-blue-400"
                )}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <h3 className="text-sm font-semibold">Weight & Mood</h3>
        <p className="text-xs text-muted-foreground">Track your daily changes</p>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="weight" stroke="#60a5fa" fill="#60a5fa33" strokeWidth={2} />
              <Area type="monotone" dataKey="mood" stroke="#f472b6" fill="#f472b633" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <HealthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveCycle={(payload) => createCycle(payload)}
        onSaveLog={(payload) => createLog(payload)}
      />
    </div>
  );
}
