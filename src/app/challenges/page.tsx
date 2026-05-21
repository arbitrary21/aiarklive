import Link from "next/link";
import { Trophy } from "lucide-react";

export const metadata = {
  title: "Challenges",
};

export default function ChallengesPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/20">
        <Trophy className="h-8 w-8 text-brand-300" />
      </div>
      <h1 className="text-3xl font-bold text-white">Challenges</h1>
      <p className="mt-3 max-w-md text-muted">
        Coming in phase 2. Tool-specific challenges and leaderboards are on the way.
      </p>
      <Link
        href="/leaderboard"
        className="mt-8 rounded-xl bg-surface px-6 py-3 text-sm text-white transition hover:bg-white/10"
      >
        Preview leaderboard →
      </Link>
    </div>
  );
}
