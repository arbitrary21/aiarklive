"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Link2,
  Search,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SiteBrand } from "@/components/layout/SiteBrand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const SIDEBAR_WIDTH_KEY = "aiarklive-sidebar-width";
const DEFAULT_WIDTH = 220;
const MIN_WIDTH = 180;
const MAX_WIDTH = 400;

function useNavItems() {
  const { user } = useAuth();

  return [
    { href: "/", label: "Home", icon: Home },
    { href: "/discover", label: "Discover", icon: LayoutGrid },
    { href: "/explore", label: "Explore", icon: Search },
    { href: "/challenges", label: "Challenges", icon: Sparkles },
    { href: "/upload", label: "Upload", icon: Link2 },
    { href: "/leaderboard", label: "Rankings", icon: Trophy },
    {
      href: user ? "/profile/me" : "/login",
      label: "Profile",
      icon: User,
    },
  ];
}

function useSidebarWidth() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);
  const widthRef = useRef(DEFAULT_WIDTH);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_WIDTH_KEY);
      if (stored) {
        const parsed = Number(stored);
        if (!Number.isNaN(parsed)) {
          const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed));
          setWidth(clamped);
          widthRef.current = clamped;
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startX.current = e.clientX;
      startWidth.current = widthRef.current;
      setIsResizing(true);
    },
    []
  );

  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (e: MouseEvent) => {
      const next = startWidth.current + (e.clientX - startX.current);
      const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next));
      widthRef.current = clamped;
      setWidth(clamped);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      try {
        localStorage.setItem(SIDEBAR_WIDTH_KEY, String(widthRef.current));
      } catch {
        // ignore
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return { width, isResizing, onResizeStart };
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const navItems = useNavItems();
  const { width, isResizing, onResizeStart } = useSidebarWidth();

  return (
    <aside
      className="relative hidden shrink-0 flex-col border-r lg:flex"
      style={{ width, borderColor: "var(--border)" }}
    >
      <SiteBrand />

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : href === "/profile/me"
                ? pathname === "/profile/me" ||
                  (user ? pathname === `/profile/${user.id}` : false)
                : pathname.startsWith(href.split("?")[0]);

          return (
            <Link
              key={label}
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

      <div className="space-y-2 border-t p-3" style={{ borderColor: "var(--border)" }}>
        {!user && (
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Sign in with Google
          </Link>
        )}
        <ThemeToggle />
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onMouseDown={onResizeStart}
        className={clsx(
          "absolute -right-1 top-0 z-10 h-full w-2 cursor-col-resize touch-none",
          isResizing ? "bg-brand-500/30" : "hover:bg-brand-500/20"
        )}
      />
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const navItems = useNavItems();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-surface px-2 py-2 lg:hidden"
      style={{ borderColor: "var(--border)" }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : href === "/profile/me"
              ? pathname === "/profile/me" ||
                (user ? pathname === `/profile/${user.id}` : false)
              : pathname.startsWith(href.split("?")[0]);

        return (
          <Link
            key={label}
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
