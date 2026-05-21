import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createComment, getComments } from "@/lib/comments";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json({ error: "videoId is required." }, { status: 400 });
  }

  const comments = await getComments(videoId);
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { videoId, content } = await request.json();
    if (!videoId || !content) {
      return NextResponse.json(
        { error: "videoId and content are required." },
        { status: 400 }
      );
    }

    const comment = await createComment(videoId, user.id, String(content));
    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to post comment." },
      { status: 400 }
    );
  }
}
