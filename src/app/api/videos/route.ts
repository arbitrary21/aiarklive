import { NextResponse } from "next/server";
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

  const videos = await getVideos({
    aiTool: aiTool ?? undefined,
    genre: genre ?? undefined,
    sort: sort ?? undefined,
    userId: userId ?? undefined,
  });

  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { embed_url, title, description, ai_tools, genre, prompt } = body;
    const source_url = embed_url as string;

    if (!embed_url || !title || !ai_tools?.length || !genre) {
      return NextResponse.json(
        { error: "필수 항목을 입력해주세요." },
        { status: 400 }
      );
    }

    const platform = detectPlatform(embed_url);
    if (!platform) {
      return NextResponse.json(
        { error: "지원하지 않는 플랫폼 URL입니다." },
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

    const video = await createVideo({
      embed_url: resolvedEmbedUrl,
      source_url,
      title,
      description,
      platform,
      thumbnail_url,
      ai_tools,
      genre,
      prompt,
    });

    return NextResponse.json(video, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "등록 실패" },
      { status: 500 }
    );
  }
}
