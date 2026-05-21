-- Data API 권한 (Automatically expose new tables = OFF 일 때 필수)
-- SQL Editor에서 schema.sql 실행 후 이 파일도 실행하세요

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
