import { NextResponse } from "next/server";
import { fetchYouTubeMetadata } from "@/lib/youtube";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL을 입력해주세요." },
        { status: 400 }
      );
    }

    const metadata = await fetchYouTubeMetadata(
      url,
      process.env.YOUTUBE_API_KEY
    );

    return NextResponse.json(metadata);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "조회 실패" },
      { status: 400 }
    );
  }
}
