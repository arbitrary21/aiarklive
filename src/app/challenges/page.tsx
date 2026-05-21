import Link from "next/link";
import { Trophy } from "lucide-react";

export const metadata = {
  title: "챌린지",
};

export default function ChallengesPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/20">
        <Trophy className="h-8 w-8 text-brand-300" />
      </div>
      <h1 className="text-3xl font-bold text-white">챌린지</h1>
      <p className="mt-3 max-w-md text-muted">
        2단계 기능입니다. AI 툴별 챌린지와 리더보드가 곧 오픈됩니다.
      </p>
      <Link
        href="/leaderboard"
        className="mt-8 rounded-xl bg-surface px-6 py-3 text-sm text-white transition hover:bg-white/10"
      >
        리더보드 미리보기 →
      </Link>
    </div>
  );
}
