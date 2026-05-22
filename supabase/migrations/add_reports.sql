-- Reports: persistent storage for video abuse reports
-- Replaces in-memory array in src/app/api/report/route.ts
--
-- Design decisions:
--   - user_id nullable → allows anonymous reports (matches current API behaviour)
--   - unique index on (video_id, user_id) WHERE user_id IS NOT NULL → prevents
--     duplicate authenticated reports on the same video (idempotent re-runs safe)
--   - status enum guards against invalid transitions at DB level
--   - RLS: default-deny; anon INSERT allowed only with null user_id to prevent
--     spoofing; service_role retains full access for moderation workflows

create table if not exists public.reports (
  id          uuid        default gen_random_uuid() primary key,
  video_id    uuid        not null references public.videos(id) on delete cascade,
  user_id     uuid        references public.users(id) on delete set null,  -- null = anonymous
  reason      text        not null check (char_length(reason) between 1 and 500),
  status      text        not null default 'pending'
                          check (status in ('pending', 'reviewed', 'dismissed')),
  created_at  timestamptz not null default now()
);

-- One authenticated report per (video, user) — idempotent on re-run
create unique index if not exists reports_video_user_uniq
  on public.reports (video_id, user_id)
  where user_id is not null;

-- Moderation queue: fetch pending reports newest-first
create index if not exists reports_status_created_idx
  on public.reports (status, created_at desc);

alter table public.reports enable row level security;

-- Authenticated users can insert their own report
drop policy if exists "Authenticated user can report" on public.reports;
create policy "Authenticated user can report"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Anonymous users can insert with null user_id only
drop policy if exists "Anon can report" on public.reports;
create policy "Anon can report"
  on public.reports for insert
  to anon
  with check (user_id is null);

-- Users can view their own submitted reports
drop policy if exists "User can view own reports" on public.reports;
create policy "User can view own reports"
  on public.reports for select
  to authenticated
  using (auth.uid() = user_id);

grant insert on public.reports to anon, authenticated;
grant select on public.reports to authenticated;
