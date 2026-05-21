"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const ALLOWED_PATHS = ["/welcome", "/login", "/auth/callback"];

export function UsernameSetupGate() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    if (ALLOWED_PATHS.some((path) => pathname.startsWith(path))) return;
    if (user.username_confirmed === false) {
      router.replace(`/welcome?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  return null;
}
