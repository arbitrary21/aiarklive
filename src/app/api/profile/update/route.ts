import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { normalizeUsername, validateUsername } from "@/lib/username";

export const runtime = "edge";

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const body = await request.json() as { username?: string; bio?: string };
    const updates: { username?: string; bio?: string } = {};

    if (body.username !== undefined) {
      const username = normalizeUsername(String(body.username ?? ""));
      const validationError = validateUsername(username);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      const supabase = await createClient();
      const { data: conflict } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .maybeSingle();

      if (conflict) {
        return NextResponse.json(
          { error: "This nickname is already taken." },
          { status: 409 }
        );
      }
      updates.username = username;
    }

    if (body.bio !== undefined) {
      const bio = String(body.bio ?? "").trim().slice(0, 200);
      updates.bio = bio || null as unknown as string;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, user: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update profile." },
      { status: 500 }
    );
  }
}
