import { VideoCard } from "./VideoCard";
import type { Video } from "@/lib/types";

interface VideoGridProps {
  videos: Video[];
  emptyMessage?: string;
}

export function VideoGrid({
  videos,
  emptyMessage = "No videos to display.",
}: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="panel flex min-h-[40vh] items-center justify-center border-dashed">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {videos.map((video) => (
        <div key={video.id} className="masonry-item">
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
}
