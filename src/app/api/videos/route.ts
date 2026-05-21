import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { notifyFollowersOfNewVideo } from "@/lib/notifications";
import { detectPlatform, fetchYouTubeMetadata } from "@/lib/youtube";
import { createVideo, getVideos } from "@/lib/videos";
import type { AiTool, Genre } from "@/lib/types";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const aiTool = searchParams.get("aiTool") as AiTool | null;
  const genre = searchParams.get("genre") as Genre | null;
  const sort = searchParams.get("sort") as "latest" | "popular" | "recommended" | null;
  const userId = searchParams.get("userId");
  const q = searchParams.get("q");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const following = searchParams.get("following") === "true";

  let followingUserId: string | undefined;
  if (following) {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json([]);
    }
    followingUserId = user.id;
  }

  const videos = await getVideos({
    aiTool: aiTool ?? undefined,
    genre: genre ?? undefined,
    sort: sort ?? undefined,
    userId: userId ?? undefined,
    followingUserId,
    q: q ?? undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });

  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !user
    ) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const body = await request.json();
    const { embed_url, title, description, ai_tools, genre, prompt } = body;
    const source_url = embed_url as string;

    if (!embed_url || !title || !ai_tools?.length || !genre) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const platform = detectPlatform(embed_url);
    if (!platform) {
      return NextResponse.json(
        { error: "Unsupported platform URL." },
        { status: 400 }
      );
    }

    let thumbnail_url = "";
    let resolvedEmbedUrl = embed_url;

    if (platform === "youtube") {
      const meta = await fetchYouTubeMetadata(
        embed_url,
        process.env.YOUTUBE_API_KEY
      );
      thumbnail_url = meta.thumbnail_url;
      resolvedEmbedUrl = meta.embed_url;
    }

    const video = await createVideo(
      {
        embed_url: resolvedEmbedUrl,
        source_url,
        title,
        description,
        platform,
        thumbnail_url,
        ai_tools,
        genre,
        prompt,
      },
      user?.id
    );

    if (user?.id) {
      try {
        await notifyFollowersOfNewVideo(user.id, video.id, video.title);
      } catch {
        // Non-blocking if notifications fail
      }
    }

    return NextResponse.json(video, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
