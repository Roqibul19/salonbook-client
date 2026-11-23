import type { Metadata } from "next";
import Link from "next/link";
import { CircleX } from "lucide-react";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Payment Cancelled | SalonBook",
};

export default async function PaymentCancelPage() {
  await requireRole("customer", "/dashboard/customer/appointments");

  return (
    <section className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <CircleX className="h-8 w-8 text-amber-500" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold text-ink">Payment cancelled</h1>
        <p className="mt-3 text-sm text-muted">
          No money was taken. Your appointment is still confirmed and unpaid — you can pay any time from your
          dashboard.
        </p>
        <Link href="/dashboard/customer/appointments" className="btn-primary mt-8">
          Back to My Appointments
        </Link>
      </div>
    </section>
  );
}
