"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Comment } from "@/lib/types";

interface CommentSectionProps {
  videoId: string;
}

export function CommentSection({ videoId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/comments?videoId=${encodeURIComponent(videoId)}`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [videoId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      setComments((current) => [data, ...current]);
      setContent("");
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel space-y-4 p-4">
      <h2 className="text-sm font-semibold text-foreground">
        Comments ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share feedback on the prompt or technique..."
            rows={3}
            className="input-field resize-none"
          />
          <button type="submit" disabled={submitting} className="btn-secondary">
            {submitting ? "Posting..." : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted">
          <Link href="/login" className="text-brand-300 hover:underline">
            Sign in
          </Link>{" "}
          to join the discussion.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted">No comments yet. Be the first.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-xl border p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2 text-xs text-muted">
                <Link
                  href={`/profile/${comment.user_id}`}
                  className="font-medium text-foreground hover:text-brand-300"
                >
                  {comment.user?.username ?? "Creator"}
                </Link>
                <span>
                  {new Date(comment.created_at).toLocaleDateString("en-US")}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
