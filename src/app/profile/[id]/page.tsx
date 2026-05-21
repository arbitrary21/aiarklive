import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoGrid } from "@/components/VideoGrid";
import { getUserById, getVideos } from "@/lib/videos";

export const runtime = "edge";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = await getUserById(id);
  return { title: user?.username ?? "Profile" };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) notFound();

  const videos = await getVideos({ userId: id });

  return (
    <div className="space-y-8">
      <section className="panel flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-3xl font-bold text-foreground">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{user.username}</h1>
          {user.bio && <p className="mt-2 max-w-xl text-muted">{user.bio}</p>}
          <p className="mt-3 text-sm text-muted">
            {videos.length} videos · Joined{" "}
            {new Date(user.created_at).toLocaleDateString("en-US")}
          </p>
        </div>
      </section>

      <div>
        <h2 className="mb-6 text-xl font-semibold text-foreground">Portfolio</h2>
        <VideoGrid videos={videos} emptyMessage="No videos uploaded yet." />
      </div>

      <Link
        href="/upload"
        className="inline-block rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition hover:text-foreground"
      >
        + Add video
      </Link>
    </div>
  );
}
