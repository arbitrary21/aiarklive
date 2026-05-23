import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createComment, getComments } from "@/lib/comments";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

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

    const ip =
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for") ??
      "anon";

    const userLimit = checkRateLimit(`comment:user:${user.id}`, 20, 600_000);
    if (!userLimit.allowed) return rateLimitResponse(userLimit.retryAfterSeconds);
    const ipLimit = checkRateLimit(`comment:ip:${ip}`, 30, 600_000);
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit.retryAfterSeconds);

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
    const message = err instanceof Error ? err.message : "Failed to post comment.";
    const isDuplicate =
      message.includes("Duplicate comment") ||
      (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "P0001");
    return NextResponse.json(
      { error: isDuplicate ? "중복 댓글입니다. 잠시 후 다시 시도해 주세요." : message },
      { status: isDuplicate ? 429 : 400 }
    );
  }
}
