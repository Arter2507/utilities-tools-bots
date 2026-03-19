import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Plus, Wallet } from "lucide-react";
import { WidgetCard } from "./WidgetCard";
import { useFinance } from "@/store/finance";
import { TransactionModal } from "@/modules/finance/components/TransactionModal";

export function FinanceWidget() {
  const transactions = useFinance((state) => state.transactions);
  const createTransaction = useFinance((state) => state.createTransaction);
  const [modalOpen, setModalOpen] = useState(false);

  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, txn) => {
      return txn.type === "income" ? acc + txn.amount : acc - txn.amount;
    }, 0);
  }, [transactions]);

  const recent = useMemo(() => {
    return [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  }, [transactions]);

  return (
    <WidgetCard
      title="Finance"
      icon={<Wallet size={20} />}
      action={(
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus size={14} /> Quick add
        </button>
      )}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold">${totalBalance.toLocaleString()}</h2>
            <span className="flex items-center text-sm text-green-500 font-medium pb-1">
              <ArrowUpRight size={16} />
              5.2%
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Transactions</p>
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          )}
          {recent.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${tx.type === "income" ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                  {tx.type === "income" ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.title}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.type === "income" ? 'text-green-500' : ''}`}>
                {tx.type === "income" ? '+' : '-'}${tx.amount.toFixed(2)}
              </span>
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
    </WidgetCard>
  );
}
