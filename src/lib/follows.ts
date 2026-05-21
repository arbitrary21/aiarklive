import { createClient } from "@/lib/supabase/server";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const mockFollows = new Set<string>();

function followKey(followerId: string, followingId: string) {
  return `${followerId}:${followingId}`;
}

export interface FollowStats {
  followers: number;
  following: number;
}

export async function getFollowStats(userId: string): Promise<FollowStats> {
  if (!isSupabaseConfigured()) {
    let followers = 0;
    let following = 0;
    for (const key of mockFollows) {
      const [follower, followingUser] = key.split(":");
      if (followingUser === userId) followers++;
      if (follower === userId) following++;
    }
    return { followers, following };
  }

  const supabase = await createClient();
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

export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  if (followerId === followingId) return false;

  if (!isSupabaseConfigured()) {
    return mockFollows.has(followKey(followerId, followingId));
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  return Boolean(data);
}

export async function followUser(
  followerId: string,
  followingId: string
): Promise<void> {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself.");
  }

  if (!isSupabaseConfigured()) {
    mockFollows.add(followKey(followerId, followingId));
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("follows").insert({
    follower_id: followerId,
    following_id: followingId,
  });

  if (error) throw error;
}

export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    mockFollows.delete(followKey(followerId, followingId));
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);

  if (error) throw error;
}

export async function getFollowerIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return Array.from(mockFollows)
      .filter((key) => key.endsWith(`:${userId}`))
      .map((key) => key.split(":")[0]!);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("following_id", userId);

  if (error || !data) return [];
  return data.map((row) => row.follower_id);
}

export async function getFollowingIds(followerId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return Array.from(mockFollows)
      .filter((key) => key.startsWith(`${followerId}:`))
      .map((key) => key.split(":")[1]!);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", followerId);

  if (error || !data) return [];
  return data.map((row) => row.following_id);
}
