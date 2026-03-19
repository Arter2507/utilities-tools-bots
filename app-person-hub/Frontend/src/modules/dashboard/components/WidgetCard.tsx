import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WidgetCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function WidgetCard({ title, icon, children, className, action }: WidgetCardProps) {
  return (
    <div className={cn("bg-card text-card-foreground rounded-xl border border-border shadow-sm flex flex-col overflow-hidden", className)}>
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <h3 className="font-semibold">{title}</h3>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  );
}
