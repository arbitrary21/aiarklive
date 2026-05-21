"use client";

import { useState } from "react";
import { VideoGrid } from "@/components/VideoGrid";
import type { Video } from "@/lib/types";

interface ProfileTabsProps {
  videos: Video[];
  isOwnProfile: boolean;
}

export function ProfileTabs({ videos, isOwnProfile }: ProfileTabsProps) {
  const [tab, setTab] = useState<"videos" | "saved">("videos");
  const [savedVideos, setSavedVideos] = useState<Video[]>([]);
  const [loadedSaved, setLoadedSaved] = useState(false);

  async function loadSaved() {
    if (loadedSaved) return;
    const res = await fetch("/api/saves/list");
    if (res.ok) {
      setSavedVideos(await res.json());
    }
    setLoadedSaved(true);
  }

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("videos")}
          className={tab === "videos" ? "chip-btn-active" : "chip-btn"}
        >
          Videos
        </button>
        {isOwnProfile && (
          <button
            type="button"
            onClick={() => {
              setTab("saved");
              void loadSaved();
            }}
            className={tab === "saved" ? "chip-btn-active" : "chip-btn"}
          >
            Saved
          </button>
        )}
      </div>

      {tab === "videos" ? (
        <VideoGrid videos={videos} emptyMessage="No videos uploaded yet." />
      ) : (
        <VideoGrid videos={savedVideos} emptyMessage="No saved videos yet." />
      )}
    </div>
  );
}
