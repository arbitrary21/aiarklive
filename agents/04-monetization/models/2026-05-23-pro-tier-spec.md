# Pro Tier Spec — Upload Quota & Analytics

> **작성:** 04-monetization (Sprint 3)  
> **상태:** Spec ready → 06-data-backend + 07-product-ui + 10-analytics  
> **선행:** YouTube 채널 인증 MVP, Free tier embed-only 업로드

---

## 1. Tier 비교 (확정안)

| 기능 | Free | Pro ($9.99/월) |
|------|------|----------------|
| Embed 링크 업로드 (YouTube/TikTok/X) | 10건/일 | 50건/일 |
| YouTube 채널 인증 | 필수 (YouTube) | 필수 (YouTube) |
| 직접 파일 업로드 (MP4/WebM) | ❌ | ✅ 500MB/파일, 20GB/월 |
| Analytics 대시보드 | 조회수 합계만 | 30일 추이 + 유입 + engagement |
| Pro 배지 | ❌ | ✅ 프로필 + 영상 카드 |
| Discover Boost | ❌ | 주 1회 상단 슬롯 (수동 큐레이션) |
| 광고 | (향후) 표시 | (향후) 제거 |

---

## 2. Upload Quota 설계

### 2.1 카운터 키 (Cloudflare KV)

| 키 패턴 | 창 | Free limit | Pro limit |
|---------|-----|------------|-----------|
| `quota:upload:embed:user:{id}:day` | 24h | 10 | 50 |
| `quota:upload:file:user:{id}:day` | 24h | 0 | 10 |
| `quota:storage:user:{id}:month` | 30d | 0 bytes | 20GB |

### 2.2 API 동작

```
POST /api/videos (embed)
  → check plan from users.plan
  → checkRateLimit KV quota key
  → 429 { code: "UPLOAD_QUOTA_EXCEEDED", upgradeUrl: "/pro" }

POST /api/videos/upload (Pro only, Phase 2)
  → R2 presigned URL
  → increment file + storage counters
```

### 2.3 DB 스키마 (Phase 2 결제 전 선행 가능)

```sql
alter table public.users
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro')),
  add column if not exists plan_expires_at timestamptz,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

create index if not exists users_plan_idx on public.users(plan);
```

Migration 파일: `add_pro_tier_columns.sql` (PENDING_SQL #12)

### 2.4 Quota UI

- 업로드 페이지: `3/10 uploads today` (Free) / `12/50` (Pro)
- 한도 초과 시: Pro 업그레이드 CTA (Stripe Checkout 연결 전에는 waitlist 링크)

---

## 3. Analytics 대시보드 (Pro)

### 3.1 MVP 이벤트 (기존 10-analytics 스키마 확장)

| 이벤트 | 트리거 | 속성 |
|--------|--------|------|
| `video_view` | VideoLightbox open / 3s watch | video_id, referrer |
| `video_like` | like API success | video_id |
| `video_save` | save API success | video_id |
| `profile_view` | /profile/[id] page load | profile_id |
| `upload_complete` | POST /api/videos 201 | platform, ai_tools |

### 3.2 Pro 대시보드 위젯 (`/profile/me/analytics`)

1. **Overview** — 30일 조회수, 좋아요, 저장, 팔로워 순증
2. **Top videos** — engagement score = likes×2 + saves×3 + views
3. **Traffic sources** — referrer bucket (discover / explore / direct / profile)
4. **Audience** — 팔로워 증가 추이 (일별)

### 3.3 저장소 옵션

| 옵션 | 장점 | 단점 |
|------|------|------|
| Supabase `analytics_events` 테이블 | SQL 집계, RLS | 쓰기 볼륨 증가 |
| Cloudflare Analytics Engine | 엣지 친화 | 별도 쿼리 UI |
| PostHog / Plausible (SaaS) | 빠른 MVP | 비용, 데이터 외부 |

**권고 (MVP):** Supabase `analytics_events` + 일별 rollup materialized view (cron)

```sql
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  event_name text not null,
  properties jsonb default '{}',
  created_at timestamptz default now() not null
);

create index analytics_events_user_created_idx
  on public.analytics_events(user_id, created_at desc);
```

---

## 4. 구현 순서

| # | 작업 | 담당 | 의존 |
|---|------|------|------|
| 1 | `users.plan` migration | 06-data-backend | — |
| 2 | Upload quota KV keys + API guard | 06 + 09 | KV 바인딩 |
| 3 | Quota UI on /upload | 07-product-ui | #2 |
| 4 | `analytics_events` table + ingest API | 06 + 10 | — |
| 5 | Pro analytics page (read-only charts) | 07 + 10 | #4 |
| 6 | Stripe Checkout + webhook | 06 + 07 | #1 |

---

## 5. KPI (Pro 론칭 후 90일)

| 지표 | 목표 |
|------|------|
| Free → Pro 전환율 | ≥ 2% (MAU 기준) |
| Pro churn (월) | < 8% |
| Upload quota hit rate (Free) | 5–15% (업그레이드 퍼널) |
| Pro MAU analytics DAU/MAU | ≥ 40% |

---

## 6. Out of scope (Sprint 3)

- Stripe 결제 UI
- R2 직접 파일 업로드
- Sponsored challenges
- Display ads

> 상세 monetization 로드맵: `agents/04-monetization/models/2026-05-23-monetization-spec.md`
