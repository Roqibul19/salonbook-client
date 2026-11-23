import { requireRole } from "@/lib/session";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function AdminDashboardLayout({ children }: LayoutProps<"/dashboard/admin">) {
  const session = await requireRole("admin", "/dashboard/admin");

  return (
    <DashboardShell role="admin" user={session.user}>
      {children}
    </DashboardShell>
  );
}
