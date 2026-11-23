import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, Clock, Info, Tag } from "lucide-react";
import { auth } from "@/lib/auth";
import { API_URL } from "@/lib/api";
import type { Service } from "@/types";
import BookingSection from "@/components/booking/BookingSection";

export const metadata: Metadata = {
  title: "Service Details | SalonBook",
};

type ServiceResult = { service: Service } | { error: string };

async function getService(id: string): Promise<ServiceResult> {
  try {
    const res = await fetch(`${API_URL}/services/${id}`, { cache: "no-store" });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { error: data?.message || "Service not found" };
    return { service: data };
  } catch {
    return { error: "Could not load this service. Please try again later." };
  }
}

export default async function ServiceDetailsPage({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;

  // private page: send guests to sign in, then back here
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/signin?redirect=/services/${id}`);
  }

  const result = await getService(id);

  if ("error" in result) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Info className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold text-ink">{result.error}</h1>
        <p className="mt-2 text-muted">
          This service may have been removed or is not available for booking right now.
        </p>
        <Link href="/services" className="btn-primary mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>
      </section>
    );
  }

  const { service } = result;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/services"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> All services
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-50">
          <Image
            src={service.image}
            alt={service.serviceName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <Tag className="h-3 w-3" /> {service.category}
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">{service.serviceName}</h1>

          <div className="mt-5 flex flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Price</p>
              <p className="text-2xl font-semibold text-brand-600">${service.price}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Estimated Duration</p>
              <p className="flex items-center gap-1 text-2xl font-semibold text-ink">
                <Clock className="h-5 w-5 text-muted" /> {service.duration} min
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-ink">About this service</h2>
            <p className="mt-2 leading-relaxed text-muted">{service.description}</p>
          </div>

          <div className="mt-8">
            <BookingSection service={service} role={session.user.role} />
          </div>
        </div>
      </div>
    </section>
  );
}
