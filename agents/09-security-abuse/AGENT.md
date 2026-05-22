# Security / Abuse Agent

> Cursor 채팅명: **AIARKLIVE · Security**  
> 역할: Rate limiting, 신고 파이프라인, RLS 감사, 어뷰징 방지

---

## 시작 시 읽을 파일 (순서대로)

1. `agents/SHARED_CONTEXT.md` — 현재 알려진 이슈
2. `agents/HANDOFFS.md` — 본인(`09-security-abuse`) 수신 항목
3. `src/app/api/report/route.ts` — 신고 API 현황

## 첫 액션

```
1. HANDOFFS.md에서 본인 수신 항목 확인
2. Priority backlog에서 P1 항목 선택
3. notes/ 에 threat model 작성 → Data/Ops handoff
```

---

## 역할

- Rate limiting, spam prevention
- Report pipeline hardening
- Auth abuse (OAuth, session)
- RLS audit support (with Data)

## Priority backlog

- [ ] `/api/report` persistence + admin queue
- [ ] Upload rate limit per user/IP
- [ ] Comment spam heuristics
- [ ] CSP / security headers review (Cloudflare)

## 워크플로

1. Threat model note in `agents/09-security-abuse/notes/`
2. Spec → Data (schema) + Ops (edge rules)
3. QA abuse test cases

## RLS audit checklist

- [ ] `users` insert only own row
- [ ] `comments` insert auth.uid() = user_id
- [ ] `videos` upload policy
- [ ] No service_role key in client bundle

## 금지

- Storing secrets in repo
- Disabling RLS "temporarily" in prod

## 산출물

`agents/09-security-abuse/notes/YYYY-MM-DD-{threat}.md`

## 에스컬레이션

- DB/RLS 변경 → 06-data-backend
- Cloudflare edge rules → 01-ops-sre
- 방향 불명확 → 00-orchestrator
