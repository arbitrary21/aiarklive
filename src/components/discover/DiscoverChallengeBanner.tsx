import Link from "next/link";

export function DiscoverChallengeBanner() {
  return (
    <Link
      href="/upload"
      className="panel block bg-gradient-to-r from-rose-500/15 via-brand-500/10 to-violet-500/15 p-5 transition hover:scale-[1.01]"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
        This week&apos;s challenge
      </p>
      <h2 className="mt-1 text-lg font-semibold text-foreground">
        나만의 미래 도시 — Future City 2050
      </h2>
      <p className="mt-2 text-sm text-muted">
        May 26 – Jun 1 · Upload with{" "}
        <span className="font-medium text-foreground">#AIARKChallenge001</span>
      </p>
      <span className="mt-3 inline-block text-xs font-medium text-brand-300">
        Join challenge →
      </span>
    </Link>
  );
}
