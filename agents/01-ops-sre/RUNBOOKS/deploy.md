# Deploy Runbook

## Stack

- Next.js 15 + `@cloudflare/next-on-pages`
- Edge runtime on most routes
- Build: `npm run build` / `npm run pages:build`

## Cloudflare env (Production)

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy anon JWT — rotate 시 즉시 갱신 |
| `NEXT_PUBLIC_SITE_URL` | `https://aiarklive.com` |

## After push

1. Wait 60–90s for propagation
2. `python check_deploy.py` — expect 8/8
3. Transient 404 on single route → retry once before code change

## Wrangler (optional)

```bash
npx wrangler login
npm run pages:build
```

Not authenticated locally → rely on Git push → Cloudflare auto deploy.
