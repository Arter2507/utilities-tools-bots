import { useEffect, useState } from "react";
import type { FinanceTransaction, FinanceType } from "@/store/finance";
import { BaseModal } from "@/components/shared/BaseModal";
import { sanitizeText } from "@/lib/sanitize";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Omit<FinanceTransaction, "id" | "createdAt">) => void;
}

const categories = ["Income", "Food", "Health", "Transport", "Shopping", "Other"];

export function TransactionModal({ open, onClose, onSave }: TransactionModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<FinanceType>("expense");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory(categories[0]);
    setDate(new Date().toISOString().slice(0, 10));
    setError("");
  }, [open]);

  if (!open) return null;

  return (
    <BaseModal
      open={open}
      title="Quick Add Transaction"
      description="Log income or expense in seconds."
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
              const amountValue = Number(amount);
              if (!Number.isFinite(amountValue) || amountValue <= 0) {
                setError("Amount must be greater than 0.");
                return;
              }
              onSave({
                title: sanitizeText(title),
                amount: amountValue,
                type,
                category: sanitizeText(category),
                date,
              });
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
              placeholder="E.g. Grocery"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Amount</label>
              <input
                value={amount}
                onChange={(eventInput) => {
                  const sanitized = eventInput.target.value.replace(/[^0-9.]/g, "");
                  setAmount(sanitized);
                }}
                inputMode="decimal"
                placeholder="0.00"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Type</label>
              <select
                value={type}
                onChange={(eventInput) => setType(eventInput.target.value as FinanceType)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={(eventInput) => setCategory(eventInput.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
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

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    </BaseModal>
  );
}
