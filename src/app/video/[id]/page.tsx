import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Eye, Heart } from "lucide-react";
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
  return { title: video?.title ?? "Video" };
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
          likesCount={video.likes_count}
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
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {(video.downloads_count ?? 0).toLocaleString()}
              </span>
              <span>{getGenreLabel(video.genre)}</span>
              <span>
                {new Date(video.created_at).toLocaleDateString("en-US")}
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
              Creator
            </h3>
            <Link
              href={`/profile/${video.user_id}`}
              className="flex items-center gap-3 transition hover:opacity-80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-bold text-white">
                {(video.user?.username ?? "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <Link
                  href={`/profile/${video.user_id}`}
                  className="font-medium text-foreground transition hover:text-brand-300"
                >
                  {video.user?.username ?? "Unknown"}
                </Link>
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
              AI tools
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
                Prompt
              </h3>
              <p className="whitespace-pre-wrap text-sm text-muted">
                {video.prompt}
              </p>
            </div>
          )}

          <p className="text-xs leading-relaxed text-muted">
            Linked videos support thumbnail download and opening the source
            platform only. Full video file download will be available with Pro
            direct upload (coming soon).
          </p>
        </aside>
      </div>
    </div>
  );
}
