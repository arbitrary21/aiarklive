# AIARKLIVE — Shared Project Context

> **모든 에이전트는 작업 시작 전 이 파일을 먼저 읽는다.**  
> 최신 상태는 Ops/QA 에이전트가 유지.

---

## 프로젝트 핵심 정보

| 항목 | 값 |
|------|-----|
| Site | https://aiarklive.com |
| Repo | `arbitrary21/aiarklive` (branch: `main`) |
| Supabase project | `vsaqwmiwcbsuxcysbwru` |
| Hosting | Cloudflare Pages (edge runtime) |
| Stack | Next.js 15 App Router + TypeScript + Tailwind + @supabase/ssr |
| Auth flow | `/api/auth/google` → Google OAuth → `/auth/callback` (server PKCE) |
| Deploy check | `python check_deploy.py` |

---

## 현재 상태 (Last updated: 2026-05-23 — Sprint 4 kickoff: Content & Discover)

### Sprint 4 (active)
- **Goal:** Discover/Explore 콘텐츠 채우기 + 챌린지 #001 런칭
- **Lead:** 08-content-editorial
- **Handoffs:** `agents/HANDOFFS.md` Sprint 4 섹션

### 배포
- **Status:** ✅ ALL 12/12 routes passing
- **Last deploy:** `564fd8c` — notifications + discover DB previews

### 인증
- **Status:** ✅ Google OAuth 정상 동작
- **Root cause (해결됨):** Supabase anon key rotation + client-side PKCE 문제
- **Fix:** `/api/auth/google` server route에서 `skipBrowserRedirect` + Set-Cookie

### DB 마이그레이션
- ✅ `source_url` 컬럼 (videos 테이블, Applied 2026-05-22)
- ✅ Google OAuth RLS 정책 — follows/likes/saves + handle_new_user() (Applied 2026-05-22)
- ✅ `downloads_count` 컬럼 + `notifications` 테이블 + RLS (Applied 2026-05-22)
- ✅ `users` insert policy + auth.users 백필 (Applied 2026-05-22)
- ✅ `username_confirmed` 컬럼 (Applied 2026-05-22)
- ✅ `comments` 테이블 + RLS (Applied 2026-05-22)
- ✅ `reports` 테이블 + RLS (Applied 2026-05-22)
- ✅ Likes/saves 영속성 감사 완료 (2026-05-23) — 23505 중복 처리, atomic RPC fallback, unlikeVideo count-corruption 버그 수정 (spurious unlike 시 count 감소 방지)
- ✅ `add_likes_count_functions.sql` — `increment_video_likes` / `decrement_video_likes` atomic RPC 함수 (Applied 2026-05-23)
- ✅ `robots.ts` + `sitemap.ts` (Applied 2026-05-23)
- ✅ `video/[id]/opengraph-image.tsx` + generateMetadata OG/Twitter 태그 (Applied 2026-05-23)
- ✅ `/tools/kling` SEO 랜딩 페이지 (Applied 2026-05-23)
- ✅ `AffiliateCTABanner` — kling/runway/pixverse/pika/hailuo CTA (Applied 2026-05-23)
- ✅ `add_ai_tool_columns.sql` — videos.ai_tool + videos.ai_disclosed (Applied 2026-05-23)
- ✅ `add_comment_spam_guard.sql` — 댓글 스팸 방지 trigger + is_flagged (Applied 2026-05-23)
- ✅ `/tools/runway` + `/tools/pixverse` SEO 랜딩 페이지 (2026-05-23)
- ✅ `/terms` ToS 페이지 (2026-05-23)
- ✅ Rate limit (업로드 10/h, 댓글 20/10min) — in-memory best-effort (2026-05-23)
- ✅ Discover 컬렉션 3개 추가 (Trending This Week, Tool Starter Kit, Challenge Gallery)
- ✅ Trending sort (7일 창) getVideos 지원
- ✅ ai_tool/ai_disclosed 업로드 API + createVideo 연동
- ✅ Notification delivery — new_video + like/comment/follow (2026-05-23)
- ✅ Discover 실DB 연동 — 컬렉션별 preview 썸네일 + collection/tag explore 필터 (2026-05-23)
- ✅ YouTube 채널 인증 MVP — connect/callback/status API + upload guard (2026-05-23)
- ✅ Rate limit Cloudflare KV — `RATE_LIMIT_KV` namespace + async limiter (2026-05-23)
- ✅ `add_youtube_channel_verify.sql` — Applied 2026-05-23 (#12)
- ✅ Supabase redirect `https://aiarklive.com/api/youtube/callback` — Applied 2026-05-23
- ✅ Cloudflare KV binding `RATE_LIMIT_KV` — production verified 2026-05-23
- ⬜ Google Cloud: YouTube Data API v3 + `youtube.readonly` scope on OAuth consent screen

### 알려진 이슈
- ~~`reports` API: `/api/report` 메모리 전용 — DB 저장 없음~~ → ✅ 해결됨 (2026-05-22) — Supabase INSERT + 23505 idempotency
- ~~Likes/saves 23505 에러 미처리~~ → ✅ 해결됨 (2026-05-22)
- ~~`adjustLikesCount` 레이스컨디션~~ → ✅ 해결됨 (2026-05-23) — migration #8 적용 완료, atomic RPC 사용 중
- ~~Upload: 저작권 고지 UI~~ → ✅ 해결됨 (upload-notice 체크박스 구현 완료)
- ✅ `add_ai_tool_columns.sql` + `add_comment_spam_guard.sql` → Applied 2026-05-23
- ✅ `add_avatar_storage.sql` — avatars Storage bucket + RLS (Applied 2026-05-23)

---

## 중요 파일 맵

### Auth
| 파일 | 역할 |
|------|------|
| `src/app/api/auth/google/route.ts` | OAuth 시작 (서버, PKCE) |
| `src/app/auth/callback/route.ts` | OAuth 콜백 (코드 교환) |
| `src/components/auth/AuthProvider.tsx` | 클라이언트 상태 |
| `src/lib/auth-profile.ts` | 프로필 upsert |

### DB
| 파일 | 역할 |
|------|------|
| `supabase/migrations/` | DDL 마이그레이션 |
| `PENDING_SQL.md` | 미적용 SQL 큐 |
| `src/lib/supabase/server.ts` | 서버 Supabase 클라이언트 |
| `src/lib/supabase/client.ts` | 브라우저 Supabase 클라이언트 |

### 핵심 기능
| 파일 | 역할 |
|------|------|
| `src/lib/videos.ts` | 비디오 CRUD |
| `src/lib/interactions.ts` | 좋아요/저장 |
| `src/lib/comments.ts` | 댓글 |
| `src/lib/follows.ts` | 팔로우 |
| `src/lib/discover.ts` | 컬렉션 |

---

## Supabase 대시보드 URL

| 대상 | URL |
|------|-----|
| SQL Editor | https://supabase.com/dashboard/project/vsaqwmiwcbsuxcysbwru/sql/new |
| Auth URL 설정 | https://supabase.com/dashboard/project/vsaqwmiwcbsuxcysbwru/auth/url-configuration |
| Auth 로그 | https://supabase.com/dashboard/project/vsaqwmiwcbsuxcysbwru/logs/auth-logs |
| API Keys (Legacy) | https://supabase.com/dashboard/project/vsaqwmiwcbsuxcysbwru/settings/api-keys/legacy |
| Google Provider | https://supabase.com/dashboard/project/vsaqwmiwcbsuxcysbwru/auth/providers |

---

## 에이전트 간 현재 활성 작업

> Orchestrator가 handoff 발행 시 `agents/HANDOFFS.md`에 기록.

| Sprint | Lead | 상태 |
|--------|------|------|
| Sprint 4 — Content & Discover | 08 Editorial | 🔄 kickoff |

**즉시:** Editorial 앵커 콘텐츠 → UI empty state → Community 챌린지 공지 → QA smoke

---

## 에스컬레이션 경로

| 상황 | 어디로 |
|------|--------|
| 배포/env/OAuth 장애 | 01-ops-sre |
| DB 스키마·RLS 문제 | 06-data-backend |
| 법률·정책 질문 | 02-legal-trust |
| UI/기능 버그 | 07-product-ui |
| 막혀서 5회 이상 재시도 실패 | 00-orchestrator에 보고 |

---

## agent_log.json 업데이트 규칙

Ops/QA 에이전트가 배포 후 갱신. 포맷:

```json
{
  "timestamp": "ISO8601",
  "base_url": "https://aiarklive.com",
  "total": 8,
  "passed": 8,
  "failed": 0,
  "status": "OK | FAIL",
  "failed_routes": [],
  "notes": "선택 — 이번 배포에서 바뀐 것"
}
```
