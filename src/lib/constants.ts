import type { AiTool, Genre } from "./types";

export const SITE_NAME = "aiarklive";
export const SITE_TAGLINE =
  "AI 크리에이터의 영상, 한곳에서 모아 보여주세요";

export const AI_TOOLS: { value: AiTool; label: string }[] = [
  { value: "kling", label: "Kling" },
  { value: "runway", label: "Runway" },
  { value: "pika", label: "Pika" },
  { value: "suno", label: "Suno" },
  { value: "grok", label: "Grok" },
  { value: "veo", label: "Veo" },
  { value: "hailuo", label: "Hailuo" },
  { value: "ltx-video", label: "LTX-Video" },
  { value: "wan", label: "Wan" },
  { value: "pixverse", label: "PixVerse" },
  { value: "other", label: "기타" },
];

export const GENRES: { value: Genre; label: string }[] = [
  { value: "short-film", label: "단편영화" },
  { value: "ad", label: "광고" },
  { value: "music-video", label: "뮤직비디오" },
  { value: "short-form", label: "숏폼" },
  { value: "experimental", label: "실험영상" },
  { value: "animation", label: "애니메이션" },
  { value: "loop", label: "루프" },
];

export const FEED_TABS: { value: "latest" | "popular" | "recommended"; label: string }[] = [
  { value: "latest", label: "최신" },
  { value: "popular", label: "인기" },
  { value: "recommended", label: "추천" },
];

export function getAiToolLabel(tool: AiTool): string {
  return AI_TOOLS.find((t) => t.value === tool)?.label ?? tool;
}

export function getGenreLabel(genre: Genre): string {
  return GENRES.find((g) => g.value === genre)?.label ?? genre;
}
