import { ensureUserProfile } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await ensureUserProfile();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to ensure profile." },
      { status: 500 }
    );
  }
}
