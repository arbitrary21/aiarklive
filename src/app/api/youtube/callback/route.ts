import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { fetchMyYouTubeChannel } from "@/lib/youtube";

export const runtime = "edge";

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
  const requestUrl = new URL(request.url);
  const origin = requestOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const oauthError = requestUrl.searchParams.get("error");
  const next = safeNextPath(request.cookies.get("youtube_connect_next")?.value ?? null);

  if (oauthError || !code) {
    const reason = encodeURIComponent(oauthError ?? "missing_code");
    return NextResponse.redirect(
      new URL(`/upload?youtube=error&reason=${reason}`, origin)
    );
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

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    const reason = encodeURIComponent(exchangeError.message);
    return NextResponse.redirect(
      new URL(`/upload?youtube=error&reason=${reason}`, origin)
    );
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.provider_token;
  if (!accessToken) {
    return NextResponse.redirect(
      new URL("/upload?youtube=error&reason=no_provider_token", origin)
    );
  }

  try {
    const channel = await fetchMyYouTubeChannel(accessToken);
    if (!channel) {
      return NextResponse.redirect(
        new URL("/upload?youtube=error&reason=no_channel", origin)
      );
    }

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.redirect(
        new URL("/upload?youtube=error&reason=not_signed_in", origin)
      );
    }

    let mergedCount = 0;
    const { data: mergedVideos, error: mergeError } = await supabase.rpc(
      "transfer_videos_for_youtube_channel",
      {
        p_channel_id: channel.channelId,
        p_new_user_id: userId,
      }
    );

    if (!mergeError && typeof mergedVideos === "number") {
      mergedCount = mergedVideos;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        youtube_channel_id: channel.channelId,
        youtube_channel_title: channel.title,
        youtube_verified_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      const reason = encodeURIComponent(updateError.message);
      return NextResponse.redirect(
        new URL(`/upload?youtube=error&reason=${reason}`, origin)
      );
    }

    const redirectUrl = new URL(next, origin);
    redirectUrl.searchParams.set("youtube", "connected");
    if (typeof mergedCount === "number" && mergedCount > 0) {
      redirectUrl.searchParams.set("merged", String(mergedCount));
    }
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("youtube_connect_next", "", { path: "/", maxAge: 0 });

    cookieUpdates.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch (err) {
    const reason = encodeURIComponent(
      err instanceof Error ? err.message : "channel_fetch_failed"
    );
    return NextResponse.redirect(
      new URL(`/upload?youtube=error&reason=${reason}`, origin)
    );
  }
}
