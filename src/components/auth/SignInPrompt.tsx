"use client";

import { useAuth } from "@/components/auth/AuthProvider";

export function SignInPrompt() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="panel py-16 text-center">
      <p className="text-muted">Sign in to see videos from creators you follow.</p>
      <button
        type="button"
        onClick={() => signInWithGoogle("/?sort=following")}
        className="mt-4 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Sign in with Google
      </button>
    </div>
  );
}
