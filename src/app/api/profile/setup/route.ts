import { NextResponse } from "next/server";
import { getCurrentUser, getUsernameSetupState } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { normalizeUsername, validateUsername } from "@/lib/username";

export const runtime = "edge";

export async function GET() {
  const state = await getUsernameSetupState();
  if (!state) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  return NextResponse.json(state);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { username: rawUsername } = await request.json();
    const username = normalizeUsername(String(rawUsername ?? ""));
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

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("users")
        .update({ username, username_confirmed: true })
        .eq("id", user.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        username,
        avatar_url: user.avatar_url,
        username_confirmed: true,
      });

      if (error) throw error;
    }

    return NextResponse.json({ ok: true, username });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save nickname." },
      { status: 500 }
    );
  }
}
