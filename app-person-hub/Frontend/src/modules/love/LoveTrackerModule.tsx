import { useMemo, useState } from "react";
import { Heart, Plus, Sparkles } from "lucide-react";
import { useLove } from "@/store/love";
import { LoveModal } from "./components/LoveModal";

function daysBetween(start: string, end: Date) {
  const startDate = new Date(start);
  const diff = end.getTime() - startDate.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default function LoveTrackerModule() {
  const loveData = useLove((state) => state.loveData);
  const createLoveAnniversary = useLove((state) => state.createLoveAnniversary);
  const updateLoveStartDate = useLove((state) => state.updateLoveStartDate);
  const [modalOpen, setModalOpen] = useState(false);

  const totalDays = useMemo(() => daysBetween(loveData.startDate, new Date()), [loveData.startDate]);
  const anniversaries = useMemo(() => {
    return [...loveData.anniversaries].sort((a, b) => b.date.localeCompare(a.date));
  }, [loveData.anniversaries]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-pink-500" />
            <span>Love Tracker</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Your Love Story</h1>
          <p className="text-muted-foreground">Celebrate milestones with a gentle pastel glow.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add anniversary
        </button>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-pink-300/40 bg-gradient-to-br from-pink-200/40 via-rose-100/50 to-orange-100/40 p-8">
        <div className="absolute right-6 top-6 text-pink-400/40">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-500/80">Days Together</p>
        <div className="mt-2 text-5xl font-black text-pink-600 drop-shadow-sm">{totalDays}</div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-pink-500">
          <label className="text-xs font-semibold text-pink-500/80">Start date</label>
          <input
            type="date"
            value={loveData.startDate}
            onChange={(eventInput) => updateLoveStartDate(eventInput.target.value)}
            className="rounded-lg border border-pink-300/60 bg-white/70 px-3 py-2 text-sm outline-none focus:border-pink-400"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Anniversaries</h3>
          <span className="text-xs text-muted-foreground">{anniversaries.length} items</span>
        </div>
        <div className="mt-4 space-y-3">
          {anniversaries.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 px-3 py-2">
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.note ?? ""}</span>
            </div>
          ))}
          {anniversaries.length === 0 && (
            <p className="text-sm text-muted-foreground">No anniversaries yet.</p>
          )}
        </div>
      </div>

      <LoveModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) => createLoveAnniversary(payload)}
      />
    </div>
  );
}
