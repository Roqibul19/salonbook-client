/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CirclePlus, Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Service } from "@/types";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadServices = useCallback(() => {
    return api<Service[]>("/admin/services", { auth: true })
      .then(setServices)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? services.filter((s) => s.serviceName.toLowerCase().includes(q)) : services;
  }, [services, search]);

  const toggleStatus = async (service: Service) => {
    const status = service.status === "active" ? "inactive" : "active";
    setTogglingId(service._id);
    try {
      await api(`/admin/services/${service._id}`, { method: "PATCH", auth: true, body: { status } });
      setServices((list) => list.map((s) => (s._id === service._id ? { ...s, status } : s)));
      toast.success(`${service.serviceName} is now ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api(`/admin/services/${deleting._id}`, { method: "DELETE", auth: true });
      setServices((list) => list.filter((s) => s._id !== deleting._id));
      toast.success("Service deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete service");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Manage Services"
        description={`${services.length} services in total — only active ones are visible to customers.`}
        action={
          <Link href="/dashboard/admin/services/new" className="btn-primary">
            <CirclePlus className="h-4 w-4" /> Add Service
          </Link>
        }
      />

      <label className="relative mb-4 block max-w-sm">
        <span className="sr-only">Search services</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by service name..."
          className="input pl-11"
        />
      </label>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center text-muted">No services found.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-cream text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((service) => (
                <tr key={service._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={service.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{service.serviceName}</p>
                        <p className="text-xs text-muted">{service.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">${service.price}</td>
                  <td className="px-4 py-3 text-muted">{service.duration} min</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(service)}
                      disabled={togglingId === service._id}
                      className="inline-flex items-center gap-2"
                      title="Click to change status"
                    >
                      <span
                        className={`relative h-5 w-9 rounded-full transition ${
                          service.status === "active" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                            service.status === "active" ? "left-4.5" : "left-0.5"
                          }`}
                        />
                      </span>
                      {togglingId === service._id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted" />
                      ) : (
                        <StatusBadge status={service.status} />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/admin/services/${service._id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-brand-50"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <button
                        onClick={() => setDeleting(service)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this service?"
        message={`"${deleting?.serviceName}" will be permanently removed. Existing appointments keep their saved price. This cannot be undone.`}
        confirmLabel="Yes, delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
