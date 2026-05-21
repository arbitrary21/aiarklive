import { NextResponse } from "next/server";
import { ensureUserProfile, getUsernameSetupState } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await ensureUserProfile();
      const setup = await getUsernameSetupState();
      if (setup?.needsSetup) {
        return NextResponse.redirect(
          `${origin}/welcome?next=${encodeURIComponent(next)}`
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
