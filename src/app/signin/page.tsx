import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | SalonBook",
};

export default async function SignInPage() {
  // already logged in users don't need this page
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/dashboard");

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your salon appointments.">
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
