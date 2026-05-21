import { NextResponse } from "next/server";
import { fetchYouTubeMetadata } from "@/lib/youtube";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Please enter a URL." },
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
      { error: err instanceof Error ? err.message : "Failed to fetch metadata" },
      { status: 400 }
    );
  }
}
