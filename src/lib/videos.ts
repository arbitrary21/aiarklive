import { createClient } from "@/lib/supabase/server";
import { getFollowingIds, getFollowStats } from "@/lib/follows";
import { attachUsersToVideos, mockUsers, mockVideos } from "@/lib/mock-data";
import type {
  CreateVideoInput,
  UpdateVideoInput,
  User,
  UserProfileStats,
  Video,
  VideoFilters,
} from "@/lib/types";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const STARTER_KIT_TOOLS = ["kling", "runway", "pixverse"] as const;

function filterMockVideos(videos: Video[], filters: VideoFilters): Video[] {
  let result = [...videos];

  if (filters.collection === "tool-starter-kit") {
    result = result.filter((v) =>
      v.ai_tools.some((t) => STARTER_KIT_TOOLS.includes(t as (typeof STARTER_KIT_TOOLS)[number]))
    );
  }
  if (filters.tag) {
    const tag = filters.tag.toLowerCase();
    result = result.filter(
      (v) =>
        v.title.toLowerCase().includes(tag) ||
        v.description?.toLowerCase().includes(tag)
    );
  }
  if (filters.aiTool) {
    result = result.filter((v) => v.ai_tools.includes(filters.aiTool!));
  }
  if (filters.genre) {
    result = result.filter((v) => v.genre === filters.genre);
  }
  if (filters.userId) {
    result = result.filter((v) => v.user_id === filters.userId);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.ai_tools.some((t) => t.includes(q))
    );
  }

  switch (filters.sort) {
    case "popular":
      result.sort((a, b) => b.likes_count - a.likes_count);
      break;
    case "recommended":
      result.sort(
        (a, b) =>
          b.likes_count * 2 +
          b.views_count -
          (a.likes_count * 2 + a.views_count)
      );
      break;
    case "trending": {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      result = result.filter(
        (v) => new Date(v.created_at).getTime() >= sevenDaysAgo
      );
      result.sort((a, b) => b.likes_count - a.likes_count);
      break;
    }
    default:
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  const offset = filters.offset ?? 0;
  const limit = filters.limit;
  if (typeof limit === "number") {
    return result.slice(offset, offset + limit);
  }

  return result;
}

export async function getVideos(filters: VideoFilters = {}): Promise<Video[]> {
  if (!isSupabaseConfigured()) {
    let filtered = filterMockVideos(mockVideos, filters);
    if (filters.followingUserId) {
      const followingIds = await getFollowingIds(filters.followingUserId);
      if (followingIds.length === 0) return [];
      filtered = filtered.filter((v) => followingIds.includes(v.user_id));
    }
    return attachUsersToVideos(filtered, mockUsers);
  }

  const supabase = await createClient();
  let query = supabase
    .from("videos")
    .select("*, user:users(*)")
    .eq("is_nsfw", false);

  if (filters.aiTool) {
    query = query.contains("ai_tools", [filters.aiTool]);
  }
  if (filters.genre) {
    query = query.eq("genre", filters.genre);
  }
  if (filters.userId) {
    query = query.eq("user_id", filters.userId);
  }
  if (filters.followingUserId) {
    const followingIds = await getFollowingIds(filters.followingUserId);
    if (followingIds.length === 0) return [];
    query = query.in("user_id", followingIds);
  }
  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`
    );
  }
  if (filters.collection === "tool-starter-kit") {
    query = query.overlaps("ai_tools", ["kling", "runway", "pixverse"]);
  }
  if (filters.tag) {
    query = query.or(
      `title.ilike.%${filters.tag}%,description.ilike.%${filters.tag}%`
    );
  }

  switch (filters.sort) {
    case "popular":
      query = query.order("likes_count", { ascending: false });
      break;
    case "recommended":
      query = query.order("views_count", { ascending: false });
      break;
    case "trending": {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query
        .gte("created_at", sevenDaysAgo)
        .order("likes_count", { ascending: false });
      break;
    }
    default:
      query = query.order("created_at", { ascending: false });
  }

  const offset = filters.offset ?? 0;
  const limit = filters.limit;
  if (typeof limit === "number") {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;

  if (error || !data) {
    return attachUsersToVideos(filterMockVideos(mockVideos, filters), mockUsers);
  }

  return data as Video[];
}

export async function getVideoById(id: string): Promise<Video | null> {
  if (!isSupabaseConfigured()) {
    const video = mockVideos.find((v) => v.id === id);
    if (!video) return null;
    const [withUser] = attachUsersToVideos([video], mockUsers);
    return withUser;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*, user:users(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    const video = mockVideos.find((v) => v.id === id);
    if (!video) return null;
    const [withUser] = attachUsersToVideos([video], mockUsers);
    return withUser;
  }

  return data as Video;
}

export async function getUserById(id: string): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return mockUsers.find((u) => u.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return mockUsers.find((u) => u.id === id) ?? null;
  }

  return data as User;
}

export async function getTopCreators(limit = 10): Promise<
  (User & { video_count: number; total_likes: number })[]
> {
  const videos = await getVideos({ sort: "popular" });
  const stats = new Map<string, { video_count: number; total_likes: number }>();

  for (const video of videos) {
    const current = stats.get(video.user_id) ?? {
      video_count: 0,
      total_likes: 0,
    };
    stats.set(video.user_id, {
      video_count: current.video_count + 1,
      total_likes: current.total_likes + video.likes_count,
    });
  }

  const users = isSupabaseConfigured()
    ? (await Promise.all(
        Array.from(stats.keys()).map((id) => getUserById(id))
      )).filter(Boolean) as User[]
    : mockUsers;

  return users
    .map((user) => ({
      ...user,
      video_count: stats.get(user.id)?.video_count ?? 0,
      total_likes: stats.get(user.id)?.total_likes ?? 0,
    }))
    .sort((a, b) => b.total_likes - a.total_likes)
    .slice(0, limit);
}

export async function createVideo(
  input: CreateVideoInput,
  userId?: string
): Promise<Video> {
  if (!isSupabaseConfigured()) {
    const newVideo: Video = {
      id: `vid-${Date.now()}`,
      user_id: userId ?? "user-1",
      title: input.title,
      description: input.description ?? null,
      embed_url: input.embed_url,
      source_url: input.source_url ?? null,
      platform: input.platform,
      thumbnail_url: input.thumbnail_url,
      ai_tools: input.ai_tools,
      ai_tool: input.ai_tool ?? input.ai_tools[0] ?? null,
      ai_disclosed: input.ai_disclosed ?? false,
      genre: input.genre,
      prompt: input.prompt ?? null,
      likes_count: 0,
      views_count: 0,
      downloads_count: 0,
      is_nsfw: false,
      created_at: new Date().toISOString(),
    };
    mockVideos.unshift(newVideo);
    return newVideo;
  }

  if (!userId) {
    throw new Error("Sign in required to upload videos.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .insert({
      ...input,
      ai_tool: input.ai_tool ?? input.ai_tools[0] ?? null,
      ai_disclosed: input.ai_disclosed ?? false,
      user_id: userId,
      likes_count: 0,
      views_count: 0,
      downloads_count: 0,
      is_nsfw: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Video;
}

export async function getUserProfileStats(
  userId: string
): Promise<UserProfileStats> {
  const [videos, followStats] = await Promise.all([
    getVideos({ userId }),
    getFollowStats(userId),
  ]);

  return {
    videoCount: videos.length,
    followers: followStats.followers,
    following: followStats.following,
    totalLikes: videos.reduce((sum, video) => sum + video.likes_count, 0),
    totalDownloads: videos.reduce(
      (sum, video) => sum + (video.downloads_count ?? 0),
      0
    ),
  };
}

export async function updateVideo(
  videoId: string,
  userId: string,
  input: UpdateVideoInput
): Promise<Video> {
  const title = input.title?.trim();
  if (title !== undefined && !title) {
    throw new Error("Title is required.");
  }
  if (input.ai_tools !== undefined && input.ai_tools.length === 0) {
    throw new Error("Select at least one AI tool.");
  }

  const patch: Record<string, unknown> = {};
  if (title !== undefined) patch.title = title;
  if (input.description !== undefined) patch.description = input.description;
  if (input.genre !== undefined) patch.genre = input.genre;
  if (input.prompt !== undefined) patch.prompt = input.prompt;
  if (input.ai_disclosed !== undefined) patch.ai_disclosed = input.ai_disclosed;
  if (input.ai_tools !== undefined) {
    patch.ai_tools = input.ai_tools;
    patch.ai_tool = input.ai_tools[0] ?? null;
  }

  if (Object.keys(patch).length === 0) {
    throw new Error("No fields to update.");
  }

  if (!isSupabaseConfigured()) {
    const video = mockVideos.find((v) => v.id === videoId);
    if (!video) throw new Error("Video not found.");
    if (video.user_id !== userId) throw new Error("Not allowed.");
    Object.assign(video, patch);
    return video;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .update(patch)
    .eq("id", videoId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Video not found.");
  return data as Video;
}

export async function incrementVideoDownloads(videoId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const video = mockVideos.find((v) => v.id === videoId);
    if (video) video.downloads_count = (video.downloads_count ?? 0) + 1;
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_video_downloads", {
    video_id: videoId,
  });

  if (error) throw error;
}
