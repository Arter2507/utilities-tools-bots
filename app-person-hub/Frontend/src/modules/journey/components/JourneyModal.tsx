import { useEffect, useRef, useState } from "react";
import type { JourneyEntry } from "@/store/journey";
import { BaseModal } from "@/components/shared/BaseModal";
import { sanitizeMultiline, sanitizeText, sanitizeUrl } from "@/lib/sanitize";

interface JourneyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Omit<JourneyEntry, "id" | "createdAt">) => void;
}

export function JourneyModal({ open, onClose, onSave }: JourneyModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setDate(new Date().toISOString().slice(0, 10));
    setContent("");
    setImageUrl("");
    setError("");
  }, [open]);

  const wrapSelection = (wrapper: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = content.slice(start, end);
    const next = content.slice(0, start) + wrapper + selected + wrapper + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + wrapper.length, end + wrapper.length);
    });
  };

  if (!open) return null;

  return (
    <BaseModal
      open={open}
      title="New Journey Entry"
      description="Capture your thoughts with simple rich text."
      onClose={onClose}
      maxWidthClassName="max-w-2xl"
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
              if (!title.trim() || !content.trim()) {
                setError("Title and content are required.");
                return;
              }
              onSave({
                title: sanitizeText(title),
                content: sanitizeMultiline(content),
                date,
                imageUrl: sanitizeUrl(imageUrl),
              });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      )}
    >
      <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Rich text</label>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <button type="button" onClick={() => wrapSelection("**")} className="rounded-md border border-border px-2 py-1">
                Bold
              </button>
              <button type="button" onClick={() => wrapSelection("_")} className="rounded-md border border-border px-2 py-1">
                Italic
              </button>
              <span>Use **bold** or _italic_</span>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(eventInput) => setContent(eventInput.target.value)}
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Image URL (mock)</label>
            <input
              value={imageUrl}
              onChange={(eventInput) => setImageUrl(eventInput.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    </BaseModal>
  );
}
