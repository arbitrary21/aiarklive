import { createClient } from "@/lib/supabase/server";
import { attachUsersToVideos, mockUsers, mockVideos } from "@/lib/mock-data";
import type { CreateVideoInput, User, Video, VideoFilters } from "@/lib/types";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function filterMockVideos(videos: Video[], filters: VideoFilters): Video[] {
  let result = [...videos];

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
    default:
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  return result;
}

export async function getVideos(filters: VideoFilters = {}): Promise<Video[]> {
  if (!isSupabaseConfigured()) {
    return attachUsersToVideos(filterMockVideos(mockVideos, filters), mockUsers);
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
  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`
    );
  }

  switch (filters.sort) {
    case "popular":
      query = query.order("likes_count", { ascending: false });
      break;
    case "recommended":
      query = query.order("views_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
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
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
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
      genre: input.genre,
      prompt: input.prompt ?? null,
      likes_count: 0,
      views_count: 0,
      is_nsfw: false,
      created_at: new Date().toISOString(),
    };
    mockVideos.unshift(newVideo);
    return newVideo;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .insert({
      ...input,
      user_id: userId,
      likes_count: 0,
      views_count: 0,
      is_nsfw: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Video;
}
