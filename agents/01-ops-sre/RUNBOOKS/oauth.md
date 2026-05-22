# OAuth Runbook

## Symptoms

- `/login?error=auth`
- `Invalid API key` in reason param
- Callback reached but session missing

## Diagnosis order

1. **Invalid API key** → Cloudflare env anon key stale. Compare with Supabase Legacy anon `iat` claim.
2. **PKCE / code verifier** → Must use `/api/auth/google` (not client-only `signInWithOAuth`).
3. **Redirect mismatch** → Supabase URL Configuration allow list.
4. **Profile insert fail** → RLS / missing migration (→ Data agent).

## Key files

- `src/app/api/auth/google/route.ts`
- `src/app/auth/callback/route.ts`
- `src/components/auth/AuthProvider.tsx`

## Verify

```bash
python check_deploy.py
# OAuth start should redirect to accounts.google.com
```
