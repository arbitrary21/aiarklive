"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { EditVideoModal } from "@/components/video/EditVideoModal";
import type { Video } from "@/lib/types";

interface VideoOwnerActionsProps {
  video: Video;
  isOwner: boolean;
}

function editingStorageKey(videoId: string) {
  return `aiarklive:edit-video:${videoId}`;
}

export function VideoOwnerActions({ video, isOwner }: VideoOwnerActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(video.title);

  useEffect(() => {
    if (sessionStorage.getItem(editingStorageKey(video.id)) === "1") {
      setEditing(true);
    }
  }, [video.id]);

  const openEdit = () => {
    sessionStorage.setItem(editingStorageKey(video.id), "1");
    setEditing(true);
  };

  const closeEdit = () => {
    sessionStorage.removeItem(editingStorageKey(video.id));
    setEditing(false);
  };

  if (!isOwner) return null;

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={openEdit}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-[var(--surface-elevated)]"
          style={{ borderColor: "var(--border)" }}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>

      <h1 className="text-xl font-bold text-foreground sm:text-2xl">
        {displayTitle}
      </h1>

      <EditVideoModal
        video={{ ...video, title: displayTitle }}
        open={editing}
        onClose={closeEdit}
        onSaved={(updated) => {
          setDisplayTitle(updated.title);
          closeEdit();
          router.refresh();
        }}
      />
    </>
  );
}
