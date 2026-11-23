"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/constants";
import type { Transaction } from "@/types";
import StatusBadge from "./StatusBadge";

// the logged-in customer's own payment history
export default function PaymentHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Transaction[]>("/payments/my", { auth: true })
      .then(setTransactions)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mt-8 rounded-2xl border border-line bg-white">
      <div className="border-b border-line p-5">
        <h2 className="text-lg font-semibold text-ink">Payment History</h2>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-brand-50" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted">No payments yet. Confirmed appointments can be paid from My Appointments.</p>
      ) : (
        <ul className="divide-y divide-line">
          {transactions.map((t) => (
            <li key={t._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="font-medium text-ink">{t.appointment?.serviceName || "Salon appointment"}</p>
                <p className="text-sm text-muted">
                  Paid on {formatDate(t.createdAt)}
                  {t.appointment && ` · for ${formatDate(t.appointment.appointmentDate)}, ${t.appointment.timeSlot}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-ink">${t.amount.toFixed(2)}</span>
                <StatusBadge status={t.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
