-- Run in Supabase SQL Editor (existing projects)

-- Track thumbnail downloads per video
alter table public.videos
  add column if not exists downloads_count integer default 0 not null;

-- In-app notifications
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null default 'new_video',
  actor_id uuid references public.users(id) on delete cascade not null,
  video_id uuid references public.videos(id) on delete cascade,
  message text not null,
  read_at timestamptz,
  created_at timestamptz default now() not null
);

create index if not exists notifications_user_created_idx
  on public.notifications(user_id, created_at desc);

create index if not exists notifications_user_unread_idx
  on public.notifications(user_id)
  where read_at is null;

alter table public.notifications enable row level security;

drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

drop policy if exists "Actor can create notifications" on public.notifications;
create policy "Actor can create notifications"
  on public.notifications for insert
  with check (auth.uid() = actor_id);

grant select, update on public.notifications to authenticated;
grant insert on public.notifications to authenticated;

-- Allow anyone to increment download count safely
create or replace function public.increment_video_downloads(video_id uuid)
returns void as $$
begin
  update public.videos
  set downloads_count = downloads_count + 1
  where id = video_id;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_video_downloads(uuid) to anon, authenticated;
