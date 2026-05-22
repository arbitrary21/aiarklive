-- Atomic likes-count adjustment functions
-- Fixes read-modify-write race condition in src/lib/interactions.ts adjustLikesCount().
-- A plain `update set likes_count = likes_count ± 1` via PostgREST would need client-side
-- arithmetic; these functions perform the update atomically inside Postgres and return
-- the new count, eliminating the race.

create or replace function public.increment_video_likes(vid uuid)
returns integer as $$
declare
  new_count integer;
begin
  update public.videos
  set likes_count = likes_count + 1
  where id = vid
  returning likes_count into new_count;
  return coalesce(new_count, 0);
end;
$$ language plpgsql security definer;

create or replace function public.decrement_video_likes(vid uuid)
returns integer as $$
declare
  new_count integer;
begin
  update public.videos
  set likes_count = greatest(0, likes_count - 1)
  where id = vid
  returning likes_count into new_count;
  return coalesce(new_count, 0);
end;
$$ language plpgsql security definer;

grant execute on function public.increment_video_likes(uuid) to authenticated;
grant execute on function public.decrement_video_likes(uuid) to authenticated;
