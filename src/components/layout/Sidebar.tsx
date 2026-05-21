"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Home,
  Link2,
  Trophy,
  User,
} from "lucide-react";
import clsx from "clsx";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/upload", label: "Upload", icon: Link2 },
  { href: "/leaderboard", label: "Rankings", icon: Trophy },
  {
    href: "/profile/11111111-1111-1111-1111-111111111101",
    label: "Profile",
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[220px] shrink-0 flex-col border-r lg:flex"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
          A
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{SITE_NAME}</p>
          <p className="truncate text-[11px] text-muted">{SITE_TAGLINE}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href.split("?")[0]);

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-[var(--chip-bg)] text-brand-300"
                  : "text-muted hover:bg-[var(--surface-elevated)] hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3" style={{ borderColor: "var(--border)" }}>
        <ThemeToggle />
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-surface px-2 py-2 lg:hidden"
      style={{ borderColor: "var(--border)" }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : pathname.startsWith(href.split("?")[0]);

        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]",
              active ? "text-brand-300" : "text-muted"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
