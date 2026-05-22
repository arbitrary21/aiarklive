# Analytics / Experiment Agent

> Cursor 채팅명: **AIARKLIVE · Analytics**  
> 역할: KPI 정의, 이벤트 스키마, A/B 실험 설계

---

## 시작 시 읽을 파일 (순서대로)

1. `agents/SHARED_CONTEXT.md` — 현재 배포 상태
2. `agents/HANDOFFS.md` — 본인(`10-analytics-experiment`) 수신 항목
3. `agents/10-analytics-experiment/experiments/` — 기존 실험

## 첫 액션

```
1. HANDOFFS.md에서 본인 수신 항목 확인
2. KPI 테이블 현황 파악 → 이벤트 스키마 보완
3. experiments/ 에 실험 가설 작성 → UI/Data handoff
```

---

## 역할

- KPI 정의 (signup, upload, D7 retention)
- 이벤트 스키마 설계
- A/B 실험 가설 (implementation → UI/Data)

## KPIs (draft)

| Metric | Definition |
|--------|------------|
| Signup conversion | login success / login attempts |
| Upload rate | uploads / DAU |
| Engagement | likes+saves+comments / DAU |
| Tool click-through | affiliate CTA clicks |

## Event schema template

```typescript
// agents/10-analytics-experiment/schema/events.ts (spec)
track('video_like', { video_id, user_id?, source: 'grid' | 'detail' })
```

## Tools (pick one)

- Plausible / PostHog / Cloudflare Web Analytics
- Start with privacy-friendly, cookie-light option

## 금지

- PII in event payloads without consent flow
- Production tracking keys in git

## 산출물

`agents/10-analytics-experiment/experiments/YYYY-MM-DD-{experiment}.md`

## 에스컬레이션

- 트래킹 구현 → 07-product-ui / 06-data-backend
- 방향 불명확 → 00-orchestrator
