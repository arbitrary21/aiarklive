import Link from "next/link";
import { Download, Eye, Heart } from "lucide-react";
import { VideoActions } from "@/components/VideoActions";
import { getAiToolLabel, getGenreLabel } from "@/lib/constants";
import type { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <article className="group panel overflow-hidden transition hover:shadow-lg hover:shadow-brand-500/5">
      <Link href={`/video/${video.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-elevated)] sm:aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div
            className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
            style={{ background: "var(--overlay)" }}
          />
          <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
            <VideoActions
              videoId={video.id}
              initialLikes={video.likes_count}
              compact
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-1.5 p-3 opacity-0 transition group-hover:opacity-100">
            {video.ai_tools.slice(0, 3).map((tool) => (
              <span
                key={tool}
                className="rounded-lg px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm"
                style={{ background: "var(--chip-bg)" }}
              >
                {getAiToolLabel(tool)}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="p-3.5">
        <Link href={`/video/${video.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-brand-300">
            {video.title}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-muted">
          <Link
            href={`/profile/${video.user_id}`}
            className="font-medium text-foreground/90 transition hover:text-brand-300"
          >
            {video.user?.username ?? "Unknown"}
          </Link>
          {" · "}
          {getGenreLabel(video.genre)}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {video.likes_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {video.views_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {(video.downloads_count ?? 0).toLocaleString()}
            </span>
          </div>
          <VideoActions videoId={video.id} initialLikes={video.likes_count} />
        </div>
      </div>
    </article>
  );
}
