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
  if (error) throw error;
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
  if (error) throw error;
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
