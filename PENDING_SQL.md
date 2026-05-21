# Pending Supabase SQL (manual execution required)

> Supabase CLI is not authenticated in this environment (`SUPABASE_ACCESS_TOKEN` missing).
> Run these in **Supabase Dashboard → SQL Editor** when ready.
> After login locally: `npx supabase login` then `.\scripts\apply-supabase-migrations.ps1`

Last updated: iteration 3

## Status legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not confirmed applied |
| ✅ | Applied (mark manually after run) |

---

## Queue (run in order)

### 1. Core schema (if fresh project)
- ⬜ `supabase/schema.sql`
- ⬜ `supabase/grants.sql` (if tables not exposed to API)
- ⬜ `supabase/seed.sql` (optional demo data)

### 2. Migrations (apply in filename order)

| # | File | Purpose |
|---|------|---------|
| 1 | `supabase/migrations/add_source_url.sql` | Video source URL column |
| 2 | `supabase/migrations/add_auth_policies.sql` | Google auth RLS policies |
| 3 | `supabase/migrations/add_downloads_and_notifications.sql` | Download counts + notifications |
| 4 | `supabase/migrations/add_user_profile_insert_policy.sql` | Profile insert on signup |
| 5 | `supabase/migrations/add_username_confirmation.sql` | Nickname confirmation flow |
| 6 | `supabase/migrations/add_comments.sql` | Video comments table + RLS |

---

## One-shot bundle

Copy-paste all migration files above into SQL Editor in order, or use:

```powershell
npx supabase login
.\scripts\apply-supabase-migrations.ps1
```

Project ref: `vsaqwmiwcbsuxcysbwru`

---

## Auth dashboard (not SQL)

Configure in Supabase UI:

- **Authentication → URL Configuration**
  - Site URL: `https://aiarklive.com`
  - Redirect URLs: `https://aiarklive.com/auth/callback`
- **Authentication → Providers → Google** → Enable + Client ID/Secret

---

## Notes

- Likes/saves use tables from `schema.sql` (no extra migration).
- Comments require migration #6 before production comments work.
- Vanity subdomain (`aiarklive.supabase.co`) requires **Pro plan** (CLI only).
