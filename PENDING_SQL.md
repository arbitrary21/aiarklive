# Pending Supabase SQL (manual execution required)

> Supabase CLI is not authenticated in this environment (`SUPABASE_ACCESS_TOKEN` missing).
> Run these in **Supabase Dashboard ? SQL Editor** when ready.
> After login locally: `npx supabase login` then `.\scripts\apply-supabase-migrations.ps1`

Last updated: 2026-05-23 (migration #10 ?add_comment_spam_guard added to queue)

## Status legend

| Symbol | Meaning |
|--------|---------|
| ? | Not confirmed applied |
| ? | Applied (mark manually after run) |

---

## Queue (run in order)

### 1. Core schema (if fresh project)
- ? `supabase/schema.sql`
- ? `supabase/grants.sql` (if tables not exposed to API)
- ? `supabase/seed.sql` (optional demo data)

### 2. Migrations (apply in filename order)

| # | File | Purpose | Status |
|---|------|---------|--------|
| 1 | `supabase/migrations/add_source_url.sql` | Video source URL column | ? Applied via browser agent (2026-05-22) |
| 2 | `supabase/migrations/add_auth_policies.sql` | Google auth RLS policies | ? Applied via browser agent (2026-05-22) |
| 3 | `supabase/migrations/add_downloads_and_notifications.sql` | Download counts + notifications | ? Applied via browser agent (2026-05-22) |
| 4 | `supabase/migrations/add_user_profile_insert_policy.sql` | Profile insert on signup | ? Applied via browser agent (2026-05-22) |
| 5 | `supabase/migrations/add_username_confirmation.sql` | Nickname confirmation flow | ? Applied via browser agent (iter 4) |
| 6 | `supabase/migrations/add_comments.sql` | Video comments table + RLS | ? Applied via browser agent (iter 4) |
| 7 | `supabase/migrations/add_reports.sql` | Reports table + RLS (replaces in-memory store) | ? Applied via browser agent (2026-05-22) |
| 8 | `supabase/migrations/add_likes_count_functions.sql` | Atomic increment/decrement RPCs ?fixes race in adjustLikesCount | ? Applied (2026-05-23) |
| 9 | `supabase/migrations/add_ai_tool_columns.sql` | videos.ai_tool + videos.ai_disclosed ?Affiliate CTA, AI ?? ?? | ✅ Applied (2026-05-23) |
| 10 | `supabase/migrations/add_comment_spam_guard.sql` | ?? ?? ?? trigger + comments.is_flagged | ✅ Applied (2026-05-23) |
| 11 | `supabase/migrations/add_avatar_storage.sql` | Supabase Storage avatars bucket + RLS | ? Applied (2026-05-23) |?fixes read-modify-write race in `adjustLikesCount` | ? Applied via browser agent (2026-05-23) |

---

## Manual ops (non-SQL)

### Cloudflare Pages environment variables
If OAuth still shows **Invalid API key** after deploy, update in **Cloudflare Dashboard ? Workers & Pages ? aiarklive ? Settings ? Environment variables**:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vsaqwmiwcbsuxcysbwru.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Current anon key from Supabase ? Settings ? API Keys (Legacy) |
| `NEXT_PUBLIC_SITE_URL` | `https://aiarklive.com` |

Then trigger a **Retry deployment** on the latest commit.

---

Copy-paste all migration files above into SQL Editor in order, or use:

```powershell
npx supabase login
.\scripts\apply-supabase-migrations.ps1
```

Project ref: `vsaqwmiwcbsuxcysbwru`

---

## Auth dashboard (not SQL)

Configure in Supabase UI:

- **Authentication ? URL Configuration**
  - Site URL: `https://aiarklive.com`
  - Redirect URLs: `https://aiarklive.com/auth/callback`
- **Authentication ? Providers ? Google** ? Enable + Client ID/Secret

---

## Notes

- Likes/saves use tables from `schema.sql` (no extra migration).
- Comments require migration #6 before production comments work.
- Vanity subdomain (`aiarklive.supabase.co`) requires **Pro plan** (CLI only).

