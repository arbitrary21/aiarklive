import { mockUsers, mockVideos } from "@/lib/mock-data";
import { AI_TOOLS } from "@/lib/constants";
import type { AiTool } from "@/lib/types";

const TRENDING_QUERIES = [
  "kling cinematic",
  "runway loop",
  "suno music video",
  "ambient ai",
  "short film",
  "pixverse animation",
];

export function getTrendingQueries(): string[] {
  return TRENDING_QUERIES;
}

export function getSearchSuggestions(query: string): {
  queries: string[];
  tools: { value: AiTool; label: string }[];
  creators: string[];
} {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      queries: TRENDING_QUERIES.slice(0, 5),
      tools: AI_TOOLS.slice(0, 4),
      creators: mockUsers.slice(0, 3).map((u) => u.username),
    };
  }

  const queries = TRENDING_QUERIES.filter((item) => item.includes(q)).slice(0, 5);
  const tools = AI_TOOLS.filter(
    (tool) =>
      tool.label.toLowerCase().includes(q) || tool.value.includes(q)
  ).slice(0, 4);
  const creators = mockUsers
    .filter((user) => user.username.toLowerCase().includes(q))
    .map((user) => user.username)
    .slice(0, 4);

  const titleHits = mockVideos
    .filter((video) => video.title.toLowerCase().includes(q))
    .map((video) => video.title)
    .slice(0, 3);

  return {
    queries: [...new Set([...queries, ...titleHits])].slice(0, 6),
    tools,
    creators,
  };
}
