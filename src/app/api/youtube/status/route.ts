import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "edge";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ verified: false }, { status: 401 });
  }

  return NextResponse.json({
    verified: Boolean(user.youtube_channel_id && user.youtube_verified_at),
    channelId: user.youtube_channel_id ?? null,
    channelTitle: user.youtube_channel_title ?? null,
    verifiedAt: user.youtube_verified_at ?? null,
  });
}
