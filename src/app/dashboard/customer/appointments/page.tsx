/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CreditCard, Eye, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/constants";
import type { Appointment } from "@/types";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import AppointmentDetails from "@/components/dashboard/AppointmentDetails";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const loadAppointments = useCallback(() => {
    return api<Appointment[]>("/appointments/my", { auth: true })
      .then(setAppointments)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCancel = async () => {
    if (!cancelling) return;
    setCancelLoading(true);
    try {
      await api(`/appointments/${cancelling._id}/cancel`, { method: "PATCH", auth: true });
      toast.success("Appointment cancelled");
      setCancelling(null);
      await loadAppointments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel appointment");
    } finally {
      setCancelLoading(false);
    }
  };

  const handlePay = async (appointment: Appointment) => {
    setPayingId(appointment._id);
    // Stripe Checkout is connected in the payment step
    toast.info("Online payment is coming soon.");
    setPayingId(null);
  };

  const actions = (a: Appointment) => (
    <div className="flex flex-wrap justify-end gap-2 whitespace-nowrap">
      <button
        onClick={() => setViewing(a)}
        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-brand-50"
      >
        <Eye className="h-3.5 w-3.5" /> View
      </button>
      {a.status === "pending" && (
        <button
          onClick={() => setCancelling(a)}
          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      )}
      {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
        <button
          onClick={() => handlePay(a)}
          disabled={payingId === a._id}
          className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {payingId === a._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
          Pay Now
        </button>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title="My Appointments" description="Track, cancel or pay for your appointment requests." />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center">
          <p className="text-muted">You haven&apos;t requested any appointments yet.</p>
          <Link href="/services" className="btn-primary mt-4">
            Browse Services
          </Link>
        </div>
      ) : (
        <>
          {/* table for large screens */}
          <div className="hidden overflow-x-auto rounded-2xl border border-line bg-white xl:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-cream text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-3">Service</th>
                  <th className="px-3 py-3">Date & Time</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Status / Payment</th>
                  <th className="px-3 py-3">Requested</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {appointments.map((a) => (
                  <tr key={a._id} className="align-middle">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        {a.service?.image && (
                          <img src={a.service.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{a.service?.serviceName || "Deleted service"}</p>
                          <p className="text-xs text-muted">{a.service?.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <p className="text-ink">{formatDate(a.appointmentDate)}</p>
                      <p className="text-xs text-muted">{a.timeSlot}</p>
                    </td>
                    <td className="px-3 py-3 font-medium text-ink">${a.servicePrice}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={a.status} />
                        <StatusBadge status={a.paymentStatus} />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted">{formatDate(a.createdAt)}</td>
                    <td className="px-3 py-3">{actions(a)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* cards for mobile and tablets */}
          <ul className="grid gap-3 md:grid-cols-2 xl:hidden">
            {appointments.map((a) => (
              <li key={a._id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-center gap-3">
                  {a.service?.image && <img src={a.service.image} alt="" className="h-14 w-14 rounded-xl object-cover" />}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{a.service?.serviceName || "Deleted service"}</p>
                    <p className="text-xs text-muted">{a.service?.category}</p>
                  </div>
                  <span className="ml-auto font-semibold text-brand-600">${a.servicePrice}</span>
                </div>
                <p className="mt-3 text-sm text-ink">
                  {formatDate(a.appointmentDate)} · {a.timeSlot}
                </p>
                <p className="text-xs text-muted">Requested {formatDate(a.createdAt)}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <StatusBadge status={a.status} />
                    <StatusBadge status={a.paymentStatus} />
                  </div>
                  {actions(a)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Appointment Details">
        {viewing && <AppointmentDetails appointment={viewing} />}
      </Modal>

      <ConfirmDialog
        open={Boolean(cancelling)}
        title="Cancel this appointment?"
        message={`Your ${cancelling?.service?.serviceName || ""} request on ${
          cancelling ? formatDate(cancelling.appointmentDate) : ""
        } at ${cancelling?.timeSlot || ""} will be cancelled. This cannot be undone.`}
        confirmLabel="Yes, cancel it"
        danger
        loading={cancelLoading}
        onConfirm={handleCancel}
        onClose={() => setCancelling(null)}
      />
    </div>
  );
}
