import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { getAiToolLabel, getGenreLabel } from "@/lib/constants";
import type { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="group overflow-hidden rounded-2xl border border-white/5 bg-surface transition hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/10"
    >
      <div className="relative aspect-video overflow-hidden bg-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 opacity-0 transition group-hover:opacity-100">
          {video.ai_tools.slice(0, 2).map((tool) => (
            <span
              key={tool}
              className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm"
            >
              {getAiToolLabel(tool)}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-white group-hover:text-brand-300">
          {video.title}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {video.user?.username ?? "Unknown"} · {getGenreLabel(video.genre)}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {video.likes_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {video.views_count.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
