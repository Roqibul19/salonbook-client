import type { Metadata } from "next";
import { Suspense } from "react";
import BrowseServices from "@/components/services/BrowseServices";

export const metadata: Metadata = {
  title: "Browse Services | SalonBook",
  description: "Explore all available salon services at SalonBook.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            Our Services
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Browse Salon Services</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Search by name, filter by category and sort by price to find your perfect treatment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense>
          <BrowseServices />
        </Suspense>
      </section>
    </>
  );
}
