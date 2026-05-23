"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import {
  EditVideoModal,
  type EditVideoModalHandle,
} from "@/components/video/EditVideoModal";
import type { Video } from "@/lib/types";

interface VideoOwnerActionsProps {
  video: Video;
  isOwner: boolean;
}

export function VideoOwnerActions({ video, isOwner }: VideoOwnerActionsProps) {
  const router = useRouter();
  const modalRef = useRef<EditVideoModalHandle>(null);
  const [displayTitle, setDisplayTitle] = useState(video.title);

  if (!isOwner) return null;

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => modalRef.current?.open()}
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
        ref={modalRef}
        video={{ ...video, title: displayTitle }}
        onSaved={(updated) => {
          setDisplayTitle(updated.title);
          router.refresh();
        }}
      />
    </>
  );
}
