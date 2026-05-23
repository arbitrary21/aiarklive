"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { X } from "lucide-react";
import { AI_TOOLS, GENRES } from "@/lib/constants";
import type { AiTool, Genre, Video } from "@/lib/types";

interface EditVideoModalProps {
  video: Video;
  onClose: () => void;
  onSaved: (video: Video) => void;
}

function isTextField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

export function EditVideoModal({ video, onClose, onSaved }: EditVideoModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const selectionDragRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description ?? "");
  const [prompt, setPrompt] = useState(video.prompt ?? "");
  const [genre, setGenre] = useState<Genre>(video.genre);
  const [aiTools, setAiTools] = useState<AiTool[]>(video.ai_tools);
  const [aiGenerated, setAiGenerated] = useState(video.ai_disclosed);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const appRoot = document.querySelector<HTMLElement>(".flex.min-h-screen");
    appRoot?.setAttribute("inert", "");

    return () => {
      document.body.style.overflow = previousOverflow;
      appRoot?.removeAttribute("inert");
    };
  }, []);

  useEffect(() => {
    const markSelectionStart = (e: Event) => {
      if (panelRef.current?.contains(e.target as Node) && isTextField(e.target)) {
        selectionDragRef.current = true;
      }
    };

    const swallowOutsideRelease = (e: Event) => {
      if (!selectionDragRef.current) return;

      const target = e.target as Node | null;
      if (target && panelRef.current?.contains(target)) {
        selectionDragRef.current = false;
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (e.type === "mouseup" || e.type === "pointerup" || e.type === "click") {
        selectionDragRef.current = false;
      }
    };

    document.addEventListener("pointerdown", markSelectionStart, true);
    document.addEventListener("mousedown", markSelectionStart, true);
    document.addEventListener("pointerup", swallowOutsideRelease, true);
    document.addEventListener("mouseup", swallowOutsideRelease, true);
    document.addEventListener("click", swallowOutsideRelease, true);

    return () => {
      document.removeEventListener("pointerdown", markSelectionStart, true);
      document.removeEventListener("mousedown", markSelectionStart, true);
      document.removeEventListener("pointerup", swallowOutsideRelease, true);
      document.removeEventListener("mouseup", swallowOutsideRelease, true);
      document.removeEventListener("click", swallowOutsideRelease, true);
    };
  }, []);

  const toggleTool = (tool: AiTool) => {
    setAiTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handlePanelPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isTextField(e.target)) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePanelPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    selectionDragRef.current = false;
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
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "var(--overlay)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-video-title"
      onMouseUp={(e) => {
        if (panelRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        if (panelRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        ref={panelRef}
        className="panel max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
        onPointerDown={handlePanelPointerDown}
        onPointerUp={handlePanelPointerUp}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="edit-video-title" className="text-lg font-semibold text-foreground">
            Edit video
          </h2>
          <button
            type="button"
            onClick={onClose}
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
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
