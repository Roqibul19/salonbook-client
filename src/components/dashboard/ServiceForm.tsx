/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ImageUp, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import { uploadImage } from "@/lib/uploadImage";
import type { Service, ServiceStatus } from "@/types";

type ServiceFormProps = {
  service?: Service; // given = edit mode
};

export default function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const isEdit = Boolean(service);

  const [serviceName, setServiceName] = useState(service?.serviceName ?? "");
  const [category, setCategory] = useState(service?.category ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service ? String(service.price) : "");
  const [duration, setDuration] = useState(service ? String(service.duration) : "");
  const [status, setStatus] = useState<ServiceStatus>(service?.status ?? "active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(service?.image ?? "");
  const [saving, setSaving] = useState(false);
  const [savingText, setSavingText] = useState("");

  // show a local preview of the chosen file
  const handleImageChange = (file: File | null) => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : service?.image ?? "");
  };

  // free the preview URL when leaving the page
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const priceNumber = Number(price);
    const durationNumber = Number(duration);

    if (!serviceName.trim()) return toast.error("Service name is required");
    if (!category) return toast.error("Please select a category");
    if (!description.trim()) return toast.error("Description is required");
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) return toast.error("Price must be a positive number");
    if (!Number.isFinite(durationNumber) || durationNumber <= 0) {
      return toast.error("Duration must be a positive number");
    }
    if (!isEdit && !imageFile) return toast.error("Please upload a service image");

    setSaving(true);

    let image = service?.image;
    if (imageFile) {
      try {
        setSavingText("Uploading image...");
        image = await uploadImage(imageFile);
      } catch (err) {
        setSaving(false);
        return toast.error(err instanceof Error ? err.message : "Image upload failed");
      }
    }

    setSavingText(isEdit ? "Saving changes..." : "Adding service...");
    const body = {
      serviceName: serviceName.trim(),
      category,
      description: description.trim(),
      price: priceNumber,
      duration: durationNumber,
      image,
      status,
    };

    try {
      if (isEdit) {
        await api(`/admin/services/${service!._id}`, { method: "PATCH", auth: true, body });
        toast.success("Service updated successfully");
      } else {
        await api("/admin/services", { method: "POST", auth: true, body });
        toast.success("Service added successfully");
      }
      router.push("/dashboard/admin/services");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save service");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_300px]" noValidate>
      <div className="space-y-5 rounded-2xl border border-line bg-white p-6">
        <div>
          <label htmlFor="serviceName" className="label">Service Name</label>
          <input
            id="serviceName"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="e.g. Signature Haircut"
            className="input"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="label">Service Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              <option value="">Select a category</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="label">Service Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ServiceStatus)}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="label">Price (USD)</label>
            <input
              id="price"
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="duration" className="label">Estimated Duration (minutes)</label>
            <input
              id="duration"
              type="number"
              min="1"
              step="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="45"
              className="input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what's included in this service..."
            className="input resize-none"
          />
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-white p-5">
          <span className="label">Service Image</span>
          <label className="mt-1 flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 text-center transition hover:border-brand-400">
            {preview ? (
              <img src={preview} alt="Preview" className="aspect-[4/3] w-full object-cover" />
            ) : (
              <span className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 p-4 text-sm text-muted">
                <ImageUp className="h-8 w-8 text-brand-400" />
                Click to upload an image
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
          </label>
          <p className="mt-2 text-xs text-muted">
            {isEdit ? "Choose a new file to replace the current image." : "JPG or PNG, up to 2 MB."}
          </p>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? savingText : isEdit ? "Save Changes" : "Add Service"}
        </button>
      </div>
    </form>
  );
}
