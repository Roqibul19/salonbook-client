import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

// Uploads an image to ImgBB from the server so the API key stays secret
export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "Image upload is not configured" },
      { status: 500 }
    );
  }

  let file: FormDataEntryValue | null;
  try {
    const formData = await request.formData();
    file = formData.get("image");
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Please select an image" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "Image must be smaller than 2 MB" }, { status: 400 });
  }

  try {
    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body,
    });
    const data = await res.json();

    if (!res.ok || !data?.success) {
      return NextResponse.json({ message: "Image upload failed" }, { status: 502 });
    }

    return NextResponse.json({ url: data.data.display_url as string });
  } catch {
    return NextResponse.json({ message: "Image upload failed" }, { status: 502 });
  }
}
