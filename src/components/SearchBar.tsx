"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/explore?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search videos, creators, AI tools..."
        className="w-full rounded-xl border bg-[var(--surface-elevated)] py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-brand-500/50 focus:outline-none"
        style={{ borderColor: "var(--border)" }}
      />
    </form>
  );
}
