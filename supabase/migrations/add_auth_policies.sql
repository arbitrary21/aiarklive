-- Run in Supabase SQL Editor after schema.sql
-- Google OAuth profile + follow/like RLS policies

-- Improved profile creation from Google OAuth metadata
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

  insert into public.users (id, email, username, avatar_url)
  values (
    new.id,
    new.email,
    final_username,
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Users: allow profile owner to update
drop policy if exists "User can update own profile" on public.users;
create policy "User can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Follows
drop policy if exists "Public follows read" on public.follows;
create policy "Public follows read"
  on public.follows for select using (true);

drop policy if exists "User can follow" on public.follows;
create policy "User can follow"
  on public.follows for insert
  with check (auth.uid() = follower_id and follower_id != following_id);

drop policy if exists "User can unfollow" on public.follows;
create policy "User can unfollow"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- Likes
drop policy if exists "Public likes read" on public.likes;
create policy "Public likes read"
  on public.likes for select using (true);

drop policy if exists "User can like" on public.likes;
create policy "User can like"
  on public.likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "User can unlike" on public.likes;
create policy "User can unlike"
  on public.likes for delete
  using (auth.uid() = user_id);

-- Saves
drop policy if exists "Public saves read" on public.saves;
create policy "Public saves read"
  on public.saves for select using (true);

drop policy if exists "User can save" on public.saves;
create policy "User can save"
  on public.saves for insert
  with check (auth.uid() = user_id);

drop policy if exists "User can unsave" on public.saves;
create policy "User can unsave"
  on public.saves for delete
  using (auth.uid() = user_id);
