-- Allow authenticated users to create their own profile row if the signup trigger missed.
-- Also backfill any auth.users rows missing from public.users.

drop policy if exists "User can insert own profile" on public.users;
create policy "User can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

insert into public.users (id, email, username, avatar_url)
select
  au.id,
  au.email,
  coalesce(
    nullif(
      lower(regexp_replace(
        coalesce(
          au.raw_user_meta_data->>'username',
          au.raw_user_meta_data->>'full_name',
          au.raw_user_meta_data->>'name',
          split_part(au.email, '@', 1)
        ),
        '[^a-zA-Z0-9_]', '', 'g'
      )),
      ''
    ),
    'user'
  ) || case
    when exists (
      select 1
      from public.users u
      where u.username = lower(regexp_replace(
        coalesce(
          au.raw_user_meta_data->>'username',
          au.raw_user_meta_data->>'full_name',
          au.raw_user_meta_data->>'name',
          split_part(au.email, '@', 1)
        ),
        '[^a-zA-Z0-9_]', '', 'g'
      ))
      and u.id <> au.id
    ) then au.id::text
    else ''
  end,
  coalesce(
    au.raw_user_meta_data->>'avatar_url',
    au.raw_user_meta_data->>'picture'
  )
from auth.users au
where not exists (
  select 1 from public.users u where u.id = au.id
)
on conflict (id) do nothing;
