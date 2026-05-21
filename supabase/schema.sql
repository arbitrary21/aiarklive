-- aiarklive.com Supabase Schema
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- users (auth.users와 연동)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  username text unique not null,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null
);

-- videos
create table public.videos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  description text,
  embed_url text not null,
  source_url text,
  platform text not null check (platform in ('youtube', 'tiktok', 'x')),
  thumbnail_url text not null,
  ai_tools text[] not null default '{}',
  genre text not null,
  prompt text,
  likes_count integer default 0 not null,
  views_count integer default 0 not null,
  is_nsfw boolean default false not null,
  created_at timestamptz default now() not null
);

-- likes
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  video_id uuid references public.videos(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, video_id)
);

-- saves
create table public.saves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  video_id uuid references public.videos(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, video_id)
);

-- follows
create table public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.users(id) on delete cascade not null,
  following_id uuid references public.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(follower_id, following_id)
);

-- indexes
create index videos_created_at_idx on public.videos(created_at desc);
create index videos_likes_count_idx on public.videos(likes_count desc);
create index videos_ai_tools_idx on public.videos using gin(ai_tools);
create index videos_genre_idx on public.videos(genre);

-- RLS
alter table public.users enable row level security;
alter table public.videos enable row level security;
alter table public.likes enable row level security;
alter table public.saves enable row level security;
alter table public.follows enable row level security;

-- public read policies (MVP)
create policy "Public users read" on public.users for select using (true);
create policy "Public videos read" on public.videos for select using (not is_nsfw);
create policy "Authenticated video insert" on public.videos for insert with check (auth.uid() = user_id);
create policy "Owner video update" on public.videos for update using (auth.uid() = user_id);

-- auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Data API grants (Automatically expose new tables = OFF 일 때 필수)
grant usage on schema public to anon, authenticated;
grant select on public.users to anon, authenticated;
grant select on public.videos to anon, authenticated;
grant select on public.likes to anon, authenticated;
grant select on public.saves to anon, authenticated;
grant select on public.follows to anon, authenticated;
grant insert, update on public.videos to authenticated;
grant insert, delete on public.likes to authenticated;
grant insert, delete on public.saves to authenticated;
grant insert, delete on public.follows to authenticated;
grant insert, update on public.users to authenticated;
