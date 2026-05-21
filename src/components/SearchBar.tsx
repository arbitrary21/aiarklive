"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { getAiToolLabel } from "@/lib/constants";
import type { AiTool } from "@/lib/types";

interface SuggestResponse {
  queries: string[];
  tools: { value: AiTool; label: string }[];
  creators: string[];
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestResponse | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    const timer = window.setTimeout(() => {
      fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch(() => setSuggestions(null));
    }, q ? 200 : 0);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setOpen(false);
    if (q) router.push(`/explore?q=${encodeURIComponent(q)}`);
    else router.push("/explore");
  };

  const goQuery = (value: string) => {
    setQuery(value);
    setOpen(false);
    router.push(`/explore?q=${encodeURIComponent(value)}`);
  };

  return (
    <div ref={wrapRef} className="relative flex-1 max-w-xl">
      <form onSubmit={handleSubmit}>
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search videos, creators, AI tools..."
          className="w-full rounded-xl border bg-[var(--surface-elevated)] py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-brand-500/50 focus:outline-none"
          style={{ borderColor: "var(--border)" }}
          autoComplete="off"
        />
      </form>

      {open && suggestions && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border shadow-xl"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {suggestions.queries.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Trending
              </p>
              {suggestions.queries.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => goQuery(item)}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-[var(--surface-elevated)]"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          {suggestions.tools.length > 0 && (
            <div className="border-t p-2" style={{ borderColor: "var(--border)" }}>
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                AI tools
              </p>
              <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                {suggestions.tools.map((tool) => (
                  <Link
                    key={tool.value}
                    href={`/explore?tool=${tool.value}`}
                    onClick={() => setOpen(false)}
                    className="rounded-full px-3 py-1 text-xs"
                    style={{ background: "var(--chip-bg)" }}
                  >
                    {getAiToolLabel(tool.value)}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {suggestions.creators.length > 0 && (
            <div className="border-t p-2" style={{ borderColor: "var(--border)" }}>
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Creators
              </p>
              {suggestions.creators.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => goQuery(name)}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-[var(--surface-elevated)]"
                >
                  @{name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
