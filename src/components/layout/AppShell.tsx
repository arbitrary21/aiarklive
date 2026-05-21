"use client";

import { SearchBar } from "@/components/SearchBar";
import { CreateMenu } from "@/components/CreateMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MobileNav, Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">
        <header
          className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/90 px-4 backdrop-blur-md sm:px-6"
          style={{ borderColor: "var(--border)" }}
        >
          <SearchBar />
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <CreateMenu />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
