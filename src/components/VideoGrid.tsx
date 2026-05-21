import { VideoCard } from "./VideoCard";
import type { Video } from "@/lib/types";

interface VideoGridProps {
  videos: Video[];
  emptyMessage?: string;
}

export function VideoGrid({
  videos,
  emptyMessage = "표시할 영상이 없습니다.",
}: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="panel flex min-h-[40vh] items-center justify-center border-dashed">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
