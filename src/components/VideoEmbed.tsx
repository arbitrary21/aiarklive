import type { Platform } from "@/lib/types";

interface VideoEmbedProps {
  embedUrl: string;
  platform: Platform;
  title: string;
}

export function VideoEmbed({ embedUrl, platform, title }: VideoEmbedProps) {
  if (platform === "youtube") {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-surface">
      <div className="text-center">
        <p className="text-muted">Embed preview</p>
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-brand-400 hover:underline"
        >
          Open source link →
        </a>
      </div>
    </div>
  );
}
