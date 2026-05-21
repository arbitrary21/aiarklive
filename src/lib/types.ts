export type Platform = "youtube" | "tiktok" | "x";

export type Genre =
  | "short-film"
  | "ad"
  | "music-video"
  | "short-form"
  | "experimental"
  | "animation"
  | "loop";

export type AiTool =
  | "kling"
  | "runway"
  | "pika"
  | "suno"
  | "grok"
  | "veo"
  | "hailuo"
  | "ltx-video"
  | "wan"
  | "pixverse"
  | "other";

export type FeedSort = "latest" | "popular" | "recommended" | "following";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  username_confirmed?: boolean;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  embed_url: string;
  source_url: string | null;
  platform: Platform;
  thumbnail_url: string;
  ai_tools: AiTool[];
  genre: Genre;
  prompt: string | null;
  likes_count: number;
  views_count: number;
  downloads_count: number;
  is_nsfw: boolean;
  created_at: string;
  user?: User;
}

export interface VideoFilters {
  aiTool?: AiTool;
  genre?: Genre;
  sort?: FeedSort;
  userId?: string;
  followingUserId?: string;
  q?: string;
}

export interface CreateVideoInput {
  embed_url: string;
  source_url?: string;
  title: string;
  description?: string;
  platform: Platform;
  thumbnail_url: string;
  ai_tools: AiTool[];
  genre: Genre;
  prompt?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "new_video";
  actor_id: string;
  video_id: string | null;
  message: string;
  read_at: string | null;
  created_at: string;
  actor?: User;
}

export interface UserProfileStats {
  videoCount: number;
  followers: number;
  following: number;
  totalLikes: number;
  totalDownloads: number;
}
