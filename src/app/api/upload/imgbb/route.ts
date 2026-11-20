import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "ImgBB API key is not configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    return NextResponse.json(
      { message: "Please select an image." },
      { status: 400 },
    );
  }

  const uploadData = new FormData();
  uploadData.append("image", image);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: uploadData,
    },
  );
  const result = await response.json();

  if (!response.ok || !result.success || !result.data?.url) {
    return NextResponse.json(
      { message: result?.error?.message || "Image upload failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: result.data.url });
}
