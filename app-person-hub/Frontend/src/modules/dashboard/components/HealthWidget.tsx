import { useMemo, useState } from "react";
import { Activity, Flame, HeartPulse, Moon, Droplet, Plus } from "lucide-react";
import { WidgetCard } from "./WidgetCard";
import { useHealth } from "@/store/health";
import { HealthModal } from "@/modules/health/components/HealthModal";

export function HealthWidget() {
  const logs = useHealth((state) => state.logs);
  const createCycle = useHealth((state) => state.createCycle);
  const createLog = useHealth((state) => state.createLog);
  const [modalOpen, setModalOpen] = useState(false);

  const latestLog = useMemo(() => {
    return [...logs].sort((a, b) => b.date.localeCompare(a.date))[0];
  }, [logs]);

  return (
    <WidgetCard
      title="Health Status"
      icon={<HeartPulse size={20} />}
      action={(
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus size={14} /> Quick add
        </button>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/30 p-3 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Activity size={16} />
            <span className="text-xs font-semibold uppercase">Steps</span>
          </div>
          <p className="text-xl font-bold">8,450</p>
        </div>
        
        <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <Flame size={16} />
            <span className="text-xs font-semibold uppercase">Calories</span>
          </div>
          <p className="text-xl font-bold">1,240 <span className="text-sm font-normal text-muted-foreground">kcal</span></p>
        </div>

        <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Droplet size={16} />
            <span className="text-xs font-semibold uppercase">Water</span>
          </div>
          <p className="text-xl font-bold">1.5 <span className="text-sm font-normal text-muted-foreground">L</span></p>
        </div>

        <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <Moon size={16} />
            <span className="text-xs font-semibold uppercase">Sleep</span>
          </div>
          <p className="text-xl font-bold">7.2 <span className="text-sm font-normal text-muted-foreground">hr</span></p>
        </div>
      </div>

      {latestLog && (
        <div className="mt-4 rounded-lg border border-border/60 bg-background/60 p-3">
          <p className="text-xs text-muted-foreground">Latest log</p>
          <p className="text-sm font-semibold">{latestLog.date} · {latestLog.weight}kg · Mood {latestLog.mood}</p>
        </div>
      )}

      <HealthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveCycle={(payload) => createCycle(payload)}
        onSaveLog={(payload) => createLog(payload)}
      />
    </WidgetCard>
  );
}
