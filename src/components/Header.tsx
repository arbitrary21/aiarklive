import Link from "next/link";
import { Compass, Home, Trophy, Upload, User } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/explore", label: "탐색", icon: Compass },
  { href: "/upload", label: "업로드", icon: Upload },
  { href: "/leaderboard", label: "리더보드", icon: Trophy },
  { href: "/profile/11111111-1111-1111-1111-111111111101", label: "프로필", icon: User },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white shadow-lg shadow-brand-500/20">
            A
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              {SITE_NAME}
            </span>
            <span className="hidden text-xs text-muted sm:block">
              {SITE_TAGLINE}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/upload"
          className="rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:opacity-90"
        >
          영상 등록
        </Link>
      </div>

      <nav className="flex items-center justify-around border-t border-white/5 py-2 md:hidden">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-xs text-muted"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
