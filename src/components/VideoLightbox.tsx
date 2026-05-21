"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import { VideoActions } from "@/components/VideoActions";
import { getAiToolLabel } from "@/lib/constants";
import type { Video } from "@/lib/types";

interface VideoLightboxProps {
  video: Video;
  onClose: () => void;
}

export function VideoLightbox({ video, onClose }: VideoLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="panel relative max-h-[92vh] w-full max-w-5xl overflow-y-auto p-3 sm:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-icon absolute right-3 top-3 z-10"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-hidden rounded-xl">
          <VideoEmbed
            embedUrl={video.embed_url}
            platform={video.platform}
            title={video.title}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
            <p className="mt-1 text-sm text-muted">
              {video.user?.username ?? "Unknown"} ·{" "}
              {video.ai_tools.map(getAiToolLabel).join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <VideoActions videoId={video.id} initialLikes={video.likes_count} />
            <Link href={`/video/${video.id}`} className="btn-secondary">
              Open detail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
