# Agent Handoff Queue

> 에이전트 간 작업 인계 공용 큐.  
> **수신 에이전트는 작업 시작 전 이 파일에서 자기 이름 확인.**  
> 완료 후 해당 항목을 `## Done` 섹션으로 이동.

---

## 📥 Active (미완료)

### 2026-05-23 — 프로필 편집 API + Supabase Storage 아바타 업로드

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 06-data-backend |
| **Priority** | P1 |
| **Goal** | 유저가 닉네임·자기소개·프로필 사진을 직접 변경할 수 있도록 API + Storage 구축 |
| **Context** | 현재 로그인은 Google OAuth 전용. `users` 테이블에 `username`, `bio`, `avatar_url` 컬럼 존재. `username`은 최초 설정 시 `/api/profile/setup` POST로만 변경 가능 — 이후 재편집 불가. `bio`는 DB 컬럼이 없을 수 있음(타입에는 존재). 프로필 사진은 Google avatar URL 고정. |
| **Acceptance** | - [ ] `users` 테이블에 `bio TEXT` 컬럼 존재 확인 (없으면 migration 추가)<br>- [ ] `PUT /api/profile/update` 라우트 — `{ username?, bio? }` 수신, 본인 인증 후 업데이트<br>- [ ] username 중복 체크 + 동일 유효성 검사 (`validateUsername`) 재사용<br>- [ ] Supabase Storage bucket `avatars` 생성 (public read, authenticated write)<br>- [ ] `POST /api/profile/avatar` 라우트 — multipart/form-data 수신, Storage upload, `users.avatar_url` 업데이트 후 URL 반환<br>- [ ] RLS: `users` 테이블에 `UPDATE (username, bio, avatar_url) WHERE id = auth.uid()` 정책 확인/추가<br>- [ ] `PENDING_SQL.md` 에 필요한 migration 항목 추가 |
| **Out of scope** | 프로필 편집 UI (07-product-ui 담당), 소셜 링크 등 추가 필드 |
| **Blocked by** | 없음 |
| **Status** | ⬜ pending |

### 2026-05-23 — 프로필 편집 UI (닉네임·소개·사진 변경)

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 07-product-ui |
| **Priority** | P1 |
| **Goal** | `/profile/me` 에서 닉네임·자기소개·프로필 사진을 변경하는 인라인 편집 UI 구현 |
| **Context** | `src/components/profile/ProfileView.tsx` — `isOwnProfile=true` 일 때 현재 "+ Add video" 링크만 있음. Google 로그인이라도 닉네임·bio·avatar는 자체 편집 가능해야 함. API 의존: `PUT /api/profile/update` + `POST /api/profile/avatar` (06-data-backend 선행 필요). `User` 타입: `{ username, bio, avatar_url }`. |
| **Acceptance** | - [ ] `ProfileView` — `isOwnProfile=true` 시 "프로필 편집" 버튼 표시<br>- [ ] `EditProfileModal` (또는 인라인 슬라이드): username, bio 텍스트 필드<br>- [ ] 아바타 이미지 클릭 시 파일 업로드 (PNG/JPG ≤5MB) → `POST /api/profile/avatar`<br>- [ ] 저장 후 AuthProvider 혹은 로컬 상태 즉시 반영 (새로고침 불필요)<br>- [ ] username 중복 에러 표시<br>- [ ] 로딩/에러 상태 처리<br>- [ ] 모바일 반응형 |
| **Out of scope** | 비밀번호 변경 (OAuth 전용), 계정 삭제, 소셜 링크 |
| **Blocked by** | 06-data-backend — `PUT /api/profile/update` + `POST /api/profile/avatar` 완료 후 진행 |
| **Status** | ⬜ pending |

### 2026-05-23 — `videos.ai_tool` + `videos.ai_disclosed` 컬럼 추가

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 06-data-backend |
| **Priority** | P1 |
| **Goal** | `videos` 테이블에 AI 도구 식별 컬럼 추가 — Affiliate CTA 정확도 향상 + 업로드 정책 반영 |
| **Context** | Legal 결정(2026-05-23): AI 생성 여부 및 사용 도구를 DB에 저장. 현재 `AffiliateCTABanner`는 `source_url` 파싱으로 도구 추론하나, 직접 컬럼이 있으면 정확도 100%. `upload-notice.md` §2의 AI 생성 체크박스 값을 영속화. |
| **Acceptance** | - [ ] `supabase/migrations/add_ai_tool_columns.sql` 작성<br>- [ ] `videos.ai_tool varchar(100) nullable` — 'kling', 'runway', 'pixverse' 등<br>- [ ] `videos.ai_disclosed boolean default false` — AI 생성 여부 공개 플래그<br>- [ ] RLS: `authenticated` INSERT/UPDATE 허용<br>- [ ] `PENDING_SQL.md` 에 항목 추가 |
| **Out of scope** | 업로드 폼 UI 수정 (07-product-ui 담당), Affiliate 로직 변경 |
| **Blocked by** | 없음 |
| **Status** | ⬜ pending |

### 2026-05-23 — ToS 초안 페이지 작성

| 항목 | 내용 |
|------|------|
| **From** | 00-orchestrator |
| **To** | 02-legal-trust |
| **Priority** | P2 |
| **Goal** | AIARKLIVE 서비스 이용약관(ToS) 초안 문서 작성 |
| **Context** | Legal 결정(2026-05-23): "다운로드·재배포·AI학습 목적 사용 금지" 조항 포함 필요. `agents/02-legal-trust/POLICY_DRAFTS/download-policy.md` 내용 기반. 최종 ToS는 `src/app/terms/page.tsx` 로 구현 (07-product-ui에 별도 handoff). |
| **Acceptance** | - [ ] `agents/02-legal-trust/POLICY_DRAFTS/tos-draft.md` 작성<br>- [ ] 다운로드·재배포·AI학습 금지 조항 포함<br>- [ ] YouTube 임베드 전용 정책 명시<br>- [ ] 사용자 콘텐츠 권리 확인 조항 포함<br>- [ ] 한국어 버전 (영문은 별도 검토) |
| **Out of scope** | 실제 법률 자문, ToS 페이지 UI 구현 |
| **Blocked by** | 없음 |
| **Status** | ⬜ pending |

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
