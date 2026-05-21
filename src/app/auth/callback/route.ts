import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ensureUserProfileWithClient,
  getUsernameSetupStateWithClient,
} from "@/lib/auth-profile";

export const runtime = "edge";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const oauthError = requestUrl.searchParams.get("error");

  if (oauthError || !code) {
    return NextResponse.redirect(new URL("/login?error=auth", requestUrl.origin));
  }

  const cookieUpdates: {
    name: string;
    value: string;
    options: Parameters<NextResponse["cookies"]["set"]>[2];
  }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieUpdates.push({ name, value, options });
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth", requestUrl.origin));
  }

  try {
    await ensureUserProfileWithClient(supabase);
    const setup = await getUsernameSetupStateWithClient(supabase);

    const redirectPath = setup?.needsSetup
      ? `/welcome?next=${encodeURIComponent(next)}`
      : next;

    const response = NextResponse.redirect(
      new URL(redirectPath, requestUrl.origin)
    );

    cookieUpdates.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch {
    const response = NextResponse.redirect(new URL(next, requestUrl.origin));

    cookieUpdates.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  }
}
