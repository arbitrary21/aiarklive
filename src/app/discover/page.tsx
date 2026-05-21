import Link from "next/link";
import { Compass } from "lucide-react";
import { getDiscoverCollections } from "@/lib/discover";
import { TrendingKeywords } from "@/components/TrendingKeywords";

export const runtime = "edge";

export const metadata = {
  title: "Discover",
};

export default function DiscoverPage() {
  const collections = getDiscoverCollections();

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/20">
            <Compass className="h-5 w-5 text-brand-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Discover</h1>
            <p className="mt-1 text-sm text-muted">
              Curated collections inspired by Pexels Discover — browse by tool and mood.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <TrendingKeywords />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={collection.href}
            className={`panel group overflow-hidden bg-gradient-to-br p-5 transition hover:scale-[1.01] ${collection.accent}`}
          >
            <h2 className="text-lg font-semibold text-foreground group-hover:text-brand-200">
              {collection.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{collection.description}</p>
            <span className="mt-4 inline-block text-xs font-medium text-brand-300">
              Browse collection →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
