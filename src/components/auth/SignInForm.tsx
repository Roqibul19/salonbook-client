"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/safeRedirect";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setLoading(true);
    const { data, error } = await signIn.email({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }

    toast.success(`Welcome back, ${data.user.name}!`);

    // admins go to their dashboard, customers go back where they came from
    const role = (data.user as { role?: string }).role;
    const fallback = role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
    router.push(safeRedirect(redirectTo, fallback));
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <PasswordInput id="password" value={password} onChange={setPassword} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton callbackURL={safeRedirect(redirectTo, "/dashboard")} />

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"}
          className="font-semibold text-brand-600 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
