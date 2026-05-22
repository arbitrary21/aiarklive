# Supabase SQL Runbook

## When CLI unavailable

1. Open SQL Editor (logged-in browser)
2. Run idempotent migration from `supabase/migrations/`
3. Confirm "Success" in Results panel
4. Update `PENDING_SQL.md` checkmarks

## CLI path (preferred when authenticated)

```powershell
npx supabase login
.\scripts\apply-supabase-migrations.ps1
```

## Browser automation tips

- Fill SQL in editor → Run → confirm destructive ops dialog
- Private saved queries in sidebar = likely prior manual runs

## Handoff to Data agent

Schema design, RLS policy review → `06-data-backend` before Ops runs DDL in prod.
