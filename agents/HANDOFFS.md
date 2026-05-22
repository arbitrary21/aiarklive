# Agent Handoff Queue

> 에이전트 간 작업 인계 공용 큐.  
> **수신 에이전트는 작업 시작 전 이 파일에서 자기 이름 확인.**  
> 완료 후 해당 항목을 `## Done` 섹션으로 이동.

---

## 📥 Active (미완료)

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
| **Status** | ⬜ pending |


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
