"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Play } from "lucide-react";
import clsx from "clsx";

interface YouTubeStatus {
  verified: boolean;
  channelTitle: string | null;
}

interface YouTubeConnectBannerProps {
  initialVerified?: boolean;
  initialChannelTitle?: string | null;
}

export function YouTubeConnectBanner({
  initialVerified = false,
  initialChannelTitle = null,
}: YouTubeConnectBannerProps) {
  const [status, setStatus] = useState<YouTubeStatus>({
    verified: initialVerified,
    channelTitle: initialChannelTitle,
  });

  useEffect(() => {
    fetch("/api/youtube/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setStatus({
            verified: Boolean(data.verified),
            channelTitle: data.channelTitle ?? null,
          });
        }
      })
      .catch(() => {});
  }, []);

  if (status.verified) {
    return (
      <div
        className="flex items-start gap-3 rounded-xl border px-4 py-3"
        style={{ borderColor: "var(--border)", background: "var(--surface-elevated)" }}
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-medium text-foreground">YouTube channel connected</p>
          <p className="mt-1 text-sm text-muted">
            {status.channelTitle
              ? `Verified as ${status.channelTitle}. You can upload videos from this channel.`
              : "Your channel is verified for YouTube uploads."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "rounded-xl border px-4 py-4",
        "border-amber-500/30 bg-amber-500/5"
      )}
    >
      <div className="flex items-start gap-3">
        <Play className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Connect your YouTube channel
            </p>
            <p className="mt-1 text-sm text-muted">
              YouTube uploads require channel ownership verification. Connect once
              with Google, then only videos from your channel can be submitted.
            </p>
          </div>
          <Link
            href="/api/youtube/connect?next=/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            <Play className="h-4 w-4" />
            Connect YouTube channel
          </Link>
        </div>
      </div>
    </div>
  );
}
