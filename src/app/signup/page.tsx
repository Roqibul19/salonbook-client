import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up | SalonBook",
};

export default async function SignUpPage() {
  // already logged in users don't need this page
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/dashboard");

  return (
    <AuthShell title="Create your account" subtitle="Join SalonBook and book your next salon visit online.">
      <Suspense>
        <SignUpForm />
      </Suspense>
    </AuthShell>
  );
}
