# Agent Handoff Queue

> 에이전트 간 작업 인계 공용 큐.  
> **수신 에이전트는 작업 시작 전 이 파일에서 자기 이름 확인.**  
> 완료 후 해당 항목을 `## Done` 섹션으로 이동.

---

## 📥 Active (미완료)

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
| **Goal** | UI에 비디오 다운로드 버튼이 없는지 확인, `/api/download/thumbnail` 외 동영상 다운로드 경로 차단 |
| **Context** | Legal 결정(2026-05-23): YouTube ToS + DMCA §1201 리스크로 다운로드 기능 영구 미제공. `/api/download/thumbnail` (썸네일 이미지 다운로드)는 허용. 동영상 파일 다운로드 버튼/API는 존재하면 제거. |
| **Acceptance** | - [ ] VideoLightbox / VideoActions 다운로드 버튼 없음 확인 (있으면 제거)<br>- [ ] 동영상 파일 다운로드 API route 없음 확인<br>- [ ] `/api/download/thumbnail` 썸네일 다운로드는 유지 (이미지만, OK) |
| **Out of scope** | 썸네일 다운로드 제거, ToS 페이지 구현 |
| **Blocked by** | 없음 |
| **Status** | ⬜ pending |

### 2026-05-23 — sitemap + OG 이미지 + /tools/kling 페이지 구현

| 항목 | 내용 |
|------|------|
| **From** | 05-growth-seo |
| **To** | 07-product-ui |
| **Priority** | P1 |
| **Goal** | SEO 핵심 3종 구현: `robots.ts`, `sitemap.ts`, `video/[id]/opengraph-image.tsx` + `/tools/kling` 랜딩 페이지 |
| **Context** | `agents/05-growth-seo/briefs/2026-05-23-kling-seo.md` — 전체 spec 포함 (섹션 B: sitemap/robots, 섹션 C: OG 이미지, 섹션 A: /tools/kling SEO). Stack: Next.js 15 App Router + Cloudflare Pages edge. |
| **Acceptance** | - [ ] `src/app/robots.ts` 생성 — auth 라우트 disallow, GPTBot disallow<br>- [ ] `src/app/sitemap.ts` 생성 — 정적 라우트 + DB에서 video/profile 동적 라우트 (runtime: 'nodejs')<br>- [ ] `src/app/video/[id]/opengraph-image.tsx` 생성 — 1200×630, 썸네일+제목+AI도구명+작성자<br>- [ ] `src/app/video/[id]/page.tsx` — `generateMetadata`에 OG/Twitter 카드 추가<br>- [ ] `src/app/tools/kling/page.tsx` 생성 — SEO brief A 섹션 기반 (H1, H2 구조, 커뮤니티 영상 피드, schema.org) |
| **Out of scope** | 키워드 카피 집필 (08-editorial 담당), DB 스키마 변경 |
| **Blocked by** | 없음 |
| **Files** | `agents/05-growth-seo/briefs/2026-05-23-kling-seo.md` |
| **Status** | ⬜ pending |

### 2026-05-23 — 업로드 & 댓글 Rate Limit 구현

| 항목 | 내용 |
|------|------|
| **From** | 09-security-abuse |
| **To** | 01-ops-sre |
| **Priority** | P1 |
| **Goal** | Cloudflare Workers KV 기반 업로드 rate limit 엣지 구현 (유저당 10회/시간, IP당 20회/시간) |
| **Context** | `agents/09-security-abuse/notes/2026-05-23-security-audit.md` §A 참고. Cloudflare Pages + Next.js edge middleware 조합. KV namespace 생성 후 `wrangler.toml` 바인딩 추가. `/api/upload` 엔트리포인트에 rate limit 미들웨어 적용. |
| **Acceptance** | - [ ] Cloudflare KV namespace `RATE_LIMIT_KV` 생성<br>- [ ] wrangler.toml 바인딩 추가<br>- [ ] 업로드 route에 user_id/IP 이중 rate limit 적용<br>- [ ] 초과 시 `429 + Retry-After` 응답 확인 |
| **Out of scope** | 댓글 spam trigger (06-data-backend 담당) |
| **Blocked by** | 없음 |
| **Status** | ⬜ pending |

### 2026-05-23 — 댓글 스팸 방지 DB 마이그레이션

| 항목 | 내용 |
|------|------|
| **From** | 09-security-abuse |
| **To** | 06-data-backend |
| **Priority** | P2 |
| **Goal** | 댓글 중복 방지 trigger + `is_flagged` 컬럼 마이그레이션 작성 및 적용 |
| **Context** | `agents/09-security-abuse/notes/2026-05-23-security-audit.md` §C 참고. `check_comment_spam()` trigger — 60초 내 동일 content 재작성 방지. `comments` 테이블에 `is_flagged boolean default false` 컬럼 추가 (admin 검토 큐용). |
| **Acceptance** | - [ ] `supabase/migrations/add_comment_spam_guard.sql` 작성<br>- [ ] trigger: 60초 내 동일 content 시 `P0001` 에러 발생<br>- [ ] `is_flagged` 컬럼 추가<br>- [ ] `PENDING_SQL.md` 에 항목 추가 |
| **Out of scope** | admin 큐 UI, rate limit API 변경 |
| **Blocked by** | 없음 |
| **Status** | ⬜ pending |

### 2026-05-23 — Affiliate CTA 배너 컴포넌트 구현

| 항목 | 내용 |
|------|------|
| **From** | 04-monetization |
| **To** | 07-product-ui |
| **Priority** | P1 |
| **Goal** | 비디오 상세 페이지(VideoLightbox / VideoActions)에 AI 도구 Affiliate CTA 배너 컴포넌트 추가 |
| **Context** | Spec: `agents/04-monetization/models/2026-05-23-monetization-spec.md` §A 참고. `videos.source_url` 컬럼은 이미 존재(✅ 2026-05-22). MVP는 source_url 도메인 파싱으로 Kling/Runway/PixVerse 추론. `ai_tool` 전용 컬럼은 별도 06-data-backend 작업 예정이므로 현재는 없다고 가정. |
| **Acceptance** | - [ ] `src/components/video/AffiliateCTABanner.tsx` 컴포넌트 생성<br>- [ ] `inferTool(sourceUrl)` 유틸 함수 포함<br>- [ ] VideoLightbox 또는 VideoActions 하단에 배너 삽입<br>- [ ] `rel="nofollow noopener sponsored"` 적용<br>- [ ] 도구 미식별 시 배너 미표시(null 처리)<br>- [ ] Tailwind 스타일: 반투명 글래스 bg, 소형 텍스트, 외부 링크 아이콘 |
| **Out of scope** | `ai_tool` DB 컬럼 추가 (06-data-backend 담당), Stripe 결제 연동, Pro tier UI |
| **Blocked by** | 없음 |
| **Status** | ⬜ pending |

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
