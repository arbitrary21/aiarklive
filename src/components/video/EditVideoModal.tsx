"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { X } from "lucide-react";
import { AI_TOOLS, GENRES } from "@/lib/constants";
import type { AiTool, Genre, Video } from "@/lib/types";

export interface EditVideoModalHandle {
  open: () => void;
}

interface EditVideoModalProps {
  video: Video;
  onSaved: (video: Video) => void;
}

function editingStorageKey(videoId: string) {
  return `aiarklive:edit-video:${videoId}`;
}

const openByVideoId = new Map<string, boolean>();

function readInitialOpen(videoId: string) {
  if (typeof window === "undefined") return false;
  if (openByVideoId.get(videoId)) return true;
  return sessionStorage.getItem(editingStorageKey(videoId)) === "1";
}

export const EditVideoModal = forwardRef<EditVideoModalHandle, EditVideoModalProps>(
  function EditVideoModal({ video, onSaved }, ref) {
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const closePressRef = useRef(false);
    const hasOpenedRef = useRef(false);
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description ?? "");
    const [prompt, setPrompt] = useState(video.prompt ?? "");
    const [genre, setGenre] = useState<Genre>(video.genre);
    const [aiTools, setAiTools] = useState<AiTool[]>(video.ai_tools);
    const [aiGenerated, setAiGenerated] = useState(video.ai_disclosed);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setOpenPersist = useCallback(
      (next: boolean) => {
        openByVideoId.set(video.id, next);
        if (next) {
          hasOpenedRef.current = true;
          sessionStorage.setItem(editingStorageKey(video.id), "1");
        } else {
          sessionStorage.removeItem(editingStorageKey(video.id));
        }
        setOpen(next);
      },
      [video.id]
    );

    const closeModal = useCallback(() => {
      setOpenPersist(false);
    }, [setOpenPersist]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpenPersist(true),
      }),
      [setOpenPersist]
    );

    useEffect(() => {
      setMounted(true);
      if (readInitialOpen(video.id)) {
        hasOpenedRef.current = true;
        setOpenPersist(true);
      }
    }, [video.id, setOpenPersist]);

    useEffect(() => {
      if (!open) return;
      setTitle(video.title);
      setDescription(video.description ?? "");
      setPrompt(video.prompt ?? "");
      setGenre(video.genre);
      setAiTools(video.ai_tools);
      setAiGenerated(video.ai_disclosed);
    }, [open, video]);

    useEffect(() => {
      if (!open) return;

      document.body.style.overflow = "hidden";
      document.body.classList.add("edit-modal-open");

      const blockBackgroundInteraction = (e: Event) => {
        const target = e.target as Node | null;
        if (target && panelRef.current?.contains(target)) return;
        e.preventDefault();
        e.stopPropagation();
        if ("stopImmediatePropagation" in e) {
          e.stopImmediatePropagation();
        }
      };

      document.addEventListener("pointerdown", blockBackgroundInteraction, true);
      document.addEventListener("pointerup", blockBackgroundInteraction, true);
      document.addEventListener("mousedown", blockBackgroundInteraction, true);
      document.addEventListener("mouseup", blockBackgroundInteraction, true);
      document.addEventListener("click", blockBackgroundInteraction, true);

      return () => {
        document.body.style.overflow = "";
        document.body.classList.remove("edit-modal-open");
        document.removeEventListener("pointerdown", blockBackgroundInteraction, true);
        document.removeEventListener("pointerup", blockBackgroundInteraction, true);
        document.removeEventListener("mousedown", blockBackgroundInteraction, true);
        document.removeEventListener("mouseup", blockBackgroundInteraction, true);
        document.removeEventListener("click", blockBackgroundInteraction, true);
      };
    }, [open]);

    const handleTextFieldPointerDown = (
      e: React.PointerEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handleTextFieldPointerUp = (
      e: React.PointerEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      e.stopPropagation();
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    };

    const handleCloseButtonMouseDown = (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      e.stopPropagation();
      closePressRef.current = e.currentTarget === closeButtonRef.current;
    };

    const handleCloseButtonMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const shouldClose =
        closePressRef.current && e.currentTarget === closeButtonRef.current;
      closePressRef.current = false;
      if (shouldClose) closeModal();
    };

    const toggleTool = (tool: AiTool) => {
      setAiTools((prev) =>
        prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
      );
    };

    const handleSave = async () => {
      if (!title.trim()) {
        setError("Title is required.");
        return;
      }
      if (aiTools.length === 0) {
        setError("Select at least one AI tool.");
        return;
      }

      setSaving(true);
      setError(null);

      try {
        const res = await fetch(`/api/videos/${video.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            prompt: prompt.trim() || null,
            genre,
            ai_tools: aiTools,
            ai_generated: aiGenerated,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to update video.");
        }
        onSaved(data as Video);
        closeModal();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setSaving(false);
      }
    };

    if (!mounted || (!open && !hasOpenedRef.current)) return null;

    return createPortal(
      <div
        className={clsx(
          "fixed inset-0 z-[2147483646] flex items-center justify-center p-4",
          !open && "pointer-events-none invisible"
        )}
        style={{ background: "var(--overlay)" }}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-labelledby="edit-video-title"
      >
        <div
          ref={panelRef}
          className="panel max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 id="edit-video-title" className="text-lg font-semibold text-foreground">
              Edit video
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onMouseDown={handleCloseButtonMouseDown}
              onMouseUp={handleCloseButtonMouseUp}
              className="btn-icon"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onPointerDown={handleTextFieldPointerDown}
                onPointerUp={handleTextFieldPointerUp}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onPointerDown={handleTextFieldPointerDown}
                onPointerUp={handleTextFieldPointerUp}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre)}
                className="input-field"
              >
                {GENRES.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted">
                One primary genre for Explore filters. AI tools can be multiple.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-muted">
                AI tools
              </label>
              <div className="flex flex-wrap gap-2">
                {AI_TOOLS.map((tool) => (
                  <button
                    key={tool.value}
                    type="button"
                    onClick={() => toggleTool(tool.value)}
                    className={clsx(
                      aiTools.includes(tool.value) ? "chip-btn-active" : "chip-btn"
                    )}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onPointerDown={handleTextFieldPointerDown}
                onPointerUp={handleTextFieldPointerUp}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                rows={3}
                className="input-field resize-none"
                placeholder="Share your prompt (optional)"
              />
            </div>

            <label
              className="flex cursor-pointer items-start gap-3 rounded-xl border p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <input
                type="checkbox"
                checked={aiGenerated}
                onChange={(e) => setAiGenerated(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-purple-500"
              />
              <span className="text-sm text-muted">
                This content was created with AI tools (recommended to disclose).
              </span>
            </label>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

EditVideoModal.displayName = "EditVideoModal";
