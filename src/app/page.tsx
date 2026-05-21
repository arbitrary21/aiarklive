import { Suspense } from "react";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { InfiniteVideoGrid } from "@/components/InfiniteVideoGrid";
import { FeedTabs } from "@/components/FeedTabs";
import { TrendingKeywords } from "@/components/TrendingKeywords";
import { getCurrentUser } from "@/lib/auth";
import { getVideos } from "@/lib/videos";
import type { FeedSort } from "@/lib/types";
import { FEED_PAGE_SIZE } from "@/lib/types";

export const runtime = "edge";

interface HomeProps {
  searchParams: Promise<{ sort?: FeedSort }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { sort = "latest" } = await searchParams;
  const currentUser = await getCurrentUser();

  const videos = await getVideos(
    sort === "following" && currentUser
      ? { followingUserId: currentUser.id, sort: "latest", limit: FEED_PAGE_SIZE, offset: 0 }
      : { sort: sort === "following" ? "latest" : sort, limit: FEED_PAGE_SIZE, offset: 0 }
  );

  const showFollowingSignIn = sort === "following" && !currentUser;

  return (
    <div className="space-y-6">
      <section className="panel relative overflow-hidden p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
          AI Video Gallery
        </p>
        <h1 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          AI creator videos,
          <br />
          curated in one place
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted">
          Build a portfolio with YouTube and Shorts links. Follow creators and
          see their latest uploads in one feed.
        </p>
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
      </section>

      <Suspense fallback={<div className="h-10" />}>
        <FeedTabs />
      </Suspense>

      <TrendingKeywords />

      {showFollowingSignIn ? (
        <SignInPrompt />
      ) : (
        <InfiniteVideoGrid
          initialVideos={videos}
          query={{
            sort: sort === "following" ? "latest" : sort,
            following: sort === "following" && Boolean(currentUser),
          }}
          emptyMessage={
            sort === "following"
              ? "Follow creators to see their videos here."
              : undefined
          }
        />
      )}
    </div>
  );
}
