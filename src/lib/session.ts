import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

type Role = "admin" | "customer";

// server-side guard for dashboard pages:
// guests -> sign in, blocked users -> blocked page, wrong role -> their own dashboard
export async function requireRole(role: Role, currentPath: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/signin?redirect=${encodeURIComponent(currentPath)}`);
  }

  if (session.user.isBlocked) {
    redirect("/blocked");
  }

  if (session.user.role !== role) {
    redirect(session.user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
  }

  return session;
}
