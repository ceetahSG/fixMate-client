import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey =
    process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

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

  if (!["image/png", "image/jpeg"].includes(image.type)) {
    return NextResponse.json(
      { message: "Only PNG and JPG images are supported." },
      { status: 400 },
    );
  }

  const uploadData = new FormData();
  uploadData.append("image", await image.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer);
    return new Blob([bytes], { type: image.type });
  }), image.name);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: uploadData,
    },
  );
  const result = await response.json();

  if (!response.ok || !result.success) {
    return NextResponse.json(
      { message: result?.error?.message || "Image upload failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    url: result.data.url as string,
  });
}
