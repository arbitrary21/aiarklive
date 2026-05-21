import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveVideo, unsaveVideo } from "@/lib/interactions";

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

    await saveVideo(user.id, videoId);
    return NextResponse.json({ ok: true, saved: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save video." },
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

    await unsaveVideo(user.id, videoId);
    return NextResponse.json({ ok: true, saved: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to unsave video." },
      { status: 400 }
    );
  }
}
