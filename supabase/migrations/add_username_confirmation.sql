-- Ask new users to confirm their auto-generated nickname on first sign-in.

alter table public.users
  add column if not exists username_confirmed boolean default false not null;

-- Existing profiles were already using their nicknames.
update public.users
set username_confirmed = true;

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
