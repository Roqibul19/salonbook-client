import type { Metadata } from "next";
import { Suspense } from "react";
import { requireRole } from "@/lib/session";
import PaymentSuccess from "@/components/payment/PaymentSuccess";

export const metadata: Metadata = {
  title: "Payment Successful | SalonBook",
};

export default async function PaymentSuccessPage() {
  await requireRole("customer", "/dashboard/customer/appointments");

  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}
