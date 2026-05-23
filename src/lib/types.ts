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

export type FeedSort = "latest" | "popular" | "recommended" | "following" | "trending";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  username_confirmed?: boolean;
  youtube_channel_id?: string | null;
  youtube_channel_title?: string | null;
  youtube_verified_at?: string | null;
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
  ai_tool: AiTool | null;
  ai_disclosed: boolean;
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
  collection?: "tool-starter-kit";
  tag?: string;
  limit?: number;
  offset?: number;
}

export const FEED_PAGE_SIZE = 20;

export interface CreateVideoInput {
  embed_url: string;
  source_url?: string;
  title: string;
  description?: string;
  platform: Platform;
  thumbnail_url: string;
  ai_tools: AiTool[];
  ai_tool?: AiTool | null;
  ai_disclosed?: boolean;
  genre: Genre;
  prompt?: string;
}

export type NotificationType = "new_video" | "like" | "comment" | "follow";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  actor_id: string;
  video_id: string | null;
  message: string;
  read_at: string | null;
  created_at: string;
  actor?: User;
}

export interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export type ReportStatus = "pending" | "reviewed" | "dismissed";

export interface Report {
  id: string;
  video_id: string;
  user_id: string | null;
  reason: string;
  status: ReportStatus;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  tool: AiTool;
  prize: string;
  ends_at: string;
  entries_count: number;
  status: "active" | "upcoming" | "ended";
}

export interface UserProfileStats {
  videoCount: number;
  followers: number;
  following: number;
  totalLikes: number;
  totalDownloads: number;
}
