import Link from "next/link";
import { Heart, Pencil, Users, Video } from "lucide-react";
import { FollowButton } from "@/components/auth/FollowButton";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import type { User, UserProfileStats, Video as VideoType } from "@/lib/types";

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

interface ProfileViewProps {
  user: User;
  videos: VideoType[];
  stats: UserProfileStats;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onEdit?: () => void;
}

export function ProfileView({
  user,
  videos,
  stats,
  isOwnProfile,
  isFollowing,
  onEdit,
}: ProfileViewProps) {
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
            {user.youtube_channel_id && user.youtube_channel_title && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-200">
                <span aria-hidden>▶</span>
                {user.youtube_channel_title}
              </p>
            )}
            {user.bio && <p className="mt-2 max-w-xl text-muted">{user.bio}</p>}
            <p className="mt-3 text-sm text-muted">
              {stats.videoCount} videos · Joined{" "}
              {new Date(user.created_at).toLocaleDateString("en-US")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isOwnProfile && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm text-muted transition hover:text-foreground"
              style={{ borderColor: "var(--border)" }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit profile
            </button>
          )}
          {!isOwnProfile && (
            <FollowButton followingId={user.id} initialIsFollowing={isFollowing} />
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
          icon={Video}
          label="Videos"
          value={stats.videoCount.toLocaleString()}
        />
      </div>

      <ProfileTabs videos={videos} isOwnProfile={isOwnProfile} />

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

export function ProfileLoadingState() {
  return (
    <div className="space-y-8">
      <div className="panel h-40 animate-pulse p-8" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-[var(--surface-elevated)]" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="aspect-video animate-pulse rounded-xl bg-[var(--surface-elevated)]" />
        ))}
      </div>
    </div>
  );
}
