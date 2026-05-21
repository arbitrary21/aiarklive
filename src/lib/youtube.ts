import type { Platform } from "./types";

export function detectPlatform(url: string): Platform | null {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/twitter\.com|x\.com/.test(url)) return "x";
  return null;
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getSourceUrl(
  platform: Platform,
  embedUrl: string,
  sourceUrl?: string | null
): string {
  if (sourceUrl) return sourceUrl;

  if (platform === "youtube") {
    const videoId = extractYouTubeId(embedUrl);
    if (videoId) return getYouTubeWatchUrl(videoId);
  }

  return embedUrl;
}

export function getPlatformLabel(platform: Platform): string {
  switch (platform) {
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    case "x":
      return "X";
  }
}

export async function fetchYouTubeMetadata(url: string, apiKey?: string) {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error("유효한 YouTube URL이 아닙니다.");
  }

  const thumbnail_url = getYouTubeThumbnail(videoId);
  const embed_url = getYouTubeEmbedUrl(videoId);

  if (!apiKey) {
    return {
      videoId,
      title: "YouTube 영상",
      description: "",
      thumbnail_url,
      embed_url,
      platform: "youtube" as Platform,
    };
  }

  const params = new URLSearchParams({
    part: "snippet",
    id: videoId,
    key: apiKey,
  });

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error("YouTube API 요청에 실패했습니다.");
  }

  const data = await res.json();
  const snippet = data.items?.[0]?.snippet;

  if (!snippet) {
    throw new Error("영상 정보를 찾을 수 없습니다.");
  }

  return {
    videoId,
    title: snippet.title as string,
    description: (snippet.description as string) ?? "",
    thumbnail_url:
      snippet.thumbnails?.maxres?.url ??
      snippet.thumbnails?.high?.url ??
      thumbnail_url,
    embed_url,
    platform: "youtube" as Platform,
  };
}
