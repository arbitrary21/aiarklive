# Cursor 채팅 시작 프롬프트

새 Cursor 채팅 생성 후 아래 프롬프트를 첫 메시지로 복사·붙여넣기.  
**채팅 이름**은 각 섹션 제목과 동일하게 설정할 것.

> **알림 구독**: ntfy 앱(iOS/Android) 설치 후 토픽 `aiarklive-agents` 구독  
> 웹: https://ntfy.sh/aiarklive-agents

---

## AIARKLIVE · Orchestrator

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/00-orchestrator/AGENT.md 를 순서대로 읽고,
HANDOFFS.md Active 항목 점검 후 ROADMAP.md P0/P1 기준 이번 스프린트 우선순위 3개 선정하고
에이전트별 handoff 발행해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Orchestrator" -Message "스프린트 우선순위 선정 + handoff 발행 완료"
```

---

## AIARKLIVE · Ops

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/01-ops-sre/AGENT.md 를 순서대로 읽고,
python check_deploy.py 실행 → PENDING_SQL.md 미적용 항목 처리 → agent_log.json 갱신해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Ops" -Message "배포 확인 + SQL 적용 완료"
```

---

## AIARKLIVE · Legal

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/02-legal-trust/AGENT.md 를 순서대로 읽고,
업로드 페이지용 저작권 고지 + AI 생성 콘텐츠 면책 체크박스 copy 초안을
agents/02-legal-trust/POLICY_DRAFTS/upload-notice.md 에 작성해줘. 코드 수정 없이 draft만.
완료 후: powershell -File scripts/notify.ps1 -Agent "Legal" -Message "업로드 저작권 고지 draft 완료"
```

---

## AIARKLIVE · Research

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/03-competitive-ux/AGENT.md 를 순서대로 읽고,
Pexels vs AIARKLIVE Discover 페이지 UX 비교 벤치마킹 문서를
agents/03-competitive-ux/research/2026-05-22-discover.md 에 작성해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Research" -Message "Discover UX 벤치마킹 완료"
```

---

## AIARKLIVE · Monetization

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/04-monetization/AGENT.md 를 순서대로 읽고,
Affiliate CTA (Runway, Kling, PixVerse) + Pro tier 2-track 수익화 spec을
agents/04-monetization/models/2026-05-22-affiliate-pro.md 에 작성해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Monetization" -Message "수익화 모델 spec 완료"
```

---

## AIARKLIVE · Growth

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/05-growth-seo/AGENT.md 를 순서대로 읽고,
/tools/kling 랜딩 페이지용 SEO brief (키워드, title, meta, H1, schema.org) 를
agents/05-growth-seo/briefs/2026-05-22-kling.md 에 작성해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Growth" -Message "Kling SEO brief 완료"
```

---

## AIARKLIVE · Data

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/06-data-backend/AGENT.md 를 순서대로 읽고,
Known Gaps P1: reports API DB 저장 마이그레이션 설계 + idempotent SQL을
supabase/migrations/add_reports.sql 에 작성하고 PENDING_SQL.md 에 추가해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Data" -Message "reports 마이그레이션 SQL 작성 완료"
```

---

## AIARKLIVE · UI

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/07-product-ui/AGENT.md 를 순서대로 읽고,
HANDOFFS.md Active 항목 중 본인 수신 작업 구현해줘.
(Active 항목 없으면: 업로드 페이지에 저작권 동의 체크박스 UI 추가해줘.)
완료 후: powershell -File scripts/notify.ps1 -Agent "UI" -Message "UI 작업 완료 + 배포됨"
```

---

## AIARKLIVE · Editorial

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/08-content-editorial/AGENT.md 를 순서대로 읽고,
Discover 컬렉션 3개 기획 brief (제목, 설명, 예시 태그 5개, 추천 AI 도구) 를
agents/08-content-editorial/briefs/2026-05-22-collections.md 에 작성해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Editorial" -Message "Discover 컬렉션 3개 brief 완료"
```

---

## AIARKLIVE · Security

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/09-security-abuse/AGENT.md 를 순서대로 읽고,
/api/report 영속성 없는 문제 threat model + 해결 spec을
agents/09-security-abuse/notes/2026-05-22-report-persistence.md 에 작성하고
06-data-backend handoff 발행해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Security" -Message "report 위협 모델 + handoff 발행 완료"
```

---

## AIARKLIVE · Analytics

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/10-analytics-experiment/AGENT.md 를 순서대로 읽고,
MVP 이벤트 스키마 10개 (video_view, video_like, video_save, comment_post,
upload_start, upload_complete, follow_user, search_query, affiliate_click, login_success)
를 agents/10-analytics-experiment/experiments/2026-05-22-event-schema.md 에 정의해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Analytics" -Message "MVP 이벤트 스키마 10개 정의 완료"
```

---

## AIARKLIVE · QA

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/11-qa-release/AGENT.md 를 순서대로 읽고,
전체 smoke checklist 실행하고 결과를
agents/11-qa-release/checklists/2026-05-22.md 에 기록해줘.
실패 항목 있으면 HANDOFFS.md 에 담당 에이전트 handoff 발행해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "QA" -Message "Smoke test 완료 — 결과 확인 요망" -Priority "high"
```

---

## AIARKLIVE · Community

```
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/12-community-ops/AGENT.md 를 순서대로 읽고,
/welcome 온보딩 화면용 FAQ 10개 + 닉네임 설정 안내 문구를
agents/12-community-ops/docs/faq.md 에 작성해줘.
완료 후: powershell -File scripts/notify.ps1 -Agent "Community" -Message "온보딩 FAQ + 닉네임 안내 완료"
```
