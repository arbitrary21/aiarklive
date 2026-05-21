import Link from "next/link";
import { getTrendingQueries } from "@/lib/search";

export function TrendingKeywords() {
  const keywords = getTrendingQueries();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
        Trending
      </span>
      {keywords.map((keyword) => (
        <Link
          key={keyword}
          href={`/explore?q=${encodeURIComponent(keyword)}`}
          className="rounded-full px-3 py-1 text-xs text-foreground transition hover:opacity-80"
          style={{ background: "var(--chip-bg)" }}
        >
          {keyword}
        </Link>
      ))}
    </div>
  );
}
