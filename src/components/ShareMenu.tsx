"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ShareMenuProps {
  title: string;
  url: string;
}

export function ShareMenu({ title, url }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
      setOpen(false);
    } else {
      await copyUrl();
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn-icon"
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border py-2 shadow-xl"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          <p className="px-4 pb-2 text-xs font-medium text-muted">Share</p>
          <button
            type="button"
            onClick={copyUrl}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition hover:bg-[var(--surface-elevated)]"
          >
            {copied ? (
              <Check className="h-4 w-4 text-accent-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy link"}
          </button>
          {canShare && (
            <button
              type="button"
              onClick={nativeShare}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition hover:bg-[var(--surface-elevated)]"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          )}
        </div>
      )}
    </div>
  );
}
