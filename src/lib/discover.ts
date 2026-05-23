import { getVideos } from "@/lib/videos";
import type { AiTool, Genre, Video, VideoFilters } from "@/lib/types";

export interface DiscoverCollection {
  id: string;
  title: string;
  description: string;
  href: string;
  accent: string;
}

export const discoverCollections: DiscoverCollection[] = [
  {
    id: "cinematic-kling",
    title: "Cinematic Kling",
    description: "Short films and ads made with Kling",
    href: "/explore?tool=kling",
    accent: "from-brand-500/30 to-accent-500/10",
  },
  {
    id: "runway-loops",
    title: "Runway Loops",
    description: "Seamless ambient loops and motion studies",
    href: "/explore?tool=runway&genre=loop",
    accent: "from-emerald-500/20 to-cyan-500/10",
  },
  {
    id: "suno-mv",
    title: "Suno Music Videos",
    description: "AI music paired with generative visuals",
    href: "/explore?tool=suno&genre=music-video",
    accent: "from-violet-500/25 to-pink-500/10",
  },
  {
    id: "experimental",
    title: "Experimental Lab",
    description: "Strange, bold, and boundary-pushing work",
    href: "/explore?genre=experimental",
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    id: "short-form",
    title: "Short Form Hits",
    description: "Vertical and snackable AI clips",
    href: "/explore?genre=short-form",
    accent: "from-sky-500/20 to-indigo-500/10",
  },
  {
    id: "animation",
    title: "Animation Showcase",
    description: "Character motion and stylized scenes",
    href: "/explore?genre=animation",
    accent: "from-rose-500/20 to-fuchsia-500/10",
  },
  {
    id: "trending-this-week",
    title: "Trending This Week",
    description: "This week's most-liked and saved AI videos",
    href: "/explore?sort=trending",
    accent: "from-brand-500/30 to-amber-500/15",
  },
  {
    id: "tool-starter-kit",
    title: "Tool Starter Kit",
    description: "Best beginner examples from Kling, Runway, and PixVerse",
    href: "/explore?collection=tool-starter-kit",
    accent: "from-cyan-500/25 to-violet-500/10",
  },
  {
    id: "challenge-gallery",
    title: "Challenge Gallery",
    description: "Creative submissions from the community challenges",
    href: "/explore?tag=challenge",
    accent: "from-rose-500/25 to-fuchsia-500/10",
  },
];

const COLLECTION_FILTERS: Record<string, VideoFilters> = {
  "cinematic-kling": { aiTool: "kling" as AiTool, sort: "popular", limit: 4 },
  "runway-loops": { aiTool: "runway" as AiTool, genre: "loop" as Genre, sort: "popular", limit: 4 },
  "suno-mv": { aiTool: "suno" as AiTool, genre: "music-video" as Genre, sort: "popular", limit: 4 },
  experimental: { genre: "experimental" as Genre, sort: "popular", limit: 4 },
  "short-form": { genre: "short-form" as Genre, sort: "popular", limit: 4 },
  animation: { genre: "animation" as Genre, sort: "popular", limit: 4 },
  "trending-this-week": { sort: "trending", limit: 4 },
  "tool-starter-kit": { collection: "tool-starter-kit", sort: "popular", limit: 4 },
  "challenge-gallery": { tag: "challenge", sort: "popular", limit: 4 },
};

export function getDiscoverCollections(): DiscoverCollection[] {
  return discoverCollections;
}

export async function getCollectionPreviewVideos(
  collectionId: string
): Promise<Video[]> {
  const filters = COLLECTION_FILTERS[collectionId];
  if (!filters) return [];
  return getVideos(filters);
}

export async function getDiscoverCollectionsWithPreviews(options?: {
  onlyWithContent?: boolean;
}): Promise<(DiscoverCollection & { previews: Video[] })[]> {
  const collections = getDiscoverCollections();
  const previews = await Promise.all(
    collections.map((collection) => getCollectionPreviewVideos(collection.id))
  );
  const withPreviews = collections.map((collection, index) => ({
    ...collection,
    previews: previews[index] ?? [],
  }));

  if (options?.onlyWithContent) {
    return withPreviews.filter((collection) => collection.previews.length > 0);
  }

  return withPreviews;
}
