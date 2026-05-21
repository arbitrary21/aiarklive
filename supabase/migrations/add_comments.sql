-- Comments on videos
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  video_id uuid references public.videos(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz default now() not null
);

create index if not exists comments_video_created_idx
  on public.comments(video_id, created_at desc);

alter table public.comments enable row level security;

drop policy if exists "Public comments read" on public.comments;
create policy "Public comments read"
  on public.comments for select using (true);

drop policy if exists "User can comment" on public.comments;
create policy "User can comment"
  on public.comments for insert
  with check (auth.uid() = user_id);

drop policy if exists "User can delete own comment" on public.comments;
create policy "User can delete own comment"
  on public.comments for delete
  using (auth.uid() = user_id);

grant select on public.comments to anon, authenticated;
grant insert, delete on public.comments to authenticated;
