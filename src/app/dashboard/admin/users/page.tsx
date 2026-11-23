"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Ban, Eye, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/constants";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Avatar from "@/components/Avatar";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Customer = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  appointmentCount: number;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [toggling, setToggling] = useState<Customer | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  const loadUsers = useCallback(() => {
    return api<Customer[]>("/admin/users", { auth: true })
      .then(setUsers)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  const handleToggle = async () => {
    if (!toggling) return;
    const action = toggling.isBlocked ? "unblock" : "block";
    setToggleLoading(true);
    try {
      await api(`/admin/users/${toggling._id}/${action}`, { method: "PATCH", auth: true });
      setUsers((list) => list.map((u) => (u._id === toggling._id ? { ...u, isBlocked: !u.isBlocked } : u)));
      toast.success(`${toggling.name} has been ${action}ed`);
      setToggling(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setToggleLoading(false);
    }
  };

  const blockButton = (u: Customer) => (
    <button
      onClick={() => setToggling(u)}
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
        u.isBlocked
          ? "border border-green-200 text-green-700 hover:bg-green-50"
          : "border border-red-200 text-red-600 hover:bg-red-50"
      }`}
    >
      {u.isBlocked ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
      {u.isBlocked ? "Unblock" : "Block"}
    </button>
  );

  return (
    <div>
      <PageHeader title="Manage Users" description={`${users.length} registered customers`} />

      <label className="relative mb-4 block max-w-sm">
        <span className="sr-only">Search users</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
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
        <div className="rounded-2xl border border-line bg-white p-12 text-center text-muted">No customers found.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-line bg-cream text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Appointments</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} image={u.image} size={36} />
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{u.name}</p>
                        <p className="text-xs text-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-ink">{u.appointmentCount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.isBlocked ? "blocked" : "active"} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setViewing(u)}
                        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-brand-50"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      {blockButton(u)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Customer Details" size="sm">
        {viewing && (
          <div className="text-center">
            <div className="flex justify-center">
              <Avatar name={viewing.name} image={viewing.image} size={80} />
            </div>
            <p className="mt-3 text-lg font-semibold text-ink">{viewing.name}</p>
            <p className="text-sm text-muted">{viewing.email}</p>
            <dl className="mt-5 divide-y divide-line text-left text-sm">
              <div className="flex justify-between py-2">
                <dt className="text-muted">Phone</dt>
                <dd className="font-medium text-ink">{viewing.phone || "Not added"}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-muted">Role</dt>
                <dd className="font-medium capitalize text-ink">{viewing.role || "customer"}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-muted">Joined</dt>
                <dd className="font-medium text-ink">{formatDate(viewing.createdAt)}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-muted">Appointments</dt>
                <dd className="font-medium text-ink">{viewing.appointmentCount}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-muted">Status</dt>
                <dd>
                  <StatusBadge status={viewing.isBlocked ? "blocked" : "active"} />
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toggling)}
        title={toggling?.isBlocked ? "Unblock this customer?" : "Block this customer?"}
        message={
          toggling?.isBlocked
            ? `${toggling?.name} will be able to sign in and book appointments again.`
            : `${toggling?.name} will be signed out immediately and won't be able to use protected features.`
        }
        confirmLabel={toggling?.isBlocked ? "Yes, unblock" : "Yes, block"}
        danger={!toggling?.isBlocked}
        loading={toggleLoading}
        onConfirm={handleToggle}
        onClose={() => setToggling(null)}
      />
    </div>
  );
}
