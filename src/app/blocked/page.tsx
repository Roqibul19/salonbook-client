import type { Metadata } from "next";
import Link from "next/link";
import { Ban } from "lucide-react";

export const metadata: Metadata = {
  title: "Account Blocked | SalonBook",
};

export default function BlockedPage() {
  return (
    <section className="mx-auto max-w-lg px-4 py-24 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <Ban className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold text-ink">Your account has been blocked</h1>
      <p className="mt-3 text-muted">
        You can no longer access protected features of SalonBook. If you think this is a mistake,
        please contact the salon at hello@salonbook.com.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </section>
  );
}
