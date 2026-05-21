"use client";

import Link from "next/link";
import { ChevronDown, Plus, Video } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function CreateMenu() {
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">만들기</span>
        <ChevronDown className="h-4 w-4 opacity-80" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border py-1 shadow-xl"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          <Link
            href="/upload"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition hover:bg-[var(--surface-elevated)]"
          >
            <Video className="h-4 w-4 text-brand-300" />
            영상 링크 등록
          </Link>
        </div>
      )}
    </div>
  );
}
