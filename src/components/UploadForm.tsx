"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
      if (!res.ok) throw new Error(data.error ?? "메타데이터 조회 실패");
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description.slice(0, 500));
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aiTools.length === 0) {
      setError("AI 툴을 최소 1개 선택해주세요.");
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "등록 실패");
      router.push(`/video/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">1. 영상 링크</h2>
        <p className="text-sm text-muted">
          YouTube, TikTok, X 링크를 입력하세요. 저장 비용 $0 — 임베드 방식입니다.
        </p>
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            className="flex-1 rounded-xl border border-white/10 bg-surface px-4 py-3 text-white placeholder:text-muted focus:border-brand-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={fetchMetadata}
            disabled={loading || !url.trim()}
            className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/5 disabled:opacity-50"
          >
            정보 가져오기
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">2. AI 툴 태깅 (필수)</h2>
        <div className="flex flex-wrap gap-2">
          {AI_TOOLS.map((tool) => (
            <button
              key={tool.value}
              type="button"
              onClick={() => toggleTool(tool.value)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                aiTools.includes(tool.value)
                  ? "bg-accent-500 text-white"
                  : "bg-surface text-muted hover:text-white"
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">3. 장르</h2>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value as Genre)}
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-white focus:border-brand-500 focus:outline-none"
        >
          {GENRES.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">4. 상세 정보</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-white placeholder:text-muted focus:border-brand-500 focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명 (선택)"
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-white placeholder:text-muted focus:border-brand-500 focus:outline-none"
        />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="프롬프트 공개 (선택) — 커뮤니티와 공유해보세요"
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-white placeholder:text-muted focus:border-brand-500 focus:outline-none"
        />
      </section>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "등록 중..." : "영상 등록하기"}
      </button>
    </form>
  );
}
