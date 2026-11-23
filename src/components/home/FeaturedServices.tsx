import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { API_URL } from "@/lib/api";
import type { Service } from "@/types";
import ServiceCard from "../services/ServiceCard";

async function getFeaturedServices(): Promise<Service[] | null> {
  try {
    const res = await fetch(`${API_URL}/services?limit=6`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function FeaturedServices() {
  const services = await getFeaturedServices();

  if (!services) {
    return (
      <p className="mt-10 flex items-center justify-center gap-2 text-sm text-muted">
        <Info className="h-4 w-4" /> Could not load services right now. Please refresh the page.
      </p>
    );
  }

  if (services.length === 0) {
    return <p className="mt-10 text-center text-sm text-muted">No services available yet.</p>;
  }

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline"
        >
          View all services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
