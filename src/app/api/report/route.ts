import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createReport } from "@/lib/reports";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { videoId, reason } = await request.json();

    if (!videoId || !reason) {
      return NextResponse.json(
        { error: "videoId and reason required." },
        { status: 400 }
      );
    }

    await createReport(videoId, String(reason), user?.id ?? null);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Report failed." },
      { status: 500 }
    );
  }
}
