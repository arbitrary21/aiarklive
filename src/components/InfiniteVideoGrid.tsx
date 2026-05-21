"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VideoCard } from "@/components/VideoCard";
import { VideoLightbox } from "@/components/VideoLightbox";
import type { AiTool, FeedSort, Genre, Video } from "@/lib/types";
import { FEED_PAGE_SIZE } from "@/lib/types";

interface FeedQuery {
  sort?: FeedSort;
  aiTool?: AiTool;
  genre?: Genre;
  q?: string;
  following?: boolean;
  userId?: string;
}

interface InfiniteVideoGridProps {
  initialVideos: Video[];
  query: FeedQuery;
  emptyMessage?: string;
}

function buildParams(query: FeedQuery, offset: number): string {
  const params = new URLSearchParams();
  params.set("limit", String(FEED_PAGE_SIZE));
  params.set("offset", String(offset));
  if (query.sort) params.set("sort", query.sort);
  if (query.aiTool) params.set("aiTool", query.aiTool);
  if (query.genre) params.set("genre", query.genre);
  if (query.q) params.set("q", query.q);
  if (query.following) params.set("following", "true");
  if (query.userId) params.set("userId", query.userId);
  return params.toString();
}

export function InfiniteVideoGrid({
  initialVideos,
  query,
  emptyMessage = "No videos to display.",
}: InfiniteVideoGridProps) {
  const [videos, setVideos] = useState(initialVideos);
  const [offset, setOffset] = useState(initialVideos.length);
  const [hasMore, setHasMore] = useState(initialVideos.length >= FEED_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVideos(initialVideos);
    setOffset(initialVideos.length);
    setHasMore(initialVideos.length >= FEED_PAGE_SIZE);
  }, [initialVideos]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/videos?${buildParams(query, offset)}`);
      const next = (await res.json()) as Video[];
      if (!Array.isArray(next) || next.length === 0) {
        setHasMore(false);
        return;
      }

      setVideos((current) => {
        const seen = new Set(current.map((video) => video.id));
        const merged = [...current];
        for (const video of next) {
          if (!seen.has(video.id)) merged.push(video);
        }
        return merged;
      });
      setOffset((value) => value + next.length);
      if (next.length < FEED_PAGE_SIZE) setHasMore(false);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, offset, query]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (videos.length === 0) {
    return (
      <div className="panel flex min-h-[40vh] items-center justify-center border-dashed">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="masonry-grid">
        {videos.map((video) => (
          <div key={video.id} className="masonry-item">
            <VideoCard
              video={video}
              onPreview={() => setPreviewVideo(video)}
            />
          </div>
        ))}
      </div>
      {previewVideo && (
        <VideoLightbox
          video={previewVideo}
          onClose={() => setPreviewVideo(null)}
        />
      )}
      <div ref={sentinelRef} className="h-8" />
      {loading && (
        <p className="py-4 text-center text-sm text-muted">Loading more...</p>
      )}
    </div>
  );
}
