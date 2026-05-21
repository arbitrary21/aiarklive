import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { likeVideo, unlikeVideo } from "@/lib/interactions";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { videoId } = await request.json();
    if (!videoId) {
      return NextResponse.json({ error: "videoId is required." }, { status: 400 });
    }

    const likesCount = await likeVideo(user.id, videoId);
    return NextResponse.json({ ok: true, liked: true, likesCount });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to like video." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { videoId } = await request.json();
    if (!videoId) {
      return NextResponse.json({ error: "videoId is required." }, { status: 400 });
    }

    const likesCount = await unlikeVideo(user.id, videoId);
    return NextResponse.json({ ok: true, liked: false, likesCount });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to unlike video." },
      { status: 400 }
    );
  }
}
