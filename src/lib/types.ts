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

export type FeedSort = "latest" | "popular" | "recommended";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  embed_url: string;
  platform: Platform;
  thumbnail_url: string;
  ai_tools: AiTool[];
  genre: Genre;
  prompt: string | null;
  likes_count: number;
  views_count: number;
  is_nsfw: boolean;
  created_at: string;
  user?: User;
}

export interface VideoFilters {
  aiTool?: AiTool;
  genre?: Genre;
  sort?: FeedSort;
  userId?: string;
}

export interface CreateVideoInput {
  embed_url: string;
  title: string;
  description?: string;
  platform: Platform;
  thumbnail_url: string;
  ai_tools: AiTool[];
  genre: Genre;
  prompt?: string;
}
