import Link from "next/link";
import { Trophy } from "lucide-react";
import { getAiToolLabel } from "@/lib/constants";
import { getChallenges } from "@/lib/challenges";

export const metadata = {
  title: "Challenges",
};

export default async function ChallengesPage() {
  const challenges = await getChallenges();

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20">
            <Trophy className="h-6 w-6 text-brand-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Challenges</h1>
            <p className="mt-1 text-sm text-muted">
              Tool-specific creator events inspired by Civitai-style community jams.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((challenge) => (
          <article key={challenge.id} className="panel space-y-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-300">
                {getAiToolLabel(challenge.tool)}
              </span>
              <span className="text-xs uppercase tracking-wide text-muted">
                {challenge.status}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{challenge.title}</h2>
            <p className="text-sm text-muted">{challenge.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
              <span>Prize: {challenge.prize}</span>
              <span>{challenge.entries_count} entries</span>
              <span>
                Ends {new Date(challenge.ends_at).toLocaleDateString("en-US")}
              </span>
            </div>
            <Link href="/upload" className="btn-secondary inline-block">
              Submit entry
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
