import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const revalidate = 3600;

const BASE_URL = "https://aiarklive.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/discover`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/challenges`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/tools/kling`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  try {
    const supabase = await createClient();

    const { data: videos } = await supabase
      .from("videos")
      .select("id, created_at")
      .eq("is_nsfw", false)
      .order("created_at", { ascending: false })
      .limit(1000);

    const videoRoutes: MetadataRoute.Sitemap = (videos ?? []).map((v) => ({
      url: `${BASE_URL}/video/${v.id}`,
      lastModified: new Date(v.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const { data: profiles } = await supabase
      .from("users")
      .select("id, created_at")
      .limit(500);

    const profileRoutes: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
      url: `${BASE_URL}/profile/${p.id}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...videoRoutes, ...profileRoutes];
  } catch {
    return staticRoutes;
  }
}
