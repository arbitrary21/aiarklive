import { createClient } from "@/lib/supabase/server";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export interface VideoInteractionState {
  liked: boolean;
  saved: boolean;
  likesCount: number;
}

async function adjustLikesCount(videoId: string, delta: number): Promise<number> {
  const supabase = await createClient();

  // Prefer atomic DB-level increment/decrement (migration add_likes_count_functions.sql).
  // Falls back to a non-atomic read-modify-write if that migration has not been applied yet,
  // so the code is safe to deploy ahead of the SQL being run.
  const fn = delta > 0 ? "increment_video_likes" : "decrement_video_likes";
  const { data: rpcCount, error: rpcErr } = await supabase.rpc(fn, { vid: videoId });
  if (!rpcErr) return (rpcCount as number) ?? 0;

  // Fallback (non-atomic): acceptable for low-traffic until migration is applied.
  const { data: video } = await supabase
    .from("videos")
    .select("likes_count")
    .eq("id", videoId)
    .single();
  const next = Math.max(0, (video?.likes_count ?? 0) + delta);
  await supabase.from("videos").update({ likes_count: next }).eq("id", videoId);
  return next;
}

export async function getVideoInteractionState(
  userId: string | null,
  videoId: string
): Promise<VideoInteractionState> {
  if (!isSupabaseConfigured() || !userId) {
    return { liked: false, saved: false, likesCount: 0 };
  }

  const supabase = await createClient();
  const [{ data: like }, { data: save }, { data: video }] = await Promise.all([
    supabase
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("video_id", videoId)
      .maybeSingle(),
    supabase
      .from("saves")
      .select("id")
      .eq("user_id", userId)
      .eq("video_id", videoId)
      .maybeSingle(),
    supabase.from("videos").select("likes_count").eq("id", videoId).maybeSingle(),
  ]);

  return {
    liked: Boolean(like),
    saved: Boolean(save),
    likesCount: video?.likes_count ?? 0,
  };
}

export async function likeVideo(userId: string, videoId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { error } = await supabase.from("likes").insert({ user_id: userId, video_id: videoId });
  if (error) {
    // 23505 = unique_violation: already liked — return current count without incrementing.
    if (error.code === "23505") {
      const { data: video } = await supabase
        .from("videos")
        .select("likes_count")
        .eq("id", videoId)
        .maybeSingle();
      return video?.likes_count ?? 0;
    }
    throw error;
  }
  return adjustLikesCount(videoId, 1);
}

export async function unlikeVideo(userId: string, videoId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("video_id", videoId);
  if (error) throw error;
  return adjustLikesCount(videoId, -1);
}

export async function saveVideo(userId: string, videoId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  const { error } = await supabase.from("saves").insert({ user_id: userId, video_id: videoId });
  if (error) {
    // 23505 = unique_violation: already saved — treat as success (idempotent).
    if (error.code === "23505") return;
    throw error;
  }
}

export async function unsaveVideo(userId: string, videoId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("saves")
    .delete()
    .eq("user_id", userId)
    .eq("video_id", videoId);
  if (error) throw error;
}

export async function getSavedVideoIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("saves")
    .select("video_id")
    .eq("user_id", userId);

  return (data ?? []).map((row) => row.video_id);
}
