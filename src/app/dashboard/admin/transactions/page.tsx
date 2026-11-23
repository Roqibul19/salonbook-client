"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Receipt } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/constants";
import type { Transaction } from "@/types";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import StatCard from "@/components/dashboard/StatCard";
import Avatar from "@/components/Avatar";

// "cs_test_a1B2c3...XyZ" -> "cs_test_a1B2…XyZ9"
function shortRef(id: string) {
  return id.length > 20 ? `${id.slice(0, 12)}…${id.slice(-6)}` : id;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Transaction[]>("/admin/transactions", { auth: true })
      .then(setTransactions)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPaid = useMemo(
    () => transactions.filter((t) => t.status === "paid").reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const copy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Session ID copied"))
      .catch(() => toast.error("Could not copy"));
  };

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Payments recorded from verified Stripe webhook events. These records are read-only."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Successful Payments" value={transactions.filter((t) => t.status === "paid").length} icon={Receipt} tone="green" loading={loading} />
        <StatCard label="Total Revenue" value={`$${totalPaid.toFixed(2)}`} icon={Receipt} loading={loading} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center text-muted">No transactions yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line bg-cream text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Appointment</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Stripe Session</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={t.customer?.name} image={t.customer?.image} size={32} />
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{t.customer?.name || "Deleted user"}</p>
                        <p className="text-xs text-muted">{t.customer?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink">{t.appointment?.serviceName || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {t.appointment ? (
                      <>
                        <p className="text-ink">{formatDate(t.appointment.appointmentDate)}</p>
                        <p className="text-xs text-muted">{t.appointment.timeSlot}</p>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">
                    ${t.amount.toFixed(2)} <span className="text-xs font-normal uppercase text-muted">{t.currency}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copy(t.stripeSessionId)}
                      className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 font-mono text-xs text-ink hover:bg-brand-50"
                      title={t.stripeSessionId}
                    >
                      {shortRef(t.stripeSessionId)} <Copy className="h-3 w-3 text-muted" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
