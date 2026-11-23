"use client";

import { useState } from "react";
import { CalendarCheck, ShieldAlert } from "lucide-react";
import type { Service } from "@/types";
import BookingForm from "./BookingForm";

type BookingSectionProps = {
  service: Service;
  role?: string | null;
};

export default function BookingSection({ service, role }: BookingSectionProps) {
  const [showForm, setShowForm] = useState(false);

  if (role === "admin") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        Admins cannot submit customer appointment requests. Sign in with a customer account to book.
      </div>
    );
  }

  if (showForm) {
    return <BookingForm service={service} onCancel={() => setShowForm(false)} />;
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm text-muted">
        Ready for your <span className="font-medium text-ink">{service.serviceName}</span>? Pick a date and
        time — you&apos;ll pay only after the salon confirms.
      </p>
      <button onClick={() => setShowForm(true)} className="btn-primary mt-4 w-full">
        <CalendarCheck className="h-4 w-4" /> Book Appointment
      </button>
    </div>
  );
}
