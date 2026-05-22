"use client";

import { ExternalLink } from "lucide-react";
import type { AiTool } from "@/lib/types";

interface AffiliateCTABannerProps {
  aiTools?: AiTool[];
  sourceUrl?: string;
}

interface ToolConfig {
  name: string;
  label: string;
  cta: string;
  href: string;
  color: string;
}

const TOOL_CONFIGS: Record<string, ToolConfig> = {
  kling: {
    name: "Kling AI",
    label: "이 영상은 Kling AI로 제작되었습니다",
    cta: "지금 무료로 시작하기",
    href: "https://klingai.com",
    color: "#6366f1",
  },
  runway: {
    name: "Runway",
    label: "이 영상은 Runway로 제작되었습니다",
    cta: "Runway 무료 체험",
    href: "https://runwayml.com",
    color: "#0ea5e9",
  },
  pixverse: {
    name: "PixVerse",
    label: "이 영상은 PixVerse로 제작되었습니다",
    cta: "PixVerse 시작하기",
    href: "https://pixverse.ai",
    color: "#f59e0b",
  },
  pika: {
    name: "Pika",
    label: "이 영상은 Pika로 제작되었습니다",
    cta: "Pika 무료 체험",
    href: "https://pika.art",
    color: "#ec4899",
  },
  hailuo: {
    name: "Hailuo AI",
    label: "이 영상은 Hailuo AI로 제작되었습니다",
    cta: "Hailuo 시작하기",
    href: "https://hailuoai.com",
    color: "#8b5cf6",
  },
};

function inferToolFromUrl(sourceUrl?: string): string | null {
  if (!sourceUrl) return null;
  if (sourceUrl.includes("kling") || sourceUrl.includes("kwai")) return "kling";
  if (sourceUrl.includes("runwayml") || sourceUrl.includes("runway")) return "runway";
  if (sourceUrl.includes("pixverse")) return "pixverse";
  if (sourceUrl.includes("pika.art")) return "pika";
  if (sourceUrl.includes("hailuoai")) return "hailuo";
  return null;
}

export function AffiliateCTABanner({
  aiTools,
  sourceUrl,
}: AffiliateCTABannerProps) {
  const primaryTool =
    aiTools?.find((t) => TOOL_CONFIGS[t]) ??
    inferToolFromUrl(sourceUrl) ??
    null;

  const config = primaryTool ? TOOL_CONFIGS[primaryTool] : null;

  if (!config) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm text-muted">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ background: config.color }}
        />
        <span>
          {config.label}
        </span>
      </div>
      <a
        href={config.href}
        target="_blank"
        rel="nofollow noopener sponsored"
        className="flex shrink-0 items-center gap-1 text-xs font-semibold text-white underline underline-offset-2 hover:opacity-80 transition"
      >
        {config.cta}
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
