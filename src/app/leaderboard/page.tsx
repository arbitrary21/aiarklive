import Link from "next/link";
import { getTopCreators } from "@/lib/videos";

export const runtime = "edge";

export const metadata = {
  title: "리더보드",
};

export default async function LeaderboardPage() {
  const creators = await getTopCreators();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">인기 크리에이터</h1>
        <p className="mt-2 text-muted">좋아요 기준 상위 크리에이터</p>
      </div>

      <div className="space-y-3">
        {creators.map((creator, index) => (
          <Link
            key={creator.id}
            href={`/profile/${creator.id}`}
            className="panel flex items-center gap-4 p-4 transition hover:border-brand-500/30"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                index === 0
                  ? "bg-yellow-500/20 text-yellow-400"
                  : index === 1
                    ? "bg-gray-400/20 text-gray-300"
                    : index === 2
                      ? "bg-amber-700/20 text-amber-600"
                      : "bg-white/5 text-muted"
              }`}
            >
              {index + 1}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-bold text-white">
              {creator.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{creator.username}</p>
              <p className="text-sm text-muted line-clamp-1">
                {creator.bio ?? "AI 크리에이터"}
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium text-white">
                {creator.total_likes.toLocaleString()} ♥
              </p>
              <p className="text-muted">{creator.video_count}개 영상</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
