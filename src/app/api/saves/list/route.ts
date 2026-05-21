import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSavedVideoIds } from "@/lib/interactions";
import { getVideoById } from "@/lib/videos";
import type { Video } from "@/lib/types";

export const runtime = "edge";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const ids = await getSavedVideoIds(user.id);
  const videos: Video[] = [];

  for (const id of ids) {
    const video = await getVideoById(id);
    if (video) videos.push(video);
  }

  return NextResponse.json(videos);
}
