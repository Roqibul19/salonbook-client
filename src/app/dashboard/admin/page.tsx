"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CircleCheck,
  CreditCard,
  Hourglass,
  Scissors,
  Users,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";

type AdminStats = {
  totalCustomers: number;
  activeServices: number;
  totalAppointments: number;
  pending: number;
  confirmed: number;
  successfulPayments: number;
};

const quickLinks = [
  { href: "/dashboard/admin/appointments", label: "Review pending appointments" },
  { href: "/dashboard/admin/services/new", label: "Add a new service" },
  { href: "/dashboard/admin/users", label: "Manage customers" },
  { href: "/dashboard/admin/transactions", label: "View payment transactions" },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<AdminStats>("/admin/stats", { auth: true })
      .then(setStats)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Admin Overview" description="A snapshot of your salon at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Registered Customers" value={stats?.totalCustomers ?? 0} icon={Users} loading={loading} />
        <StatCard label="Active Services" value={stats?.activeServices ?? 0} icon={Scissors} tone="green" loading={loading} />
        <StatCard label="Appointment Requests" value={stats?.totalAppointments ?? 0} icon={CalendarDays} tone="blue" loading={loading} />
        <StatCard label="Pending Appointments" value={stats?.pending ?? 0} icon={Hourglass} tone="amber" loading={loading} />
        <StatCard label="Confirmed Appointments" value={stats?.confirmed ?? 0} icon={CircleCheck} tone="blue" loading={loading} />
        <StatCard label="Successful Payments" value={stats?.successfulPayments ?? 0} icon={CreditCard} tone="green" loading={loading} />
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <h2 className="text-lg font-semibold text-ink">Quick actions</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink transition hover:border-brand-200 hover:bg-brand-50"
              >
                {link.label} <ArrowRight className="h-4 w-4 text-brand-600" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
