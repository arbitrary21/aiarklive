import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getAiToolLabel, getGenreLabel } from "@/lib/constants";
import type { AiTool, Video } from "@/lib/types";

interface HomeFeaturedProps {
  videos: Video[];
}

export function HomeFeatured({ videos }: HomeFeaturedProps) {
  if (videos.length === 0) return null;

  const [hero, ...rest] = videos;

  return (
    <section className="panel overflow-hidden p-5 sm:p-6">
      <FeaturedSectionHeader />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <FeaturedHero video={hero} />
        {rest.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {rest.map((video) => (
              <FeaturedTile key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedSectionHeader() {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/20">
          <Sparkles className="h-4 w-4 text-brand-300" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Featured</h2>
          <p className="text-xs text-muted">Hand-picked from the community</p>
        </div>
      </div>
      <Link
        href="/discover"
        className="shrink-0 text-xs font-medium text-brand-300 transition hover:text-brand-200"
      >
        Discover more →
      </Link>
    </div>
  );
}

function FeaturedHero({ video }: { video: Video }) {
  const tool: AiTool = video.ai_tools[0] ?? video.ai_tool ?? "other";

  return (
    <Link
      href={`/video/${video.id}`}
      className="group relative block overflow-hidden rounded-xl bg-black/20"
    >
      <div className="aspect-video overflow-hidden sm:aspect-[16/10]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-200">
          {getAiToolLabel(tool)} · {getGenreLabel(video.genre)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-white group-hover:text-brand-100 sm:text-xl">
          {video.title}
        </h3>
        <p className="mt-1 text-sm text-white/75">
          {video.user?.username ?? "Unknown"}
        </p>
      </div>
    </Link>
  );
}

function FeaturedTile({ video }: { video: Video }) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="group flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/50 p-2 transition hover:border-brand-500/30"
    >
      <FeaturedTileThumb video={video} />
      <div className="min-w-0 flex-1 py-0.5">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-brand-300">
          {video.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-muted">
          {video.user?.username ?? "Unknown"}
        </p>
      </div>
    </Link>
  );
}

function FeaturedTileThumb({ video }: { video: Video }) {
  return (
    <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-black/20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={video.thumbnail_url}
        alt={video.title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
