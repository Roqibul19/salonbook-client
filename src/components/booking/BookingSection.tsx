"use client";

import { CalendarCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import type { Service } from "@/types";

type BookingSectionProps = {
  service: Service;
  role?: string | null;
};

export default function BookingSection({ service, role }: BookingSectionProps) {
  if (role === "admin") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        Admins cannot submit customer appointment requests. Sign in with a customer account to book.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm text-muted">
        Ready for your <span className="font-medium text-ink">{service.serviceName}</span>?
      </p>
      <button
        onClick={() => toast.info("Appointment booking form is coming in the next step.")}
        className="btn-primary mt-4 w-full"
      >
        <CalendarCheck className="h-4 w-4" /> Book Appointment
      </button>
    </div>
  );
}
