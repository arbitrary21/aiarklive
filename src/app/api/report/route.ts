import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "edge";

const reports: { videoId: string; reason: string; userId: string | null; at: string }[] = [];

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { videoId, reason } = await request.json();

    if (!videoId || !reason) {
      return NextResponse.json({ error: "videoId and reason required." }, { status: 400 });
    }

    reports.push({
      videoId,
      reason: String(reason),
      userId: user?.id ?? null,
      at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Report failed." },
      { status: 500 }
    );
  }
}
