import { createContext, useContextSelector } from "use-context-selector";
import { useEffect, useMemo, useState } from "react";
import { TransactionSchema, safeParseArray } from "./schemas";
import { useNotifications } from "./notifications";

export type FinanceType = "income" | "expense";

export interface FinanceTransaction {
  id: string;
  title: string;
  amount: number;
  type: FinanceType;
  category: string;
  date: string;
  createdAt: string;
}

interface FinanceContextValue {
  transactions: FinanceTransaction[];
  createTransaction: (payload: Omit<FinanceTransaction, "id" | "createdAt">) => void;
  deleteTransaction: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextValue>({} as FinanceContextValue);

const STORAGE_KEY = "finance_transactions_v1";

const defaultTransactions: FinanceTransaction[] = [
  {
    id: "txn-1",
    title: "Salary",
    amount: 4500,
    type: "income",
    category: "Income",
    date: "2026-03-01",
    createdAt: "2026-03-01T08:00:00.000Z",
  },
  {
    id: "txn-2",
    title: "Grocery",
    amount: 120,
    type: "expense",
    category: "Food",
    date: "2026-03-14",
    createdAt: "2026-03-14T10:00:00.000Z",
  },
  {
    id: "txn-3",
    title: "Gym Membership",
    amount: 45,
    type: "expense",
    category: "Health",
    date: "2026-03-12",
    createdAt: "2026-03-12T09:30:00.000Z",
  },
];

function readTransactions(): FinanceTransaction[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = safeParseArray(TransactionSchema, parsed);
    return list.map((txn) => ({
      ...txn,
      createdAt: txn.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function writeTransactions(items: FinanceTransaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const addNotification = useNotifications((state) => state.addNotification);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);

  useEffect(() => {
    const stored = readTransactions();
    if (stored.length > 0) {
      setTransactions(stored);
    } else {
      setTransactions(defaultTransactions);
      writeTransactions(defaultTransactions);
    }
  }, []);

  const createTransaction = (payload: Omit<FinanceTransaction, "id" | "createdAt">) => {
    const created: FinanceTransaction = {
      ...payload,
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => {
      const next = [created, ...prev];
      writeTransactions(next);
      return next;
    });
    addNotification("Finance updated", `${created.title} · ${created.type}`);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => {
      const next = prev.filter((txn) => txn.id !== id);
      writeTransactions(next);
      return next;
    });
  };

  const value = useMemo(
    () => ({ transactions, createTransaction, deleteTransaction }),
    [transactions]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance<T>(selector: (value: FinanceContextValue) => T) {
  return useContextSelector(FinanceContext, selector);
}
