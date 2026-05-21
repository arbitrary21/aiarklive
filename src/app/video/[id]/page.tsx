import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Heart } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import { VideoToolbar } from "@/components/VideoToolbar";
import { getAiToolLabel, getGenreLabel } from "@/lib/constants";
import { getSourceUrl } from "@/lib/youtube";
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

  const sourceUrl = getSourceUrl(
    video.platform,
    video.embed_url,
    video.source_url
  );
  const pageUrl = `https://aiarklive.com/video/${video.id}`;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <VideoToolbar
          videoId={video.id}
          title={video.title}
          platform={video.platform}
          sourceUrl={sourceUrl}
          pageUrl={pageUrl}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="panel overflow-hidden p-1">
            <VideoEmbed
              embedUrl={video.embed_url}
              platform={video.platform}
              title={video.title}
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              {video.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
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
            <p className="text-sm leading-relaxed text-muted">
              {video.description}
            </p>
          )}
        </div>

        <aside className="space-y-4">
          <div className="panel p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              크리에이터
            </h3>
            <Link
              href={`/profile/${video.user_id}`}
              className="flex items-center gap-3 transition hover:opacity-80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-bold text-white">
                {(video.user?.username ?? "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {video.user?.username ?? "Unknown"}
                </p>
                {video.user?.bio && (
                  <p className="text-xs text-muted line-clamp-2">
                    {video.user.bio}
                  </p>
                )}
              </div>
            </Link>
          </div>

          <div className="panel p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              AI 툴
            </h3>
            <div className="flex flex-wrap gap-2">
              {video.ai_tools.map((tool) => (
                <Link
                  key={tool}
                  href={`/explore?tool=${tool}`}
                  className="rounded-lg px-2.5 py-1 text-xs font-medium text-brand-300 transition hover:opacity-80"
                  style={{ background: "var(--chip-bg)" }}
                >
                  {getAiToolLabel(tool)}
                </Link>
              ))}
            </div>
          </div>

          {video.prompt && (
            <div className="panel p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-500">
                프롬프트
              </h3>
              <p className="whitespace-pre-wrap text-sm text-muted">
                {video.prompt}
              </p>
            </div>
          )}

          <p className="text-xs leading-relaxed text-muted">
            링크 영상은 썸네일 저장과 원본 플랫폼 이동만 지원합니다. 영상
            파일 다운로드는 Pro 직접 업로드(예정)에서 제공됩니다.
          </p>
        </aside>
      </div>
    </div>
  );
}
