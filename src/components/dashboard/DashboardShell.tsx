"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  CalendarDays,
  CirclePlus,
  LayoutDashboard,
  PanelLeft,
  Receipt,
  Scissors,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Avatar from "../Avatar";

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV_ITEMS: Record<"admin" | "customer", NavItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/appointments", label: "My Appointments", icon: CalendarDays },
    { href: "/dashboard/customer/profile", label: "My Profile", icon: UserRound },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: Scissors },
    { href: "/dashboard/admin/services/new", label: "Add Service", icon: CirclePlus },
    { href: "/dashboard/admin/appointments", label: "Manage Appointments", icon: CalendarDays },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/admin/profile", label: "My Profile", icon: UserRound },
  ],
};

type DashboardShellProps = {
  role: "admin" | "customer";
  user: { name: string; email: string; image?: string | null };
  children: ReactNode;
};

export default function DashboardShell({ role, user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = NAV_ITEMS[role];
  const home = items[0].href;

  // close the mobile sidebar after navigating
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // pick the most specific matching link so only one item is active
  const activeHref = items
    .filter((item) => pathname === item.href || (item.href !== home && pathname.startsWith(item.href + "/")))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line p-5">
        <Avatar name={user.name} image={user.image} size={44} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
            {role}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === activeHref;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-brand-600 text-white" : "text-ink hover:bg-brand-50"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* desktop sidebar */}
      <aside className="sticky top-22 hidden h-[calc(100vh-7rem)] w-64 shrink-0 overflow-y-auto rounded-2xl border border-line bg-white lg:block">
        {sidebar}
      </aside>

      {/* mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-2 text-muted hover:bg-brand-50"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <button
          onClick={() => setOpen(true)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink lg:hidden"
        >
          <PanelLeft className="h-4 w-4" /> Dashboard menu
        </button>
        {children}
      </div>
    </div>
  );
}
