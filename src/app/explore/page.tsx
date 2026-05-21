"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterChips } from "@/components/FilterChips";
import { VideoGrid } from "@/components/VideoGrid";
import { AI_TOOLS, GENRES } from "@/lib/constants";
import type { AiTool, Genre, Video } from "@/lib/types";

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

    setLoading(true);
    fetch(`/api/videos?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .finally(() => setLoading(false));
  }, [aiTool, genre, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">탐색</h1>
        <p className="mt-1 text-sm text-muted">
          {q
            ? `"${q}" 검색 결과`
            : "AI 툴과 장르별로 영상을 찾아보세요"}
        </p>
      </div>

      <section className="panel space-y-3 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          AI 툴
        </h2>
        <FilterChips options={AI_TOOLS} value={aiTool} onChange={setAiTool} />
      </section>

      <section className="panel space-y-3 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          장르
        </h2>
        <FilterChips options={GENRES} value={genre} onChange={setGenre} />
      </section>

      {loading ? (
        <div className="py-20 text-center text-muted">불러오는 중...</div>
      ) : (
        <VideoGrid
          videos={videos}
          emptyMessage="조건에 맞는 영상이 없습니다."
        />
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={<div className="py-20 text-center text-muted">불러오는 중...</div>}
    >
      <ExploreContent />
    </Suspense>
  );
}
