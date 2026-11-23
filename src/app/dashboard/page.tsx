import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// /dashboard sends each user to the dashboard of their own role
export default async function DashboardRedirectPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?redirect=/dashboard");
  }

  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  redirect("/dashboard/customer");
}
