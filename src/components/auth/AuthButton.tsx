"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface AuthButtonProps {
  nextPath?: string;
}

export function AuthButton({ nextPath }: AuthButtonProps) {
  const { user, loading, configured, signInWithGoogle, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!configured) {
    return (
      <Link
        href="/login"
        className="rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--surface-elevated)]"
        style={{ borderColor: "var(--border)" }}
      >
        Sign in
      </Link>
    );
  }

  if (loading) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--surface-elevated)]" />
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => signInWithGoogle(nextPath ?? window.location.pathname)}
        className="rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--surface-elevated)]"
        style={{ borderColor: "var(--border)" }}
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border px-2 py-1.5 transition hover:bg-[var(--surface-elevated)]"
        style={{ borderColor: "var(--border)" }}
      >
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar_url}
            alt={user.username}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden max-w-[100px] truncate text-sm sm:inline">
          {user.username}
        </span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border py-1 shadow-xl"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          <div className="border-b px-4 py-2.5" style={{ borderColor: "var(--border)" }}>
            <p className="truncate text-sm font-medium text-foreground">{user.username}</p>
            {user.email && (
              <p className="truncate text-xs text-muted" title={user.email}>
                {user.email}
              </p>
            )}
          </div>
          <Link
            href="/profile/me"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition hover:bg-[var(--surface-elevated)]"
          >
            <User className="h-4 w-4" />
            My profile
          </Link>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition hover:bg-[var(--surface-elevated)]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
