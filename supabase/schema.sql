-- aiarklive.com Supabase Schema
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- users (auth.users와 연동)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  username text unique not null,
  avatar_url text,
  bio text,
  username_confirmed boolean default false not null,
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
  downloads_count integer default 0 not null,
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

-- notifications (in-app alerts for followed creators)
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null default 'new_video',
  actor_id uuid references public.users(id) on delete cascade not null,
  video_id uuid references public.videos(id) on delete cascade,
  message text not null,
  read_at timestamptz,
  created_at timestamptz default now() not null
);

-- indexes
create index videos_created_at_idx on public.videos(created_at desc);
create index videos_likes_count_idx on public.videos(likes_count desc);
create index videos_ai_tools_idx on public.videos using gin(ai_tools);
create index videos_genre_idx on public.videos(genre);
create index notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index notifications_user_unread_idx on public.notifications(user_id) where read_at is null;

-- RLS
alter table public.users enable row level security;
alter table public.videos enable row level security;
alter table public.likes enable row level security;
alter table public.saves enable row level security;
alter table public.follows enable row level security;
alter table public.notifications enable row level security;

-- public read policies (MVP)
create policy "Public users read" on public.users for select using (true);
create policy "Public videos read" on public.videos for select using (not is_nsfw);
create policy "Authenticated video insert" on public.videos for insert with check (auth.uid() = user_id);
create policy "Owner video update" on public.videos for update using (auth.uid() = user_id);
create policy "User can update own profile" on public.users for update using (auth.uid() = id);
create policy "User can insert own profile" on public.users for insert with check (auth.uid() = id);
create policy "Public follows read" on public.follows for select using (true);
create policy "User can follow" on public.follows for insert with check (auth.uid() = follower_id and follower_id != following_id);
create policy "User can unfollow" on public.follows for delete using (auth.uid() = follower_id);
create policy "Public likes read" on public.likes for select using (true);
create policy "User can like" on public.likes for insert with check (auth.uid() = user_id);
create policy "User can unlike" on public.likes for delete using (auth.uid() = user_id);
create policy "Public saves read" on public.saves for select using (true);
create policy "User can save" on public.saves for insert with check (auth.uid() = user_id);
create policy "User can unsave" on public.saves for delete using (auth.uid() = user_id);
create policy "Users read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Actor can create notifications" on public.notifications for insert with check (auth.uid() = actor_id);

-- auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := lower(regexp_replace(
    coalesce(
      new.raw_user_meta_data->>'username',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    '[^a-zA-Z0-9_]', '', 'g'
  ));

  if base_username = '' then
    base_username := 'user';
  end if;

  final_username := base_username;
  while exists (select 1 from public.users where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.users (id, email, username, avatar_url, username_confirmed)
  values (
    new.id,
    new.email,
    final_username,
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    ),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.increment_video_downloads(video_id uuid)
returns void as $$
begin
  update public.videos
  set downloads_count = downloads_count + 1
  where id = video_id;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_video_downloads(uuid) to anon, authenticated;

-- Data API grants
grant usage on schema public to anon, authenticated;
grant select on public.users to anon, authenticated;
grant select on public.videos to anon, authenticated;
grant select on public.likes to anon, authenticated;
grant select on public.saves to anon, authenticated;
grant select on public.follows to anon, authenticated;
grant select, update on public.notifications to authenticated;
grant insert on public.notifications to authenticated;
grant insert, update on public.videos to authenticated;
grant insert, delete on public.likes to authenticated;
grant insert, delete on public.saves to authenticated;
grant insert, delete on public.follows to authenticated;
grant insert, update on public.users to authenticated;
