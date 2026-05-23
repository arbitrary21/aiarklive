"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { EditVideoModal } from "@/components/video/EditVideoModal";
import type { Video } from "@/lib/types";

interface VideoOwnerActionsProps {
  video: Video;
  isOwner: boolean;
}

export function VideoOwnerActions({ video, isOwner }: VideoOwnerActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(video.title);

  if (!isOwner) return null;

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
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

      {editing && (
        <EditVideoModal
          video={{ ...video, title: displayTitle }}
          onClose={() => setEditing(false)}
          onSaved={(updated) => {
            setDisplayTitle(updated.title);
            setEditing(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
