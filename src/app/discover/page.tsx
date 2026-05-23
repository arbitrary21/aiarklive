import { Compass } from "lucide-react";
import { DiscoverChallengeBanner } from "@/components/discover/DiscoverChallengeBanner";
import { DiscoverCollectionCard } from "@/components/discover/DiscoverCollectionCard";
import { TrendingKeywords } from "@/components/TrendingKeywords";
import { getDiscoverCollectionsWithPreviews } from "@/lib/discover";

export const runtime = "edge";

export const metadata = {
  title: "Discover",
};

export default async function DiscoverPage() {
  const collections = await getDiscoverCollectionsWithPreviews();

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

      <DiscoverChallengeBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <DiscoverCollectionCard
            key={collection.id}
            collection={collection}
            previews={collection.previews}
          />
        ))}
      </div>
    </div>
  );
}
