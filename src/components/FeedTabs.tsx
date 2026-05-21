"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FEED_TABS } from "@/lib/constants";

export function FeedTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "latest";

  return (
    <div className="flex gap-2">
      {FEED_TABS.map((tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", tab.value);
        const href = `${pathname}?${params.toString()}`;

        return (
          <Link
            key={tab.value}
            href={href}
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              current === tab.value
                ? "bg-white text-background"
                : "bg-surface text-muted hover:text-white"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
