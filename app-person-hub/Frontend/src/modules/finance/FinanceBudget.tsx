import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CreditCard, Plus } from "lucide-react";
import { useFinance } from "@/store/finance";
import { TransactionModal } from "./components/TransactionModal";

function formatDateLabel(date: string) {
  const parsed = new Date(date);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function FinanceBudget() {
  const transactions = useFinance((state) => state.transactions);
  const createTransaction = useFinance((state) => state.createTransaction);
  const [modalOpen, setModalOpen] = useState(false);
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const months = useMemo(() => {
    const unique = new Set(transactions.map((item) => item.date.slice(0, 7)));
    return ["all", ...Array.from(unique).sort((a, b) => b.localeCompare(a))];
  }, [transactions]);

  const categories = useMemo(() => {
    const unique = new Set(transactions.map((item) => item.category));
    return ["all", ...Array.from(unique)];
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((item) => {
      if (monthFilter !== "all" && !item.date.startsWith(monthFilter)) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      return true;
    });
  }, [transactions, monthFilter, categoryFilter]);

  const summary = useMemo(() => {
    return filtered.reduce(
      (acc, item) => {
        if (item.type === "income") acc.income += item.amount;
        else acc.expense += item.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [filtered]);

  const chartData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    filtered.forEach((item) => {
      const key = item.date;
      const current = map.get(key) ?? { income: 0, expense: 0 };
      if (item.type === "income") current.income += item.amount;
      else current.expense += item.amount;
      map.set(key, current);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, value]) => ({
        date: formatDateLabel(date),
        income: value.income,
        expense: value.expense,
      }));
  }, [filtered]);

  const recent = useMemo(() => {
    return [...filtered]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6);
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Finance Budget</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Cashflow Overview</h1>
          <p className="text-muted-foreground">Log transactions quickly and keep your budget tidy.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Quick add
        </button>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Summary</h3>
            <p className="text-xs text-muted-foreground">Filter by month or category</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={monthFilter}
              onChange={(eventInput) => setMonthFilter(eventInput.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month === "all" ? "All months" : month}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(eventInput) => setCategoryFilter(eventInput.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-background/60 p-3">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-lg font-semibold text-green-500">+${summary.income.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 p-3">
            <p className="text-xs text-muted-foreground">Expense</p>
            <p className="text-lg font-semibold text-orange-500">-${summary.expense.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 p-3">
            <p className="text-xs text-muted-foreground">Net</p>
            <p className="text-lg font-semibold">${(summary.income - summary.expense).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <h3 className="text-sm font-semibold">Income vs Expense</h3>
        <p className="text-xs text-muted-foreground">Filtered view</p>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="income" stroke="#34d399" fill="#34d39933" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#f97316" fill="#f9731633" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent Transactions</h3>
          <span className="text-xs text-muted-foreground">{recent.length} items</span>
        </div>
        <div className="mt-4 space-y-3">
          {recent.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2">
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.category} · {formatDateLabel(item.date)}</p>
              </div>
              <div className={`text-sm font-semibold ${item.type === "income" ? "text-green-500" : "text-orange-500"}`}>
                {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) => {
          createTransaction(payload);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
