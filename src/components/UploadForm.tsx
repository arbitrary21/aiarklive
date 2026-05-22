"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { AI_TOOLS, GENRES } from "@/lib/constants";
import type { AiTool, Genre } from "@/lib/types";

export function UploadForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState<Genre>("short-form");
  const [aiTools, setAiTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [licenseConfirmed, setLicenseConfirmed] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const toggleTool = (tool: AiTool) => {
    setAiTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const fetchMetadata = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/youtube/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch metadata");
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description.slice(0, 500));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseConfirmed) {
      setError("저작권 동의 체크박스를 확인해 주세요.");
      return;
    }
    if (aiTools.length === 0) {
      setError("Select at least one AI tool.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embed_url: url,
          title,
          description,
          ai_tools: aiTools,
          genre,
          prompt: prompt || undefined,
          license_confirmed: licenseConfirmed,
          ai_generated: aiGenerated,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login?next=/upload");
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      router.push(`/video/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel space-y-8 p-6 sm:p-8">
      {/* AI 생성 콘텐츠 면책 고지 배너 */}
      <div className="flex gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3">
        <span className="mt-0.5 shrink-0 text-purple-400">ℹ</span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-purple-300">AI 생성 콘텐츠 안내</p>
          <p className="text-xs leading-relaxed text-muted">
            AIARKLIVE는 Kling, Runway, PixVerse 등 제3자 AI 도구로 생성된 영상을 공유하는 플랫폼입니다.
            각 AI 도구의 이용약관에 따라 상업적 이용, 초상권, 저작권 귀속 조건이 다를 수 있습니다.
            업로더는 해당 콘텐츠에 대한 배포 권한을 직접 확인할 책임이 있으며, AIARKLIVE는
            제3자 AI 도구의 출력물에 대한 저작권·라이선스 분쟁에 대해 책임을 지지 않습니다.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="form-label">1. Video link</h2>
        <p className="text-sm text-muted">
          Paste a YouTube, TikTok, or X link. $0 storage — embed only.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={fetchMetadata}
            disabled={loading || !url.trim()}
            className="btn-secondary shrink-0"
          >
            Fetch info
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="form-label">2. AI tools (required)</h2>
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
      </section>

      <section className="space-y-4">
        <h2 className="form-label">3. Genre</h2>
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
      </section>

      <section className="space-y-4">
        <h2 className="form-label">4. Details</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="input-field"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
          className="input-field"
        />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Share your prompt (optional)"
          rows={3}
          className="input-field"
        />
      </section>

      {/* 저작권 동의 체크박스 섹션 */}
      <section className="space-y-3">
        <h2 className="form-label">5. 저작권 동의</h2>

        {/* 1-A: 필수 체크박스 */}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition hover:border-purple-500/40">
          <input
            type="checkbox"
            checked={licenseConfirmed}
            onChange={(e) => setLicenseConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-purple-500"
          />
          <span className="text-sm leading-relaxed text-foreground">
            <span className="font-medium text-purple-400">[필수]</span>{" "}
            저는 이 콘텐츠에 대한 저작권 또는 업로드 권한을 보유하고 있으며,
            AIARKLIVE 서비스 이용약관에 동의합니다.
          </span>
        </label>

        {/* 1-B: 권장 체크박스 */}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition hover:border-purple-500/40">
          <input
            type="checkbox"
            checked={aiGenerated}
            onChange={(e) => setAiGenerated(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-purple-500"
          />
          <span className="text-sm leading-relaxed text-muted">
            <span className="font-medium">[권장]</span>{" "}
            이 콘텐츠는 AI 도구(Kling, Runway, PixVerse 등)를 사용하여 생성되었습니다.
            사용한 AI 도구의 이용약관에 따라 배포 권한을 확인하였습니다.
          </span>
        </label>
      </section>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 [data-theme=dark]:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !licenseConfirmed}
        className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit video"}
      </button>
    </form>
  );
}
