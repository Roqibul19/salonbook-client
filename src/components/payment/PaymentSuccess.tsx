"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CircleCheck, Clock, Info, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/constants";

type SessionInfo = {
  stripeStatus: string;
  paymentStatus: "paid" | "unpaid";
  amount: number;
  currency: string;
  appointment: { _id: string; appointmentDate: string; timeSlot: string; serviceName?: string } | null;
};

const MAX_CHECKS = 10;

export default function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [info, setInfo] = useState<SessionInfo | null>(null);
  const [error, setError] = useState(sessionId ? "" : "Missing payment session.");
  const [checks, setChecks] = useState(0);

  // the webhook may take a few seconds - check again until our database says "paid"
  useEffect(() => {
    if (!sessionId) return;
    if (info?.paymentStatus === "paid" || checks >= MAX_CHECKS) return;

    const timer = setTimeout(
      () => {
        api<SessionInfo>(`/payments/session/${sessionId}`, { auth: true })
          .then((data) => {
            setInfo(data);
            setChecks((c) => c + 1);
          })
          .catch((err: Error) => setError(err.message));
      },
      checks === 0 ? 0 : 2000
    );

    return () => clearTimeout(timer);
  }, [sessionId, info, checks]);

  if (error) {
    return (
      <Card icon={<Info className="h-8 w-8 text-red-500" />} title="We couldn't verify this payment" tone="red">
        <p>{error}</p>
      </Card>
    );
  }

  if (!info) {
    return (
      <Card icon={<Loader2 className="h-8 w-8 animate-spin text-brand-600" />} title="Processing your payment...">
        <p>Please wait while we confirm your payment with Stripe.</p>
      </Card>
    );
  }

  const confirmed = info.paymentStatus === "paid";
  const stillWaiting = !confirmed && checks < MAX_CHECKS;

  return (
    <Card
      icon={
        confirmed ? (
          <CircleCheck className="h-10 w-10 text-green-600" />
        ) : stillWaiting ? (
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        ) : (
          <Clock className="h-8 w-8 text-amber-500" />
        )
      }
      title={confirmed ? "Payment successful!" : stillWaiting ? "Confirming your payment..." : "Payment received"}
      tone={confirmed ? "green" : "brand"}
    >
      {info.appointment && (
        <dl className="mx-auto mt-2 max-w-xs space-y-1 text-left text-sm">
          <Row label="Service" value={info.appointment.serviceName || "Salon appointment"} />
          <Row label="Date" value={formatDate(info.appointment.appointmentDate)} />
          <Row label="Time" value={info.appointment.timeSlot} />
          <Row label="Amount" value={`$${info.amount.toFixed(2)} ${info.currency.toUpperCase()}`} />
          <Row label="Payment Status" value={confirmed ? "Paid" : "Being confirmed"} />
        </dl>
      )}
      {!confirmed && !stillWaiting && (
        <p className="mt-4">
          Stripe has received your payment. Your appointment will show as <b>Paid</b> as soon as we receive the
          confirmation — please check again in a minute.
        </p>
      )}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function Card({
  icon,
  title,
  tone = "brand",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tone?: "brand" | "green" | "red";
  children: React.ReactNode;
}) {
  const bg = { brand: "bg-brand-50", green: "bg-green-50", red: "bg-red-50" }[tone];
  return (
    <section className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
        <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${bg}`}>{icon}</span>
        <h1 className="mt-5 text-3xl font-semibold text-ink">{title}</h1>
        <div className="mt-3 text-sm text-muted">{children}</div>
        <Link href="/dashboard/customer/appointments" className="btn-primary mt-8">
          Go to My Appointments
        </Link>
      </div>
    </section>
  );
}
