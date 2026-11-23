// Sends the image to our /api/upload route, which uploads it to ImgBB
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.url) {
    throw new Error(data?.message || "Image upload failed");
  }

  return data.url as string;
}
