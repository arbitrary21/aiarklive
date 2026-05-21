import { createClient } from "@/lib/supabase/server";
import { mockComments, mockUsers } from "@/lib/mock-data";
import type { Comment } from "@/lib/types";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function attachUsers(comments: Comment[]): Comment[] {
  return comments.map((comment) => ({
    ...comment,
    user: mockUsers.find((user) => user.id === comment.user_id),
  }));
}

export async function getComments(videoId: string): Promise<Comment[]> {
  if (!isSupabaseConfigured()) {
    return attachUsers(mockComments.filter((comment) => comment.video_id === videoId));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*, user:users(*)")
    .eq("video_id", videoId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return attachUsers(mockComments.filter((comment) => comment.video_id === videoId));
  }

  return data as Comment[];
}

export async function createComment(
  videoId: string,
  userId: string,
  content: string
): Promise<Comment> {
  const trimmed = content.trim();
  if (!trimmed) throw new Error("Comment cannot be empty.");

  if (!isSupabaseConfigured()) {
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      video_id: videoId,
      user_id: userId,
      content: trimmed,
      created_at: new Date().toISOString(),
    };
    mockComments.unshift(comment);
    const [withUser] = attachUsers([comment]);
    return withUser;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({ video_id: videoId, user_id: userId, content: trimmed })
    .select("*, user:users(*)")
    .single();

  if (error) throw error;
  return data as Comment;
}
