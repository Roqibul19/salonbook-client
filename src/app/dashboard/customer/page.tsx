"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, CircleCheck, CircleX, Hourglass } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/constants";
import { useSession } from "@/lib/auth-client";
import type { Appointment } from "@/types";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function CustomerOverviewPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Appointment[]>("/appointments/my", { auth: true })
      .then(setAppointments)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const count = (status: Appointment["status"]) => appointments.filter((a) => a.status === status).length;
  const recent = appointments.slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Hello, ${session?.user.name?.split(" ")[0] || "there"} 👋`}
        description="Here's a quick look at your salon appointments."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Requests" value={appointments.length} icon={CalendarDays} loading={loading} />
        <StatCard label="Pending" value={count("pending")} icon={Hourglass} tone="amber" loading={loading} />
        <StatCard label="Confirmed" value={count("confirmed")} icon={CircleCheck} tone="blue" loading={loading} />
        <StatCard label="Cancelled" value={count("cancelled")} icon={CircleX} tone="red" loading={loading} />
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="text-lg font-semibold text-ink">Recent Appointments</h2>
          <Link href="/dashboard/customer/appointments" className="text-sm font-medium text-brand-600 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-brand-50" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-muted">You haven&apos;t requested any appointments yet.</p>
            <Link href="/services" className="btn-primary mt-4">
              Browse Services
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((a) => (
              <li key={a._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-medium text-ink">{a.service?.serviceName || "Deleted service"}</p>
                  <p className="text-sm text-muted">
                    {formatDate(a.appointmentDate)} · {a.timeSlot}
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={a.status} />
                  <StatusBadge status={a.paymentStatus} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
