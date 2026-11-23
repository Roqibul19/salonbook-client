"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Eye, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/constants";
import type { Appointment, AppointmentStatus } from "@/types";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import AppointmentDetails from "@/components/dashboard/AppointmentDetails";
import Avatar from "@/components/Avatar";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Filter = "all" | AppointmentStatus;
type PendingAction = { type: "confirm" | "cancel"; appointment: Appointment } | null;

const FILTERS: Filter[] = ["all", "pending", "confirmed", "cancelled"];

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [action, setAction] = useState<PendingAction>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAppointments = useCallback(() => {
    return api<Appointment[]>("/admin/appointments", { auth: true })
      .then(setAppointments)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: appointments.length, pending: 0, confirmed: 0, cancelled: 0 };
    appointments.forEach((a) => c[a.status]++);
    return c;
  }, [appointments]);

  const visible = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  const runAction = async () => {
    if (!action) return;
    setActionLoading(true);
    try {
      await api(`/admin/appointments/${action.appointment._id}/${action.type}`, { method: "PATCH", auth: true });
      toast.success(action.type === "confirm" ? "Appointment confirmed" : "Appointment cancelled");
      setAction(null);
      await loadAppointments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const canCancel = (a: Appointment) => a.status !== "cancelled" && a.paymentStatus === "unpaid";

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
          onClick={() => setAction({ type: "confirm", appointment: a })}
          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
        >
          <Check className="h-3.5 w-3.5" /> Confirm
        </button>
      )}
      {canCancel(a) && (
        <button
          onClick={() => setAction({ type: "cancel", appointment: a })}
          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title="Manage Appointments" description="Review, confirm or cancel appointment requests." />

      {/* status filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              filter === f ? "bg-brand-600 text-white" : "border border-line bg-white text-ink hover:bg-brand-50"
            }`}
          >
            {f} <span className="opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center text-muted">
          No {filter === "all" ? "" : filter} appointments found.
        </div>
      ) : (
        <>
          {/* table for large screens */}
          <div className="hidden overflow-x-auto rounded-2xl border border-line bg-white xl:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-cream text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Service</th>
                  <th className="px-3 py-3">Date & Time</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Status / Payment</th>
                  <th className="px-3 py-3">Requested</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((a) => (
                  <tr key={a._id}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={a.customer?.name} image={a.customer?.image} size={32} />
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{a.customer?.name || "Deleted user"}</p>
                          <p className="text-xs text-muted">{a.customer?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-ink">{a.service?.serviceName || "Deleted service"}</p>
                      <p className="flex items-center gap-1 text-xs text-muted">
                        {a.service?.category}
                        {a.message && <MessageSquare className="h-3 w-3 text-brand-500" aria-label="Has message" />}
                      </p>
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
            {visible.map((a) => (
              <li key={a._id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-center gap-2">
                  <Avatar name={a.customer?.name} image={a.customer?.image} size={36} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{a.customer?.name || "Deleted user"}</p>
                    <p className="truncate text-xs text-muted">{a.customer?.email}</p>
                  </div>
                  <span className="ml-auto font-semibold text-brand-600">${a.servicePrice}</span>
                </div>
                <p className="mt-3 font-medium text-ink">{a.service?.serviceName || "Deleted service"}</p>
                <p className="text-sm text-muted">
                  {formatDate(a.appointmentDate)} · {a.timeSlot}
                </p>
                <p className="text-xs text-muted">Requested {formatDate(a.createdAt)}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
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
        open={Boolean(action)}
        title={action?.type === "confirm" ? "Confirm this appointment?" : "Cancel this appointment?"}
        message={
          action
            ? `${action.appointment.customer?.name || "Customer"} — ${action.appointment.service?.serviceName || "service"} on ${formatDate(
                action.appointment.appointmentDate
              )} at ${action.appointment.timeSlot}. ${
                action.type === "confirm"
                  ? "The customer will then be able to pay online."
                  : "This cannot be undone."
              }`
            : ""
        }
        confirmLabel={action?.type === "confirm" ? "Yes, confirm" : "Yes, cancel"}
        danger={action?.type === "cancel"}
        loading={actionLoading}
        onConfirm={runAction}
        onClose={() => setAction(null)}
      />
    </div>
  );
}
