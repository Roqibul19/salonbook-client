import { requireRole } from "@/lib/session";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function CustomerDashboardLayout({ children }: LayoutProps<"/dashboard/customer">) {
  const session = await requireRole("customer", "/dashboard/customer");

  return (
    <DashboardShell role="customer" user={session.user}>
      {children}
    </DashboardShell>
  );
}
