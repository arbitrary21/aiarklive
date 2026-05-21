"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

interface FollowButtonProps {
  followingId: string;
  initialIsFollowing: boolean;
}

export function FollowButton({
  followingId,
  initialIsFollowing,
}: FollowButtonProps) {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    if (!user) {
      await signInWithGoogle(`/profile/${followingId}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId }),
      });

      if (res.status === 401) {
        await signInWithGoogle(`/profile/${followingId}`);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update follow status");
      }

      setIsFollowing((v) => !v);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={loading}
      className={
        isFollowing
          ? "rounded-xl border px-4 py-2 text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-50"
          : "rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      }
      style={isFollowing ? { borderColor: "var(--border)" } : undefined}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
