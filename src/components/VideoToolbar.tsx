"use client";

import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { ShareMenu } from "@/components/ShareMenu";
import { VideoActions } from "@/components/VideoActions";
import { getPlatformLabel } from "@/lib/youtube";
import type { Platform } from "@/lib/types";

interface VideoToolbarProps {
  videoId: string;
  title: string;
  platform: Platform;
  sourceUrl: string;
  pageUrl: string;
  likesCount: number;
}

export function VideoToolbar({
  videoId,
  title,
  platform,
  sourceUrl,
  pageUrl,
  likesCount,
}: VideoToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <VideoActions videoId={videoId} initialLikes={likesCount} />
      <a
        href={`/api/download/thumbnail?id=${videoId}`}
        download
        className="btn-icon"
        title="Save thumbnail"
      >
        <Download className="h-4 w-4" />
      </a>
      <ShareMenu title={title} url={pageUrl} />
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-icon"
        title={`View on ${getPlatformLabel(platform)}`}
      >
        <ExternalLink className="h-4 w-4" />
      </a>
      <Link
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto hidden rounded-xl border px-3 py-1.5 text-xs text-muted transition hover:text-foreground sm:inline-block"
        style={{ borderColor: "var(--border)" }}
      >
        {getPlatformLabel(platform)} source
      </Link>
    </div>
  );
}
