"use client";

import { Bookmark, Heart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  isLocallyLiked,
  isLocallySaved,
  toggleLocalLike,
  toggleLocalSave,
} from "@/lib/local-interactions";
import { clsx } from "clsx";

interface VideoActionsProps {
  videoId: string;
  initialLikes: number;
  compact?: boolean;
}

export function VideoActions({
  videoId,
  initialLikes,
  compact = false,
}: VideoActionsProps) {
  const { user, configured } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    if (!user) {
      setLiked(isLocallyLiked(videoId));
      setSaved(isLocallySaved(videoId));
    }
  }, [user, videoId]);

  const toggleLike = useCallback(async () => {
    if (busy) return;
    setBusy(true);

    try {
      if (!user || !configured) {
        const next = toggleLocalLike(videoId);
        setLiked(next);
        setLikes((count) => Math.max(0, count + (next ? 1 : -1)));
        return;
      }

      const method = liked ? "DELETE" : "POST";
      const res = await fetch("/api/likes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      setLiked(!liked);
      if (typeof data.likesCount === "number") setLikes(data.likesCount);
    } catch {
      // keep UI state
    } finally {
      setBusy(false);
    }
  }, [busy, configured, liked, user, videoId]);

  const toggleSave = useCallback(async () => {
    if (busy) return;
    setBusy(true);

    try {
      if (!user || !configured) {
        setSaved(toggleLocalSave(videoId));
        return;
      }

      const method = saved ? "DELETE" : "POST";
      const res = await fetch("/api/saves", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      setSaved(!saved);
    } catch {
      // keep UI state
    } finally {
      setBusy(false);
    }
  }, [busy, configured, saved, user, videoId]);

  const btnClass = compact
    ? "rounded-lg p-1.5 backdrop-blur-sm transition hover:scale-105"
    : "btn-icon";

  return (
    <div className={clsx("flex items-center gap-1", compact && "gap-2")}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void toggleLike();
        }}
        disabled={busy}
        className={clsx(btnClass, liked && "text-red-400")}
        title={liked ? "Unlike" : "Like"}
        style={compact ? { background: "var(--chip-bg)" } : undefined}
      >
        <Heart className={clsx("h-4 w-4", liked && "fill-current")} />
      </button>
      {!compact && (
        <span className="text-xs text-muted">{likes.toLocaleString()}</span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void toggleSave();
        }}
        disabled={busy}
        className={clsx(btnClass, saved && "text-brand-300")}
        title={saved ? "Remove bookmark" : "Bookmark"}
        style={compact ? { background: "var(--chip-bg)" } : undefined}
      >
        <Bookmark className={clsx("h-4 w-4", saved && "fill-current")} />
      </button>
    </div>
  );
}
