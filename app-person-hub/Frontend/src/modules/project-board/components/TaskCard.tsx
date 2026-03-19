import type { ProjectTask } from "@/store/tasks";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: ProjectTask;
  onClick?: (task: ProjectTask) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(task)}
      className={cn(
        "w-full rounded-xl border border-border/70 bg-card/80 p-3 text-left shadow-sm",
        "transition-colors hover:border-primary/40 hover:bg-card"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{task.title}</span>
        {task.dueDate && (
          <span className="text-[11px] font-medium text-muted-foreground">{task.dueDate}</span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: task.tagColor }} />
        <span className="text-xs text-muted-foreground">Tag</span>
      </div>
    </button>
  );
}
