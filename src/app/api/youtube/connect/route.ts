import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "edge";

const YOUTUBE_READONLY_SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

function requestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/upload";
  }
  return next;
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    const origin = requestOrigin(request);
    return NextResponse.redirect(
      new URL("/login?next=/upload", origin)
    );
  }

  const origin = requestOrigin(request);
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/youtube/callback`,
      skipBrowserRedirect: true,
      scopes: YOUTUBE_READONLY_SCOPE,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    const reason = encodeURIComponent(error?.message ?? "missing_oauth_url");
    return NextResponse.redirect(
      new URL(`/upload?youtube=error&reason=${reason}`, origin)
    );
  }

  const response = NextResponse.redirect(data.url);
  response.cookies.set("youtube_connect_next", next, {
    path: "/",
    maxAge: 600,
    sameSite: "lax",
    secure: true,
    httpOnly: false,
  });

  cookieUpdates.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
