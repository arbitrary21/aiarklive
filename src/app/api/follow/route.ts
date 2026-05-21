import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { followUser, unfollowUser } from "@/lib/follows";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { followingId } = await request.json();
    if (!followingId) {
      return NextResponse.json(
        { error: "followingId is required." },
        { status: 400 }
      );
    }

    await followUser(user.id, followingId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to follow user." },
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

    const { followingId } = await request.json();
    if (!followingId) {
      return NextResponse.json(
        { error: "followingId is required." },
        { status: 400 }
      );
    }

    await unfollowUser(user.id, followingId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to unfollow user." },
      { status: 400 }
    );
  }
}
