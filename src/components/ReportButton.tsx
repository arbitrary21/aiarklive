"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

interface ReportButtonProps {
  videoId: string;
}

export function ReportButton({ videoId }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, reason }),
      });
      if (res.ok) {
        setSent(true);
        setOpen(false);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-icon"
        title="Report"
      >
        <Flag className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="panel w-full max-w-md space-y-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-foreground">Report video</h3>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
            >
              <option value="spam">Spam or misleading</option>
              <option value="copyright">Copyright concern</option>
              <option value="nsfw">Inappropriate content</option>
              <option value="other">Other</option>
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={() => void submit()} disabled={busy} className="btn-secondary">
                {busy ? "Sending..." : "Submit report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {sent && (
        <p className="sr-only" role="status">
          Report submitted
        </p>
      )}
    </>
  );
}
