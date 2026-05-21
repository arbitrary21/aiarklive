import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Heart, Users, Video } from "lucide-react";
import { FollowButton } from "@/components/auth/FollowButton";
import { VideoGrid } from "@/components/VideoGrid";
import { getCurrentUser } from "@/lib/auth";
import { isFollowing } from "@/lib/follows";
import { getUserById, getUserProfileStats, getVideos } from "@/lib/videos";

export const runtime = "edge";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = await getUserById(id);
  return { title: user?.username ?? "Profile" };
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Heart;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{ borderColor: "var(--border)", background: "var(--surface-elevated)" }}
    >
      <div className="flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const user = (await getUserById(id)) ?? (currentUser?.id === id ? currentUser : null);

  if (!user) notFound();

  const isOwnProfile = currentUser?.id === id;
  const [videos, stats, following] = await Promise.all([
    getVideos({ userId: id }),
    getUserProfileStats(id),
    currentUser && !isOwnProfile
      ? isFollowing(currentUser.id, id)
      : Promise.resolve(false),
  ]);

  return (
    <div className="space-y-8">
      <section className="panel flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={user.username}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-3xl font-bold text-foreground">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">{user.username}</h1>
            {user.bio && <p className="mt-2 max-w-xl text-muted">{user.bio}</p>}
            <p className="mt-3 text-sm text-muted">
              {stats.videoCount} videos · Joined{" "}
              {new Date(user.created_at).toLocaleDateString("en-US")}
            </p>
          </div>
        </div>

        {!isOwnProfile && (
          <FollowButton followingId={id} initialIsFollowing={following} />
        )}
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={Users}
          label="Followers"
          value={stats.followers.toLocaleString()}
        />
        <StatCard
          icon={Heart}
          label="Likes"
          value={stats.totalLikes.toLocaleString()}
        />
        <StatCard
          icon={Download}
          label="Downloads"
          value={stats.totalDownloads.toLocaleString()}
        />
        <StatCard
          icon={Video}
          label="Videos"
          value={stats.videoCount.toLocaleString()}
        />
      </div>

      <div>
        <h2 className="mb-6 text-xl font-semibold text-foreground">Videos</h2>
        <VideoGrid videos={videos} emptyMessage="No videos uploaded yet." />
      </div>

      {isOwnProfile && (
        <Link
          href="/upload"
          className="inline-block rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition hover:text-foreground"
        >
          + Add video
        </Link>
      )}
    </div>
  );
}
