import type { Metadata } from "next";
import Link from "next/link";
import { Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | SalonBook",
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-lg px-4 py-24 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Scissors className="h-7 w-7" />
      </span>
      <p className="mt-5 font-heading text-6xl font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-3 text-muted">
        Looks like this page got a little trim. The link may be broken or the page may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link
          href="/services"
          className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink hover:bg-brand-50"
        >
          Browse Services
        </Link>
      </div>
    </section>
  );
}
