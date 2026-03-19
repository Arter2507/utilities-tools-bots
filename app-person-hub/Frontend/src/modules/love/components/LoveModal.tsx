import { useEffect, useState } from "react";
import type { LoveAnniversary } from "@/store/love";
import { BaseModal } from "@/components/shared/BaseModal";
import { sanitizeText } from "@/lib/sanitize";

interface LoveModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Omit<LoveAnniversary, "id" | "createdAt">) => void;
}

export function LoveModal({ open, onClose, onSave }: LoveModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setDate(new Date().toISOString().slice(0, 10));
    setNote("");
    setError("");
  }, [open]);

  if (!open) return null;

  return (
    <BaseModal
      open={open}
      title="Add Anniversary"
      description="Keep your special moments in one place."
      onClose={onClose}
      maxWidthClassName="max-w-xl"
      footer={(
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
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
              onSave({ title: sanitizeText(title), date, note: sanitizeText(note) || undefined });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      )}
    >
      <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Title</label>
            <input
              value={title}
              onChange={(eventInput) => setTitle(eventInput.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Date</label>
            <input
              type="date"
              value={date}
              onChange={(eventInput) => setDate(eventInput.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Note</label>
            <input
              value={note}
              onChange={(eventInput) => setNote(eventInput.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    </BaseModal>
  );
}
