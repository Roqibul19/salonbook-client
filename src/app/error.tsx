"use client"; // error boundaries must be client components

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-lg px-4 py-24 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <TriangleAlert className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-3 text-muted">
        We couldn&apos;t load this page right now. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => retry()} className="btn-primary">
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink hover:bg-brand-50"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
