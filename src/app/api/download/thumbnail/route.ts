import { NextResponse } from "next/server";
import { getVideoById } from "@/lib/videos";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const video = await getVideoById(id);
  if (!video?.thumbnail_url) {
    return NextResponse.json({ error: "Video not found." }, { status: 404 });
  }

  const res = await fetch(video.thumbnail_url);
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch thumbnail" }, { status: 502 });
  }

  const buffer = await res.arrayBuffer();
  const safeName = video.title.replace(/[^\w\s-]/g, "").slice(0, 80);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
      "Content-Disposition": `attachment; filename="${safeName || "thumbnail"}.jpg"`,
    },
  });
}
