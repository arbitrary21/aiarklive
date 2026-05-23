import Link from "next/link";
import type { DiscoverCollection } from "@/lib/discover";
import type { Video } from "@/lib/types";

interface DiscoverCollectionCardProps {
  collection: DiscoverCollection;
  previews: Video[];
}

export function DiscoverCollectionCard({
  collection,
  previews,
}: DiscoverCollectionCardProps) {
  return (
    <Link
      href={collection.href}
      className={`panel group overflow-hidden bg-gradient-to-br p-5 transition hover:scale-[1.01] ${collection.accent}`}
    >
      <h2 className="text-lg font-semibold text-foreground group-hover:text-brand-200">
        {collection.title}
      </h2>
      <p className="mt-2 text-sm text-muted">{collection.description}</p>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {previews.map((video) => (
            <div
              key={video.id}
              className="aspect-video overflow-hidden rounded-lg bg-black/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <span className="mt-4 inline-block text-xs font-medium text-brand-300">
        Browse collection →
      </span>
    </Link>
  );
}
