import { createClient } from "@/lib/supabase/server";
import type { Report } from "@/lib/types";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Persist a video abuse report to Supabase.
 *
 * Idempotent: if the same authenticated user reports the same video a second
 * time (unique_violation / pg error 23505), we silently return success so the
 * API response stays consistent with the first submission.
 *
 * Falls back to a transient in-memory object when Supabase is not configured
 * (local dev without env vars).
 */
export async function createReport(
  videoId: string,
  reason: string,
  userId: string | null
): Promise<Report> {
  if (!isSupabaseConfigured()) {
    return {
      id: `report-${Date.now()}`,
      video_id: videoId,
      user_id: userId,
      reason,
      status: "pending",
      created_at: new Date().toISOString(),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .insert({
      video_id: videoId,
      user_id: userId,
      reason: reason.slice(0, 500),
    })
    .select()
    .single();

  if (error) {
    // 23505 = unique_violation → authenticated user already reported this video
    if (error.code === "23505") {
      return {
        id: "duplicate",
        video_id: videoId,
        user_id: userId,
        reason,
        status: "pending",
        created_at: new Date().toISOString(),
      };
    }
    throw error;
  }

  return data as Report;
}
