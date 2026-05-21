import { Suspense } from "react";
import { FeedTabs } from "@/components/FeedTabs";
import { VideoGrid } from "@/components/VideoGrid";
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
    <div className="space-y-6">
      <section className="panel relative overflow-hidden p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
          AI Video Gallery
        </p>
        <h1 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          AI 크리에이터의 영상,
          <br />
          한곳에서 모아 보여주세요
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted">
          YouTube·Shorts 링크로 포트폴리오를 만들고, AI 툴·장르별로
          찾아보세요
        </p>
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
      </section>

      <Suspense fallback={<div className="h-10" />}>
        <FeedTabs />
      </Suspense>

      <VideoGrid videos={videos} />
    </div>
  );
}
