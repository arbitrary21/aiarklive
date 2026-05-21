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

function requestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const nextFromQuery = requestUrl.searchParams.get("next");
  const nextFromCookie = request.cookies.get("auth_next")?.value ?? null;
  const next = safeNextPath(nextFromQuery ?? nextFromCookie);
  const oauthError = requestUrl.searchParams.get("error");

  if (oauthError || !code) {
    return NextResponse.redirect(new URL("/login?error=auth", origin));
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
    const reason = encodeURIComponent(error.message);
    return NextResponse.redirect(
      new URL(`/login?error=auth&reason=${reason}`, origin)
    );
  }

  try {
    await ensureUserProfileWithClient(supabase);
    const setup = await getUsernameSetupStateWithClient(supabase);

    const redirectPath = setup?.needsSetup
      ? `/welcome?next=${encodeURIComponent(next)}`
      : next;

    const response = NextResponse.redirect(new URL(redirectPath, origin));
    response.cookies.set("auth_next", "", { path: "/", maxAge: 0 });

    cookieUpdates.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch {
    const response = NextResponse.redirect(new URL(next, origin));
    response.cookies.set("auth_next", "", { path: "/", maxAge: 0 });

    cookieUpdates.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  }
}
