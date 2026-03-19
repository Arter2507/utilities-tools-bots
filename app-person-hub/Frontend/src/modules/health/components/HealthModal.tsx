import { useEffect, useState } from "react";
import type { HealthCycle, HealthLog } from "@/store/health";
import { BaseModal } from "@/components/shared/BaseModal";
import { sanitizeText } from "@/lib/sanitize";

interface HealthModalProps {
  open: boolean;
  onClose: () => void;
  onSaveCycle: (payload: Omit<HealthCycle, "id" | "createdAt">) => void;
  onSaveLog: (payload: Omit<HealthLog, "id" | "createdAt">) => void;
}

export function HealthModal({ open, onClose, onSaveCycle, onSaveLog }: HealthModalProps) {
  const [tab, setTab] = useState<"cycle" | "log">("cycle");
  const [startDate, setStartDate] = useState("");
  const [lengthDays, setLengthDays] = useState("5");
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [mood, setMood] = useState("3");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTab("cycle");
    setStartDate(new Date().toISOString().slice(0, 10));
    setLengthDays("5");
    setDate(new Date().toISOString().slice(0, 10));
    setWeight("");
    setMood("3");
    setNote("");
    setError("");
  }, [open]);

  if (!open) return null;

  return (
    <BaseModal
      open={open}
      title="Quick Add Health"
      description="Track cycle and daily wellness."
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
              if (tab === "cycle") {
                const lengthValue = Number(lengthDays);
                if (!startDate) {
                  setError("Start date is required.");
                  return;
                }
                if (!Number.isFinite(lengthValue) || lengthValue <= 0) {
                  setError("Length must be greater than 0.");
                  return;
                }
                onSaveCycle({ startDate, lengthDays: lengthValue });
              } else {
                const weightValue = Number(weight);
                const moodValue = Number(mood);
                if (!date) {
                  setError("Date is required.");
                  return;
                }
                if (!Number.isFinite(weightValue) || weightValue <= 0) {
                  setError("Weight must be greater than 0.");
                  return;
                }
                if (!Number.isFinite(moodValue) || moodValue < 1 || moodValue > 5) {
                  setError("Mood must be between 1 and 5.");
                  return;
                }
                onSaveLog({ date, weight: weightValue, mood: moodValue, note: sanitizeText(note) });
              }
              onClose();
            }}
          >
            Save
          </button>
        </div>
      )}
    >
      <div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/70 p-1 text-xs">
            <button
              type="button"
              onClick={() => setTab("cycle")}
              className={`rounded-full px-3 py-1 ${tab === "cycle" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Cycle
            </button>
            <button
              type="button"
              onClick={() => setTab("log")}
              className={`rounded-full px-3 py-1 ${tab === "log" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Daily Log
            </button>
          </div>

          {tab === "cycle" ? (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(eventInput) => setStartDate(eventInput.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Length (days)</label>
                <input
                  value={lengthDays}
                  onChange={(eventInput) => setLengthDays(eventInput.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(eventInput) => setDate(eventInput.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Weight (kg)</label>
                  <input
                    value={weight}
                    onChange={(eventInput) => setWeight(eventInput.target.value.replace(/[^0-9.]/g, ""))}
                    inputMode="decimal"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Mood (1-5)</label>
                  <input
                    value={mood}
                    onChange={(eventInput) => setMood(eventInput.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Note</label>
                <input
                  value={note}
                  onChange={(eventInput) => setNote(eventInput.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
    </BaseModal>
  );
}
