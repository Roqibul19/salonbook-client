/* eslint-disable @next/next/no-img-element */
import { formatDate } from "@/lib/constants";
import type { Appointment } from "@/types";
import StatusBadge from "./StatusBadge";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{children}</dd>
    </div>
  );
}

// shared by the customer and admin appointment pages
export default function AppointmentDetails({ appointment: a }: { appointment: Appointment }) {
  return (
    <div>
      {a.service && (
        <div className="mb-4 flex items-center gap-3">
          <img src={a.service.image} alt={a.service.serviceName} className="h-16 w-16 rounded-xl object-cover" />
          <div>
            <p className="font-semibold text-ink">{a.service.serviceName}</p>
            <p className="text-sm text-muted">{a.service.category}</p>
          </div>
        </div>
      )}

      <dl className="divide-y divide-line">
        {a.customer && (
          <>
            <Row label="Customer">{a.customer.name}</Row>
            <Row label="Email">{a.customer.email}</Row>
            {a.customer.phone && <Row label="Phone">{a.customer.phone}</Row>}
          </>
        )}
        <Row label="Appointment Date">{formatDate(a.appointmentDate)}</Row>
        <Row label="Time Slot">{a.timeSlot}</Row>
        {a.service?.duration && <Row label="Duration">{a.service.duration} min</Row>}
        <Row label="Service Price">${a.servicePrice}</Row>
        <Row label="Appointment Status">
          <StatusBadge status={a.status} />
        </Row>
        <Row label="Payment Status">
          <StatusBadge status={a.paymentStatus} />
        </Row>
        <Row label="Requested On">{formatDate(a.createdAt)}</Row>
      </dl>

      <div className="mt-4 rounded-xl bg-cream p-3 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Message</p>
        <p className="mt-1 text-ink">{a.message || "No message provided."}</p>
      </div>
    </div>
  );
}
