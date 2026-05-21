"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createCallbackClient } from "@/lib/supabase/callback-client";
import {
  ensureUserProfileWithClient,
  getUsernameSetupStateWithClient,
} from "@/lib/auth-profile";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");
    const nextFromQuery = searchParams.get("next");
    const nextFromStorage =
      typeof window !== "undefined" ? sessionStorage.getItem("auth_next") : null;
    const next = safeNextPath(nextFromQuery ?? nextFromStorage);

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("auth_next");
    }

    if (oauthError || !code) {
      router.replace("/login?error=auth");
      return;
    }

    async function run() {
      const supabase = createCallbackClient();
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code!);

      if (exchangeError) {
        router.replace("/login?error=auth");
        return;
      }

      try {
        await ensureUserProfileWithClient(supabase);
        const setup = await getUsernameSetupStateWithClient(supabase);

        if (cancelled) return;

        if (setup?.needsSetup) {
          router.replace(`/welcome?next=${encodeURIComponent(next)}`);
          return;
        }

        router.replace(next);
      } catch {
        router.replace("/");
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted">Signing in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-muted">Signing in...</p>
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
