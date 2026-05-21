import { createClient } from "@/lib/supabase/server";
import { getFollowerIds } from "@/lib/follows";
import { getUserById } from "@/lib/videos";
import type { Notification } from "@/lib/types";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const mockNotifications: Notification[] = [];

export async function notifyFollowersOfNewVideo(
  actorId: string,
  videoId: string,
  videoTitle: string
): Promise<void> {
  const actor = await getUserById(actorId);
  const username = actor?.username ?? "A creator";
  const message = `${username} uploaded a new video: ${videoTitle}`;
  const followerIds = await getFollowerIds(actorId);

  if (followerIds.length === 0) return;

  if (!isSupabaseConfigured()) {
    const now = new Date().toISOString();
    for (const userId of followerIds) {
      mockNotifications.unshift({
        id: `notif-${Date.now()}-${userId}`,
        user_id: userId,
        type: "new_video",
        actor_id: actorId,
        video_id: videoId,
        message,
        read_at: null,
        created_at: now,
        actor: actor ?? undefined,
      });
    }
    return;
  }

  const supabase = await createClient();
  const rows = followerIds.map((userId) => ({
    user_id: userId,
    type: "new_video",
    actor_id: actorId,
    video_id: videoId,
    message,
  }));

  const { error } = await supabase.from("notifications").insert(rows);
  if (error) throw error;
}

export async function getNotifications(
  userId: string,
  limit = 20
): Promise<Notification[]> {
  if (!isSupabaseConfigured()) {
    return mockNotifications
      .filter((n) => n.user_id === userId)
      .slice(0, limit);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as Notification[];
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  if (!isSupabaseConfigured()) {
    return mockNotifications.filter(
      (n) => n.user_id === userId && !n.read_at
    ).length;
  }

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) return 0;
  return count ?? 0;
}

export async function markNotificationsRead(
  userId: string,
  ids?: string[]
): Promise<void> {
  const readAt = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    for (const notification of mockNotifications) {
      if (notification.user_id !== userId) continue;
      if (ids && !ids.includes(notification.id)) continue;
      notification.read_at = readAt;
    }
    return;
  }

  const supabase = await createClient();
  let query = supabase
    .from("notifications")
    .update({ read_at: readAt })
    .eq("user_id", userId)
    .is("read_at", null);

  if (ids?.length) {
    query = query.in("id", ids);
  }

  const { error } = await query;
  if (error) throw error;
}
