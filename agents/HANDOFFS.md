# Agent Handoff Queue

> 에이전트 간 작업 인계 공용 큐.  
> **수신 에이전트는 작업 시작 전 이 파일에서 자기 이름 확인.**  
> 완료 후 해당 항목을 `## Done` 섹션으로 이동.

---

## 📥 Active (미완료)

### Sprint 4 — 2026-05-23 — 앵커 콘텐츠 시드 & Discover preview 채우기

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 08-content-editorial |
| **Priority** | P0 (Sprint 4 lead) |
| **Goal** | Discover/Explore가 비어 보이지 않도록 앵커 콘텐츠 메타·태그·큐레이션 기준 확정 |
| **Context** | Sprint 4 = **A: 콘텐츠·Discover**. `src/lib/discover.ts` 9개 컬렉션은 DB preview 연동 완료 — **실제 영상 수가 적어** 대부분 카드가 썸네일 없음. 앵커: `cozyambience` 계정 + 영상 `5ba1af16-7ab1-4605-b66b-fbc3f9607e5a` (Candlelight Cozy Ambience). Brief: `agents/08-content-editorial/briefs/2026-05-23-collections.md` |
| **Acceptance** | - [ ] `briefs/2026-05-23-sprint4-seed.md` 작성 — 컬렉션별 목표 영상 수(최소 5컬렉션 × 4 preview)<br>- [ ] cozyambience 영상 메타 확정: title, description, `ai_tool`, genre(`loop`), tags(`ambient`, `cozy`, `kling` 등)<br>- [ ] 컬렉션 매핑표: 어떤 영상이 `runway-loops` / `cinematic-kling` / `trending-this-week` 등에 노출될지<br>- [ ] 신규 업로드 3~5개 **메타데이터 템플릿**(프롬프트·도구·태그) — 실제 영상은 크리에이터/운영자 업로드<br>- [ ] Data handoff 필요 시 `PENDING_SQL.md` 또는 06 handoff 발행 (스키마 변경 없이 메타만이면 생략) |
| **Out of scope** | 저작권 없는 타인 YouTube 영상 대량 등록, 스키마 마이그레이션 |
| **Blocked by** | 없음 |
| **Status** | 🔄 in-progress — `briefs/2026-05-23-sprint4-seed.md` + `sprint4-anchor-video.sql` 작성됨. DB/SQL 또는 Edit 모달 적용 대기 |

### Sprint 4 — 2026-05-23 — Discover empty state + 컬렉션 카피 (한/영)

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 07-product-ui |
| **Priority** | P1 |
| **Goal** | preview 0개 컬렉션 카드에 placeholder UI + Discover 페이지 카피 polish |
| **Context** | `DiscoverCollectionCard` — `previews.length > 0` 일 때만 썸네일 그리드. Sprint 4 시드 전후 모두 대응 필요. Editorial brief의 한국어 제목/설명 반영 검토. |
| **Acceptance** | - [ ] preview 0개: gradient placeholder 4칸 + “Be the first to upload” 또는 “첫 영상을 올려보세요” CTA (`/upload` 링크)<br>- [ ] preview 1~3개: 빈 칸은 placeholder로 채움<br>- [ ] `/discover` hero 설명 한 줄 polish (선택: bilingual)<br>- [ ] 모바일 그리드 깨짐 없음 |
| **Out of scope** | DB 기반 컬렉션 관리, Featured Creator 배지 |
| **Blocked by** | 없음 (Editorial과 병렬 가능) |
| **Status** | ✅ done — `DiscoverCollectionCard` placeholder 4칸 + empty copy |

### Sprint 4 — 2026-05-23 — 챌린지 #001 “나만의 미래 도시” 런칭 패키지

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 08-content-editorial + 12-community-ops |
| **Priority** | P1 |
| **Goal** | 2026-05-26(월) KST 시작 주간 챌린지 공지·카피·해시태그 가이드 완성 |
| **Context** | Brief §챌린지 #001 in `agents/08-content-editorial/briefs/2026-05-23-collections.md`. `src/lib/challenges.ts`는 mock only — Sprint 4는 **카피+공지** 우선, DB 챌린지 테이블은 Phase 2. |
| **Acceptance** | - [ ] Editorial: `briefs/2026-05-23-challenge-001.md` — 규칙·심사·수상·해시태그 `#AIARKChallenge001` 최종본<br>- [ ] Community: 홈/Discover용 공지 문안 (200자 + 상세 FAQ)<br>- [ ] 업로드 시 description에 넣을 해시태그·프롬프트 공유 가이드 1페이지<br>- [ ] (선택) 07 UI handoff: Discover hero 배너 컴포넌트 |
| **Out of scope** | 배지/Featured Creator 구현, Stripe 상금 |
| **Blocked by** | 없음 |
| **Status** | 🔄 in-progress — `briefs/2026-05-23-challenge-001.md` + Discover `DiscoverChallengeBanner` |

### Sprint 4 — 2026-05-23 — Discover/Explore SEO 메타 점검

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 05-growth-seo |
| **Priority** | P2 |
| **Goal** | `/discover`, `/explore?*` 페이지 discoverability — title/description/OG |
| **Context** | `/tools/kling` 등 SEO 랜딩은 완료. Discover는 `metadata.title = "Discover"` 만 있음. Explore는 쿼리별 동적 title 미흡할 수 있음. |
| **Acceptance** | - [ ] `/discover` metadata description + OG 이미지(또는 fallback) 제안<br>- [ ] explore 주요 필터(`tool=kling`, `sort=trending`, `collection=tool-starter-kit`)별 title 템플릿<br>- [ ] `sitemap.ts`에 discover/explore 포함 여부 확인<br>- [ ] 07 UI handoff 또는 직접 PR (범위에 따라) |
| **Out of scope** | paid ads, blog |
| **Blocked by** | 없음 |
| **Status** | ⬜ pending |

### Sprint 4 — 2026-05-23 — Discover smoke (시드 후)

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 11-qa-release |
| **Priority** | P1 |
| **Goal** | Editorial 시드 + UI empty state 배포 후 Discover/Explore 회귀 없음 확인 |
| **Context** | `python check_deploy.py` + 수동: `/discover` 9카드, preview≥1인 카드 수, `/explore?tool=kling`, cozyambience 영상 상세 OG |
| **Acceptance** | - [ ] 12/12 routes OK<br>- [ ] Discover ≥5 컬렉션 preview 1장 이상<br>- [ ] cozyambience 영상 explore 필터 노출<br>- [ ] Edit modal drag-close 회귀 없음<br>- [ ] `agent_log.json` 갱신 |
| **Out of scope** | E2E 자동화 신규 작성 |
| **Blocked by** | 08 Editorial 앵커 메타 + (선택) 07 empty state |
| **Status** | ⬜ pending |

### 2026-05-23 — 프로필 편집 API + Supabase Storage 아바타 업로드

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 06-data-backend |
| **Priority** | P1 |
| **Status** | ✅ done — `PUT /api/profile/update`, `POST /api/profile/avatar`, `add_avatar_storage.sql` Applied |

### 2026-05-23 — 프로필 편집 UI (닉네임·소개·사진 변경)

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 07-product-ui |
| **Priority** | P1 |
| **Status** | ✅ done — `EditProfileModal.tsx` + `ProfilePageClient.tsx` 구현됨. QA: 닉네임 `user1` → `cozyambience` 변경 smoke 권장 |

### 2026-05-23 — `videos.ai_tool` + `videos.ai_disclosed` 컬럼 추가

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 06-data-backend |
| **Priority** | P1 |
| **Status** | ✅ done — migration #9 Applied, upload API 연동 |

### 2026-05-23 — ToS 초안 페이지 작성

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 02-legal-trust |
| **Priority** | P2 |
| **Status** | ✅ done — `/terms` 페이지 배포 (2026-05-23). 별도 `tos-draft.md`는 선택 follow-up |

### 2026-05-23 — 다운로드 버튼 미표시 확인 + `/api/download` 노출 제거

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 07-product-ui |
| **Priority** | P1 |
| **Status** | ✅ done — 동영상 다운로드 버튼 없음 확인. 썸네일 전용 `/api/download/thumbnail` 유지. video/[id]/page.tsx "coming soon" 카피 제거 완료. |

### 2026-05-23 — sitemap + OG 이미지 + /tools/kling 페이지 구현

| 항목 | 내용 |
|------|------|
| **From** | 05-growth-seo |
| **To** | 07-product-ui |
| **Priority** | P1 |
| **Status** | ✅ done |

### 2026-05-23 — 업로드 & 댓글 Rate Limit 구현

| 항목 | 내용 |
|------|------|
| **From** | 09-security-abuse |
| **To** | 01-ops-sre |
| **Priority** | P1 |
| **Status** | ✅ done — in-memory best-effort rate limit 구현 완료 (upload 10/h user, 20/h IP; comment 20/10min user). KV 업그레이드는 Sprint 3에서 필요 시 진행. |

### 2026-05-23 — 댓글 스팸 방지 DB 마이그레이션

| 항목 | 내용 |
|------|------|
| **From** | 09-security-abuse |
| **To** | 06-data-backend |
| **Priority** | P2 |
| **Status** | ✅ done — `add_comment_spam_guard.sql` Applied 2026-05-23. P0001 에러 처리도 API route에 추가됨. |

### 2026-05-23 — Affiliate CTA 배너 컴포넌트 구현

| 항목 | 내용 |
|------|------|
| **From** | 04-monetization |
| **To** | 07-product-ui |
| **Priority** | P1 |
| **Status** | ✅ done |

### 2026-05-23 — upload-notice.md 기반 저작권 동의 체크박스 UI 구현

| 항목 | 내용 |
|------|------|
| **From** | 02-legal-trust |
| **To** | 07-product-ui |
| **Priority** | P2 |
| **Goal** | `agents/02-legal-trust/POLICY_DRAFTS/upload-notice.md` 초안 기반으로 업로드 페이지에 저작권 동의 체크박스 UI 구현 |
| **Context** | 업로드 폼(`src/components/UploadForm.tsx`)에 체크박스 3종 추가: (1) 권리 확인 필수 체크박스 — 미체크 시 제출 비활성화, (2) AI 생성 여부 체크박스 (권장), (3) AI 생성 면책 고지 인포박스. 상세 문구는 `upload-notice.md` §1, §2 참고. DB 플래그 `license_confirmed`, `ai_generated` 는 06-data-backend와 협의. |
| **Acceptance** | - [ ] 권리 확인 체크박스 미체크 시 제출 버튼 비활성화<br>- [ ] AI 생성 면책 고지 인포박스 표시<br>- [ ] 체크박스 문구 한국어 버전 적용 (upload-notice.md §1-A)<br>- [ ] NSFW/신고 안내 링크 비디오 상세 페이지에 연결 |
| **Out of scope** | DB 스키마 변경 (06-data-backend 담당), ToS 전체 페이지 구현 |
| **Blocked by** | 없음 |
| **Status** | ✅ done |


### 2026-05-22 — reports 테이블 마이그레이션 SQL 적용

| 항목 | 내용 |
|------|------|
| **From** | 06-data-backend |
| **To** | 01-ops-sre |
| **Priority** | P1 |
| **Goal** | `supabase/migrations/add_reports.sql` 을 Supabase SQL Editor에서 실행 |
| **Context** | `PENDING_SQL.md` migration #7 — reports 테이블 + RLS (anon/authenticated INSERT, 중복 방지 unique index). 현재 `/api/report` 는 in-memory 배열만 사용하므로 서버 재시작 시 데이터 유실됨. |
| **Acceptance** | - [ ] SQL Editor에서 오류 없이 실행 완료<br>- [ ] `public.reports` 테이블 존재 확인<br>- [ ] `PENDING_SQL.md` #7 ⬜ → ✅ 표시<br>- [ ] `SHARED_CONTEXT.md` "⬜ reports DB 저장" → ✅ 갱신 |
| **Out of scope** | API route 수정 (별도 Data 에이전트 후속 작업) |
| **Blocked by** | 없음 |
| **Status** | ✅ done |

---

## 템플릿 (복사해서 Active에 추가)

```markdown
### YYYY-MM-DD — [작업 제목]

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 07-product-ui |
| **Priority** | P0 / P1 / P2 / P3 |
| **Goal** | 한 줄 목표 |
| **Context** | 관련 파일/링크/이전 대화 |
| **Acceptance** | 완료 조건 (체크리스트) |
| **Out of scope** | 하지 말 것 |
| **Blocked by** | 없음 / 에이전트명 |
| **Status** | ⬜ pending / 🔄 in-progress / ✅ done / 🔴 blocked |
```

---

## ✅ Done

_완료된 handoff는 날짜와 함께 여기로 이동_

### 2026-05-23 — 콘텐츠 사용 정책 결정 사항 workflow 반영

| 항목 | 내용 |
|------|------|
| **From** | 02-legal-trust |
| **To** | 00-orchestrator (완료) |
| **Result** | ROADMAP.md 업데이트: 다운로드 기능 미구현 명시, Phase 2 YouTube 채널 인증 추가. 후속 handoff 발행: 06-data-backend (ai_tool/ai_disclosed), 02-legal-trust (ToS 초안), 07-product-ui (다운로드 버튼 확인). |

### 2026-05-23 — likes_count atomic functions 마이그레이션 적용

| 항목 | 내용 |
|------|------|
| **From** | 06-data-backend |
| **To** | 01-ops-sre (완료) |
| **Result** | `add_likes_count_functions.sql` — `public.increment_video_likes(uuid)` / `public.decrement_video_likes(uuid)` 함수 생성 + `authenticated` role GRANT 완료. `PENDING_SQL.md` #8 ✅, `SHARED_CONTEXT.md` 갱신. |

### 2026-05-23 — /api/report DB 저장 감사 + Likes/saves 영속성 감사

| 항목 | 내용 |
|------|------|
| **From** | 06-data-backend |
| **To** | (완료, 배포됨) |
| **Result** | `/api/report` — Supabase DB INSERT 이미 완료 확인 (`cce538b`). `interactions.ts` — unlikeVideo count-corruption 버그 수정: 삭제된 행이 없을 때 `likes_count` 감소하지 않도록 `.select('id')` 반환값 체크 추가 → `96288d2` 배포 완료 |

### 2026-05-22 — Google OAuth + Supabase SQL 정상화

| 항목 | 내용 |
|------|------|
| **From** | 01-ops-sre |
| **To** | (완료, 사용자 확인) |
| **Result** | 로그인 정상 동작, SQL bundle Applied, 8/8 routes OK |
