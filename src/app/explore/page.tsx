"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterChips } from "@/components/FilterChips";
import { InfiniteVideoGrid } from "@/components/InfiniteVideoGrid";
import { AI_TOOLS, GENRES } from "@/lib/constants";
import type { AiTool, Genre, Video } from "@/lib/types";
import { FEED_PAGE_SIZE } from "@/lib/types";

function ExploreContent() {
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const q = searchParams.get("q") ?? "";
  const [aiTool, setAiTool] = useState<AiTool | undefined>(
    (searchParams.get("tool") as AiTool) || undefined
  );
  const [genre, setGenre] = useState<Genre | undefined>(
    (searchParams.get("genre") as Genre) || undefined
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (aiTool) params.set("aiTool", aiTool);
    if (genre) params.set("genre", genre);
    if (q) params.set("q", q);
    params.set("limit", String(FEED_PAGE_SIZE));
    params.set("offset", "0");

    setLoading(true);
    fetch(`/api/videos?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .finally(() => setLoading(false));
  }, [aiTool, genre, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Explore</h1>
        <p className="mt-1 text-sm text-muted">
          {q
            ? `Results for "${q}"`
            : "Browse videos by AI tool and genre"}
        </p>
      </div>

      <section className="panel space-y-3 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          AI tools
        </h2>
        <FilterChips options={AI_TOOLS} value={aiTool} onChange={setAiTool} />
      </section>

      <section className="panel space-y-3 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Genre
        </h2>
        <FilterChips options={GENRES} value={genre} onChange={setGenre} />
      </section>

      {loading ? (
        <div className="py-20 text-center text-muted">Loading...</div>
      ) : (
        <InfiniteVideoGrid
          initialVideos={videos}
          query={{ aiTool, genre, q: q || undefined }}
          emptyMessage="No videos match your filters."
        />
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={<div className="py-20 text-center text-muted">Loading...</div>}
    >
      <ExploreContent />
    </Suspense>
  );
}
