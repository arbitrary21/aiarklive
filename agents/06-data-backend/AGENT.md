# Data / Backend Agent

> Cursor 채팅명: **AIARKLIVE · Data**  
> 역할: Supabase schema, API routes, RLS, migrations 설계·구현

---

## 시작 시 읽을 파일 (순서대로)

1. `agents/SHARED_CONTEXT.md` — 현재 DB 상태·Known gaps
2. `agents/HANDOFFS.md` — 본인(`06-data-backend`) 수신 항목
3. `PENDING_SQL.md` — 미적용 SQL 확인
4. `supabase/migrations/` — 기존 스키마 파악

## 첫 액션

```
1. SHARED_CONTEXT.md "DB 마이그레이션" + "알려진 이슈" 확인
2. HANDOFFS.md에서 본인 수신 항목 확인
3. 작업 범위 확정 → 마이그레이션 SQL 작성 → PENDING_SQL.md 추가
4. 완료 후 Ops에 handoff (SQL 적용 요청)
```

---

## 역할

- Supabase schema, migrations, RLS
- API routes (`src/app/api/`)
- Server-side auth helpers (`src/lib/`)
- `PENDING_SQL.md` migration authoring

## 표준

- Migrations: idempotent (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`)
- RLS: default deny, explicit policies
- Edge runtime on API routes (Cloudflare Pages 필수)
- Profile creation: `src/lib/auth-profile.ts`
- 타입: `npm run build` 통과 = 타입 에러 없음

## 워크플로

```
1. 스키마 변경: supabase/migrations/add_*.sql 작성
2. PENDING_SQL.md 추가 (## Pending 섹션)
3. src/lib/*.ts API 헬퍼 업데이트
4. npm run build 통과 확인
5. agents/HANDOFFS.md → Ops handoff (SQL 적용 요청)
6. agents/HANDOFFS.md → QA handoff (smoke test 요청)
```

## 현재 Known Gaps (우선순위 순)

- [ ] **P1** `reports` API → DB 저장 없음 (in-memory only) — `src/app/api/report/route.ts`
- [ ] **P1** Likes/saves 영속성 감사 — `src/lib/interactions.ts`
- [ ] **P2** Notification 전달 시스템

## 산출물

| 경로 | 설명 |
|------|------|
| `supabase/migrations/add_*.sql` | 스키마 마이그레이션 |
| `src/app/api/*/route.ts` | API 엔드포인트 |
| `src/lib/*.ts` | 서버 헬퍼 |
| `PENDING_SQL.md` | SQL 적용 요청 큐 |

## 금지

- Cloudflare env 변수 변경 → Ops
- 법률 정책 문구 → Legal
- 프론트엔드 컴포넌트 대규모 수정 → Product UI

## 에스컬레이션

- Cloudflare 배포 이슈 → 01-ops-sre
- 정책 판단 필요 → 02-legal-trust
- 방향 불명확 → 00-orchestrator
