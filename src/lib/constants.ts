import type { AiTool, Genre } from "./types";

export const SITE_NAME = "AIARKLIVE";
export const SITE_TAGLINE =
  "AI creator videos, curated in one place";

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
  { value: "other", label: "Other" },
];

export const GENRES: { value: Genre; label: string }[] = [
  { value: "short-film", label: "Short Film" },
  { value: "ad", label: "Ad" },
  { value: "music-video", label: "Music Video" },
  { value: "short-form", label: "Short Form" },
  { value: "experimental", label: "Experimental" },
  { value: "animation", label: "Animation" },
  { value: "loop", label: "Loop" },
];

export const FEED_TABS: { value: "latest" | "popular" | "recommended" | "following"; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "recommended", label: "Recommended" },
  { value: "following", label: "Following" },
];

export function getAiToolLabel(tool: AiTool): string {
  return AI_TOOLS.find((t) => t.value === tool)?.label ?? tool;
}

export function getGenreLabel(genre: Genre): string {
  return GENRES.find((g) => g.value === genre)?.label ?? genre;
}
