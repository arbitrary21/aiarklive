"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  ProfileLoadingState,
  ProfileView,
} from "@/components/profile/ProfileView";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { createClient } from "@/lib/supabase/client";
import type { User, UserProfileStats, Video } from "@/lib/types";

interface ProfilePageClientProps {
  profileId: string;
}

async function fetchFollowStats(userId: string): Promise<Pick<UserProfileStats, "followers" | "following">> {
  const supabase = createClient();
  const [followersRes, followingRes] = await Promise.all([
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("follower_id", userId),
  ]);

  return {
    followers: followersRes.count ?? 0,
    following: followingRes.count ?? 0,
  };
}

async function fetchIsFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  if (followerId === followingId) return false;

  const supabase = createClient();
  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  return Boolean(data);
}

export function ProfilePageClient({ profileId }: ProfilePageClientProps) {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [stats, setStats] = useState<UserProfileStats | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setNotFound(false);

      try {
        const supabase = createClient();
        const isOwnProfile = authUser?.id === profileId;

        if (isOwnProfile) {
          await fetch("/api/profile/ensure", { method: "POST" });
        }

        const { data: dbUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", profileId)
          .maybeSingle();

        const resolvedUser =
          (dbUser as User | null) ??
          (isOwnProfile && authUser ? authUser : null);

        if (!resolvedUser) {
          if (!cancelled) {
            setNotFound(true);
            setUser(null);
          }
          return;
        }

        const [videosRes, followStats, following] = await Promise.all([
          fetch(`/api/videos?userId=${encodeURIComponent(profileId)}`),
          fetchFollowStats(profileId),
          authUser && authUser.id !== profileId
            ? fetchIsFollowing(authUser.id, profileId)
            : Promise.resolve(false),
        ]);

        const loadedVideos = (await videosRes.json()) as Video[];
        const totalLikes = loadedVideos.reduce(
          (sum, video) => sum + video.likes_count,
          0
        );
        const totalDownloads = loadedVideos.reduce(
          (sum, video) => sum + (video.downloads_count ?? 0),
          0
        );

        if (!cancelled) {
          setUser(resolvedUser);
          setVideos(loadedVideos);
          setStats({
            videoCount: loadedVideos.length,
            followers: followStats.followers,
            following: followStats.following,
            totalLikes,
            totalDownloads,
          });
          setIsFollowing(following);
        }
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (!authLoading) {
      loadProfile();
    }

    return () => {
      cancelled = true;
    };
  }, [authLoading, authUser, profileId]);

  if (authLoading || loading) {
    return <ProfileLoadingState />;
  }

  if (notFound || !user || !stats) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-6xl font-bold text-foreground">404</p>
        <p className="mt-4 text-muted">Profile not found.</p>
        <Link
          href="/"
          className="mt-8 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const isOwnProfile = authUser?.id === profileId;

  return (
    <>
      <ProfileView
        user={user}
        videos={videos}
        stats={stats}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onEdit={isOwnProfile ? () => setEditOpen(true) : undefined}
      />
      {editOpen && isOwnProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSaved={(updates) => setUser((prev) => prev ? { ...prev, ...updates } : prev)}
        />
      )}
    </>
  );
}
