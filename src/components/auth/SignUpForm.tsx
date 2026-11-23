"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/safeRedirect";
import { uploadImage } from "@/lib/uploadImage";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

type ImageMode = "upload" | "url";

const passwordRules = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
];

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageMode, setImageMode] = useState<ImageMode>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Please enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return toast.error("Please enter a valid email");

    const failedRule = passwordRules.find((rule) => !rule.test(password));
    if (failedRule) return toast.error(`Password needs: ${failedRule.label.toLowerCase()}`);

    if (imageMode === "url" && imageUrl.trim() && !/^https?:\/\/.+/.test(imageUrl.trim())) {
      return toast.error("Please enter a valid image URL");
    }

    setLoading(true);

    // 1. upload the profile image (optional)
    let image: string | undefined;
    try {
      if (imageMode === "upload" && imageFile) {
        setLoadingText("Uploading image...");
        image = await uploadImage(imageFile);
      } else if (imageMode === "url" && imageUrl.trim()) {
        image = imageUrl.trim();
      }
    } catch (err) {
      setLoading(false);
      toast.error(err instanceof Error ? err.message : "Image upload failed");
      return;
    }

    // 2. create the account
    setLoadingText("Creating account...");
    const { error } = await signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }

    toast.success("Account created successfully! Welcome to SalonBook.");
    router.push(safeRedirect(redirectTo, "/"));
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="label">Full Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className="input"
          />
        </div>

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
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password"
            autoComplete="new-password"
          />
          <ul className="mt-2 grid gap-1 sm:grid-cols-3">
            {passwordRules.map((rule) => {
              const ok = rule.test(password);
              return (
                <li
                  key={rule.label}
                  className={`flex items-center gap-1 text-xs ${ok ? "text-green-600" : "text-muted"}`}
                >
                  {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <span className="label">Profile Image (optional)</span>
          <div className="mb-2 inline-flex rounded-lg border border-line p-1 text-xs">
            {(["upload", "url"] as ImageMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setImageMode(mode)}
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  imageMode === mode ? "bg-brand-600 text-white" : "text-muted hover:text-ink"
                }`}
              >
                {mode === "upload" ? "Upload Image" : "Image URL"}
              </button>
            ))}
          </div>

          {imageMode === "upload" ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700"
            />
          ) : (
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="input"
            />
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? loadingText : "Create Account"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton callbackURL={safeRedirect(redirectTo, "/")} />

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={redirectTo ? `/signin?redirect=${encodeURIComponent(redirectTo)}` : "/signin"}
          className="font-semibold text-brand-600 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
