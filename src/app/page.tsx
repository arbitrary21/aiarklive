import { Suspense } from "react";
import { FeedTabs } from "@/components/FeedTabs";
import { VideoGrid } from "@/components/VideoGrid";
import { SITE_TAGLINE } from "@/lib/constants";
import { getVideos } from "@/lib/videos";
import type { FeedSort } from "@/lib/types";

export const runtime = "edge";

interface HomeProps {
  searchParams: Promise<{ sort?: FeedSort }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { sort = "latest" } = await searchParams;
  const videos = await getVideos({ sort });

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/20 via-surface to-accent-500/10 p-8 sm:p-12">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-brand-300">
            AI Creator Archive
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            AI 영상을 방주처럼
            <br />
            영원히 보존하세요
          </h1>
          <p className="mt-4 text-lg text-muted">{SITE_TAGLINE}</p>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />
      </section>

      <Suspense fallback={<div className="h-10" />}>
        <FeedTabs />
      </Suspense>

      <VideoGrid videos={videos} />
    </div>
  );
}
