"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { normalizeUsername, validateUsername } from "@/lib/username";

interface UsernameSetupFormProps {
  suggestedUsername: string;
  nextPath: string;
}

export function UsernameSetupForm({
  suggestedUsername,
  nextPath,
}: UsernameSetupFormProps) {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [username, setUsername] = useState(suggestedUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitUsername = async (value: string) => {
    const validationError = validateUsername(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalizeUsername(value) }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save nickname.");
      }

      await refreshProfile();
      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitUsername(username);
  };

  const handleUseSuggested = async () => {
    setUsername(suggestedUsername);
    setError("");
    await submitUsername(suggestedUsername);
  };

  return (
    <form onSubmit={handleSubmit} className="panel mx-auto w-full max-w-md space-y-6 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Choose your nickname</h1>
        <p className="mt-3 text-sm text-muted">
          We suggested{" "}
          <span className="font-semibold text-foreground">{suggestedUsername}</span>{" "}
          from your Google account.
        </p>
        <p className="mt-1 text-sm text-muted">
          Would you like to use this nickname?
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-foreground">
          Nickname
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          onBlur={(e) => {
            setUsername(normalizeUsername(e.target.value));
          }}
          autoComplete="username"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="input-field"
          placeholder="your_nickname"
        />
        <p className="text-xs text-muted">
          Letters, numbers, and underscores only. You can change this later.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleUseSuggested}
          disabled={loading}
          className="rounded-xl border px-4 py-3 text-sm font-medium text-foreground transition hover:bg-[var(--surface-elevated)] disabled:opacity-50"
          style={{ borderColor: "var(--border)" }}
        >
          Yes, use {suggestedUsername}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue with this nickname"}
        </button>
      </div>
    </form>
  );
}
