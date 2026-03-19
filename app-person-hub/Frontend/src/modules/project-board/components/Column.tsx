import { useMemo } from "react";
import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { ProjectTask } from "@/store/tasks";
import { cn } from "@/lib/utils";

interface ColumnProps {
  title: string;
  columnId: ProjectTask["column"];
  tasks: ProjectTask[];
  children: ReactNode;
  className?: string;
}

export function Column({ title, columnId, tasks, children, className }: ColumnProps) {
  const countLabel = useMemo(() => `${tasks.length} tasks`, [tasks.length]);
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-w-[260px] flex-1 flex-col gap-3 rounded-2xl border border-border/70 bg-card/60 p-4",
        isOver && "border-primary/60 bg-primary/5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          {countLabel}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}
