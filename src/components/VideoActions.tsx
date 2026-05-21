"use client";

import { Download, ExternalLink, Share2 } from "lucide-react";
import { getPlatformLabel } from "@/lib/youtube";
import type { Platform } from "@/lib/types";

interface VideoActionsProps {
  videoId: string;
  title: string;
  platform: Platform;
  sourceUrl: string;
}

export function VideoActions({
  videoId,
  title,
  platform,
  sourceUrl,
}: VideoActionsProps) {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    alert("링크가 클립보드에 복사되었습니다.");
  };

  return (
    <div className="space-y-3">
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-white transition hover:bg-white/5"
      >
        <ExternalLink className="h-4 w-4" />
        {getPlatformLabel(platform)}에서 보기
      </a>

      <a
        href={`/api/download/thumbnail?id=${videoId}`}
        download
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500/20 py-3 text-sm font-medium text-brand-300 transition hover:bg-brand-500/30"
      >
        <Download className="h-4 w-4" />
        썸네일 저장
      </a>

      <button
        type="button"
        onClick={handleShare}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-muted transition hover:text-white"
      >
        <Share2 className="h-4 w-4" />
        공유하기
      </button>

      <p className="text-xs leading-relaxed text-muted">
        YouTube·TikTok·X 링크 영상은 원본 플랫폼 정책상 파일 직접 다운로드를
        지원하지 않습니다. 영상 파일 저장은 Pro 직접 업로드(예정)에서
        제공됩니다.
      </p>
    </div>
  );
}
