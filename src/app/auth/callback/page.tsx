"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  const finishedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");
    const nextFromQuery = searchParams.get("next");
    const nextFromStorage =
      typeof window !== "undefined" ? sessionStorage.getItem("auth_next") : null;
    const next = safeNextPath(nextFromQuery ?? nextFromStorage);

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("auth_next");
    }

    if (oauthError) {
      router.replace("/login?error=auth");
      return;
    }

    async function finishSignIn() {
      if (cancelled || finishedRef.current) return;

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.replace("/login?error=auth");
        return;
      }

      finishedRef.current = true;

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
        router.replace("/login?error=auth");
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        void finishSignIn();
      }
    });

    if (!code) {
      router.replace("/login?error=auth");
      return () => {
        cancelled = true;
        subscription.unsubscribe();
      };
    }

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        void finishSignIn();
        return;
      }

      window.setTimeout(() => {
        if (!cancelled && !finishedRef.current) {
          void finishSignIn();
        }
      }, 2500);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
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
