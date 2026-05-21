import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function SiteBrand() {
  return (
    <Link
      href="/"
      className="block px-3 py-4 transition hover:opacity-90"
    >
      <div
        className="overflow-hidden rounded-xl border shadow-sm"
        style={{ borderColor: "var(--border)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/sidebar-banner.webp"
          alt=""
          width={400}
          height={200}
          className="aspect-[2/1] h-auto w-full object-cover object-center"
        />
      </div>
      <div className="mt-3 px-1">
        <p className="font-bold tracking-wide text-foreground">{SITE_NAME}</p>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
          {SITE_TAGLINE}
        </p>
      </div>
    </Link>
  );
}
