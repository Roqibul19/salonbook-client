"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2, Mail, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/uploadImage";
import Avatar from "../Avatar";
import PageHeader from "./PageHeader";

type ImageMode = "upload" | "url";

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending || !session) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <div className="h-96 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  return <ProfileFormInner key={session.user.updatedAt?.toString()} user={session.user} onSaved={() => router.refresh()} />;
}

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  role?: string | null;
};

function ProfileFormInner({ user, onSaved }: { user: ProfileUser; onSaved: () => void }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [imageMode, setImageMode] = useState<ImageMode>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name cannot be empty");
    if (phone.trim() && !/^[+]?[0-9\s-]{6,20}$/.test(phone.trim())) {
      return toast.error("Please enter a valid phone number");
    }
    if (imageMode === "url" && imageUrl.trim() && !/^https?:\/\/.+/.test(imageUrl.trim())) {
      return toast.error("Please enter a valid image URL");
    }

    setSaving(true);

    let image: string | undefined;
    try {
      if (imageMode === "upload" && imageFile) image = await uploadImage(imageFile);
      if (imageMode === "url" && imageUrl.trim()) image = imageUrl.trim();
    } catch (err) {
      setSaving(false);
      return toast.error(err instanceof Error ? err.message : "Image upload failed");
    }

    // only name, image and phone can be changed — role and blocked status are protected on the server
    const { error } = await authClient.updateUser({
      name: name.trim(),
      phone: phone.trim(),
      ...(image ? { image } : {}),
    });
    setSaving(false);

    if (error) return toast.error(error.message || "Could not update profile");

    toast.success("Profile updated successfully");
    setImageFile(null);
    setImageUrl("");
    onSaved();
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Update your personal information." />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center rounded-2xl border border-line bg-white p-6 text-center">
          <Avatar name={user.name} image={user.image} size={96} />
          <p className="mt-4 text-lg font-semibold text-ink">{user.name}</p>
          <p className="flex items-center gap-1 text-sm text-muted">
            <Mail className="h-3.5 w-3.5" /> {user.email}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            <ShieldCheck className="h-3.5 w-3.5" /> {user.role || "customer"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-line bg-white p-6" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label">Full Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label htmlFor="phone" className="label">Phone Number</label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label">Email (cannot be changed)</label>
            <input id="email" value={user.email} disabled className="input cursor-not-allowed bg-gray-50 text-muted" />
          </div>

          <div>
            <span className="label">Profile Image</span>
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
            <p className="mt-1 text-xs text-muted">Leave empty to keep your current photo.</p>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
