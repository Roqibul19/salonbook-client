"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import type { Service } from "@/types";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "@/components/dashboard/ServiceForm";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Service>(`/admin/services/${id}`, { auth: true })
      .then(setService)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  return (
    <div>
      <PageHeader
        title="Update Service"
        description={service ? `Editing "${service.serviceName}"` : "Loading service..."}
        action={
          <Link href="/dashboard/admin/services" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> Back to services
          </Link>
        }
      />

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center text-red-700">{error}</div>
      ) : !service ? (
        <div className="h-96 animate-pulse rounded-2xl bg-white" />
      ) : (
        <ServiceForm service={service} />
      )}
    </div>
  );
}
