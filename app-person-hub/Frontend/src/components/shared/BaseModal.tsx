import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
}

export function BaseModal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  maxWidthClassName,
}: BaseModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4">
      <div
        className={cn(
          "w-full rounded-2xl border border-border/70 bg-card p-6 shadow-xl",
          maxWidthClassName ?? "max-w-2xl"
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}
