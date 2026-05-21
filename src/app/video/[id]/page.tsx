import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Heart, Share2 } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import { getAiToolLabel, getGenreLabel } from "@/lib/constants";
import { getVideoById } from "@/lib/videos";

export const runtime = "edge";

interface VideoPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VideoPageProps) {
  const { id } = await params;
  const video = await getVideoById(id);
  return { title: video?.title ?? "영상" };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <VideoEmbed
          embedUrl={video.embed_url}
          platform={video.platform}
          title={video.title}
        />

        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {video.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {video.likes_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {video.views_count.toLocaleString()}
            </span>
            <span>{getGenreLabel(video.genre)}</span>
            <span>
              {new Date(video.created_at).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>

        {video.description && (
          <p className="text-muted">{video.description}</p>
        )}

        {video.prompt && (
          <div className="rounded-2xl border border-accent-500/20 bg-accent-500/5 p-6">
            <h3 className="mb-2 font-semibold text-accent-500">공개 프롬프트</h3>
            <p className="whitespace-pre-wrap text-sm text-muted">
              {video.prompt}
            </p>
          </div>
        )}
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-surface p-6">
          <h3 className="mb-4 font-semibold text-white">크리에이터</h3>
          <Link
            href={`/profile/${video.user_id}`}
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-bold text-white">
              {(video.user?.username ?? "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-white">
                {video.user?.username ?? "Unknown"}
              </p>
              {video.user?.bio && (
                <p className="text-sm text-muted line-clamp-2">
                  {video.user.bio}
                </p>
              )}
            </div>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface p-6">
          <h3 className="mb-4 font-semibold text-white">AI 툴</h3>
          <div className="flex flex-wrap gap-2">
            {video.ai_tools.map((tool) => (
              <Link
                key={tool}
                href={`/explore?tool=${tool}`}
                className="rounded-full bg-brand-500/20 px-3 py-1 text-sm text-brand-300 transition hover:bg-brand-500/30"
              >
                {getAiToolLabel(tool)}
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-muted transition hover:text-white"
        >
          <Share2 className="h-4 w-4" />
          공유하기
        </button>
      </aside>
    </div>
  );
}
