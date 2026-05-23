-- YouTube channel ownership verification (Sprint 3)
-- Run in Supabase SQL Editor

alter table public.users
  add column if not exists youtube_channel_id text,
  add column if not exists youtube_channel_title text,
  add column if not exists youtube_verified_at timestamptz;

create unique index if not exists users_youtube_channel_id_idx
  on public.users (youtube_channel_id)
  where youtube_channel_id is not null;
