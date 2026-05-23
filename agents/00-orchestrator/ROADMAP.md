# AIARKLIVE Roadmap

> Orchestrator가 유지. 마지막 업데이트: 2026-05-23

## Now (P0–P1) — Sprint 1

- [x] Google OAuth 로그인 안정화
- [x] 업로드 저작권 동의 체크박스 UI (upload-notice.md 기반)
- [x] Report API → DB 마이그레이션 (reports 테이블 + RLS)
- [x] Likes/saves atomic RPC + count-corruption 버그 수정
- [ ] **sitemap.ts + robots.ts + OG 이미지** (07-product-ui, handoff 발행됨)
- [ ] **Affiliate CTA 배너** — video detail 페이지 (07-product-ui, handoff 발행됨)
- [ ] **/tools/kling SEO 랜딩** (07-product-ui, handoff 발행됨)
- [ ] **Rate limit (업로드/댓글)** — Cloudflare KV (01-ops-sre, handoff 발행됨)
- [ ] **다운로드 버튼 미표시 확인** — 법적 사유 (07-product-ui, handoff 발행됨)

> ⚠️ 법률 결정 (2026-05-23): **다운로드 기능 미제공** — YouTube ToS § + DMCA §1201 위반 리스크.
> YouTube 공식 embed 전용. 재배포·AI학습 목적 사용 ToS 금지 명시 예정.

## Now (P1) — Sprint 2 ✅ Complete

- [x] **`videos.ai_tool` + `videos.ai_disclosed` 컬럼** — SQL Applied + API 연동
- [x] **댓글 스팸 방지 trigger + `is_flagged` 컬럼** — SQL Applied
- [x] **ToS 페이지** `/terms` — 법적 요건 포함 (다운로드 금지, AI 공개, 재배포 금지)
- [x] **Discover 컬렉션 3개 추가** — Trending/Tool Starter Kit/Challenge Gallery
- [x] **Trending sort (7일 창)** — getVideos + /api/videos GET 지원
- [x] **Rate limit (업로드/댓글)** — in-memory best-effort
- [x] Growth: `/tools/runway` + `/tools/pixverse` SEO 랜딩

## Next (P2) — Sprint 3 ✅ Complete

- [x] **Notification delivery 구현** — like/comment/follow + new_video (06-data-backend → 07-ui)
- [x] **YouTube 채널 인증 MVP** — Connect flow + upload ownership guard
- [x] `/discover` 큐레이션 실DB 연동 — 컬렉션별 preview + collection/tag explore 필터
- [x] **Pro tier spec** — upload quota, analytics (`agents/04-monetization/models/2026-05-23-pro-tier-spec.md`)
- [x] Rate limit: Cloudflare KV 기반으로 업그레이드 (`RATE_LIMIT_KV` namespace)

## Phase 2 (중기)

- [ ] **YouTube 채널 인증** — Google OAuth로 채널 소유 확인 후 영상 링크 등록
  - YouTube Data API v3 활용, 스토리지 비용 0, 저작권 리스크 최소화
  - 담당: 06-data-backend + 07-product-ui
- [ ] Pro tier spec (업로드 quota, analytics)
- [ ] Pro tier 결제 (Stripe)

## Later (P3)

- [ ] Challenge sponsorship flow
- [ ] Creator analytics dashboard
- [ ] Display ads (Legal + scale gate)
- [ ] ~~다운로드 기능~~ — **영구 미구현 (법적 사유: YouTube ToS / DMCA §1201)**

## Agent ownership

| Initiative | Lead agent |
|------------|------------|
| Deploy/OAuth/Rate limit | 01-ops-sre |
| Schema/RLS/API | 06-data-backend |
| UI features/SEO pages | 07-product-ui |
| Legal/ToS | 02-legal-trust |
| Revenue/Affiliate | 04-monetization |
| SEO/Growth strategy | 05-growth-seo |
| Security/Abuse | 09-security-abuse |
