# AIARKLIVE Monetization Spec — 2026-05-23

> **작성:** 04-monetization  
> **상태:** Draft → Handoff to 07-product-ui (Affiliate CTA)  
> **다음 단계:** 07-product-ui → Affiliate CTA 구현, 06-data-backend → Pro tier DB 스키마

---

## A. Affiliate CTA Spec (즉시 구현 가능)

### 대상 AI 도구

| 도구 | Affiliate 프로그램 | 예상 커미션 | 링크 |
|------|-------------------|------------|------|
| **Kling AI** | Kling Affiliate Program (kwai.com) | 가입 전환당 $5–$15, 구독 10–20% rev-share | https://klingai.com (affiliate 신청: partner 페이지) |
| **Runway** | Runway Affiliate Program | 신규 구독 20–30% (첫 3개월), 월 최대 $100+ per referral | https://runwayml.com/affiliate |
| **PixVerse** | PixVerse Partner Program | 신규 유료 전환 $5–$10 고정, 쿠폰 협업 가능 | https://pixverse.ai (파트너 문의: contact@pixverse.ai) |

> **주의 (Legal flag):** 국내 정보통신망법·미국 FTC 가이드라인에 따라 "광고" 또는 "파트너 링크" 명시 필수 → 02-legal-trust 연계 필요.

### CTA 위치

```
VideoLightbox (비디오 상세 팝업/페이지)
  └─ VideoActions 컴포넌트 하단
       └─ <AffiliateCTABanner tool="kling|runway|pixverse" />
```

- **1차 위치:** 비디오 플레이어 하단 메타 영역 (좋아요/저장 버튼 아래)
- **2차 위치 (폴백):** Discover 카드 hover overlay 하단 1-line 배너

### CTA 문구 (한국어 기본, 영어 폴백)

| 도구 | 한국어 문구 | 영어 문구 |
|------|------------|----------|
| Kling | 이 영상은 **Kling AI**로 제작되었습니다 → [지금 무료로 시작하기 ↗] | Made with **Kling AI** → [Try it free ↗] |
| Runway | 이 영상은 **Runway**로 제작되었습니다 → [Runway 무료 체험 ↗] | Made with **Runway** → [Start free ↗] |
| PixVerse | 이 영상은 **PixVerse**로 제작되었습니다 → [PixVerse 시작하기 ↗] | Made with **PixVerse** → [Get started ↗] |

> 도구 정보 없음(미입력)일 경우: "AI로 제작된 영상입니다. AI 영상 제작 도구 둘러보기 →" (범용 링크)

### 데이터 의존성

- `videos` 테이블 `source_url` 컬럼: ✅ 이미 적용됨 (2026-05-22)
- `videos` 테이블에 `ai_tool` 컬럼 추가 필요 (`'kling' | 'runway' | 'pixverse' | 'other' | null`)  
  → 06-data-backend에 별도 handoff 발행 예정
- 현재는 `source_url` 도메인 파싱으로 도구 추론 가능 (MVP 대안)

### 07-product-ui 구현 Spec

```tsx
// 컴포넌트: src/components/video/AffiliateCTABanner.tsx
// Props:
interface AffiliateCTABannerProps {
  tool: 'kling' | 'runway' | 'pixverse' | 'other' | null;
  sourceUrl?: string; // fallback: parse domain
}
```

**스타일 가이드:**
- 배경: `bg-white/5 dark:bg-white/5` (반투명 글래스)
- 테두리: `border border-white/10 rounded-lg`
- 텍스트: `text-sm text-gray-300`
- 링크 버튼: `text-white font-semibold underline underline-offset-2 hover:text-blue-400`
- 패딩: `px-4 py-3`
- 도구 로고 아이콘: 각 도구 파비콘 16px (선택적)
- `rel="nofollow noopener sponsored"` 필수 (SEO + 광고 disclosure)

**도구 추론 로직 (MVP, ai_tool 컬럼 없을 때):**
```ts
function inferTool(sourceUrl?: string): AffiliateCTABannerProps['tool'] {
  if (!sourceUrl) return null;
  if (sourceUrl.includes('kling') || sourceUrl.includes('kwai')) return 'kling';
  if (sourceUrl.includes('runwayml') || sourceUrl.includes('runway')) return 'runway';
  if (sourceUrl.includes('pixverse')) return 'pixverse';
  return 'other';
}
```

---

## B. Pro Subscription 2-Track Spec

### Free Tier (기본)

| 기능 | 제한 |
|------|------|
| 영상 탐색 (Discover) | 무제한 |
| 좋아요 / 저장 / 댓글 | 무제한 |
| 팔로우 | 무제한 |
| 비디오 업로드 | 링크 공유 전용 (직접 파일 업로드 불가) |
| 프로필 커스터마이징 | 기본 (이름, 아바타) |
| Analytics | 내 영상 기본 조회수만 |

### Pro Tier ($9.99/월 또는 $79.99/년)

| 기능 | 설명 |
|------|------|
| **직접 파일 업로드** | MP4/WebM 최대 500MB, R2 스토리지 연동 |
| **Analytics 대시보드** | 조회수 추이, 좋아요/저장 그래프, 팔로워 유입 소스 |
| **Pro 배지** | 프로필 + 영상 카드에 ✦ Pro 뱃지 표시 |
| **우선 노출 (Boost)** | Discover 피드에서 주 1회 상단 노출 슬롯 |
| **조기 기능 접근** | 베타 기능 우선 사용권 |
| **광고 제거** | (향후 디스플레이 광고 도입 시) |

### 가격 제안

| 플랜 | 월정액 | 연간 | 월 환산 | 절감 |
|------|--------|------|---------|------|
| Pro Monthly | $9.99/월 | — | $9.99 | — |
| Pro Annual | — | $79.99/년 | $6.67 | 33% 할인 |

> 참고: Civitai $14/월, Pika Pro $35/월, Runway Standard $12/월 — AIARKLIVE는 소셜 플랫폼 포지셔닝이므로 진입 가격 $9.99 적합.

### 필요 DB 변경사항

```sql
-- users 테이블 컬럼 추가
ALTER TABLE public.users
  ADD COLUMN plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'pro')),
  ADD COLUMN plan_expires_at TIMESTAMPTZ,
  ADD COLUMN stripe_customer_id TEXT,
  ADD COLUMN stripe_subscription_id TEXT;

-- 인덱스
CREATE INDEX idx_users_plan ON public.users(plan);
CREATE INDEX idx_users_stripe_customer ON public.users(stripe_customer_id);
```

> → 06-data-backend handoff 필요 (별도 발행 예정)

### 결제 연동: Stripe (권장)

| 항목 | 내용 |
|------|------|
| **왜 Stripe?** | Next.js/Edge 호환, Webhook 지원, 한국 결제 지원 (카드+PayPal) |
| **구현 방식** | Stripe Checkout (hosted) → Webhook → DB plan 업데이트 |
| **주요 API Route** | `POST /api/billing/checkout` — Stripe Checkout Session 생성 |
| | `POST /api/billing/webhook` — `customer.subscription.updated/deleted` 처리 |
| | `GET /api/billing/portal` — Stripe Customer Portal 리다이렉트 |
| **환경변수 필요** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| **구현 공수** | ~3–5일 (BE: webhook + DB, FE: 결제 버튼 + 상태 표시) |

**대안 검토:**
- **Lemon Squeezy:** Stripe보다 간단, 세금 처리 내장 — 소규모 스타트업 친화적, 한국 카드 지원 양호
- **Paddle:** B2B/SaaS 특화, Merchant of Record — 세금 자동 처리 강점

> **권고:** MVP는 Stripe로 시작, 글로벌 확장 시 Paddle 전환 검토.

---

## C. ROI / Effort 매트릭스

| 모델 | 예상 월 수익 (초기) | 구현 난이도 | 우선순위 | 비고 |
|------|-------------------|-----------|---------|------|
| **Affiliate CTAs** | $100–$500 | ⭐ Low | 🔴 P1 (즉시) | source_url 이미 있음, 컴포넌트 1개 |
| **Pro Subscription** | $500–$2,000 | ⭐⭐⭐ High | 🟡 P2 (다음) | DB+Stripe+FE 필요 |
| **Sponsored Challenges** | $500–$5,000/캠페인 | ⭐⭐ Med | 🟢 P3 (나중) | Legal 검토 필수 |
| **Display Ads** | $50–$300 | ⭐⭐ Med | 🔵 Defer | 트래픽 스케일 필요 |
| **API / Embed B2B** | $1,000+ | ⭐⭐⭐⭐ Very High | 🔵 Explore | Enterprise 단계 |

### 의사결정 요약

```
지금 당장 → Affiliate CTAs (컴포넌트 1개, 수익 즉시 발생 가능)
3개월 내  → Pro Subscription MVP (Stripe + DB + FE)
6개월+    → Sponsored Challenges (Legal 정책 완성 후)
스케일 후 → Display Ads, B2B API
```

---

## 의존성 / 후속 작업 요약

| 작업 | 담당 | 상태 |
|------|------|------|
| Affiliate CTA 컴포넌트 구현 | 07-product-ui | 📤 Handoff 발행됨 |
| `ai_tool` 컬럼 추가 | 06-data-backend | ⬜ 별도 발행 예정 |
| Pro tier DB 스키마 (plan 컬럼) | 06-data-backend | ⬜ 별도 발행 예정 |
| Stripe 결제 연동 | 07-product-ui + 06-data-backend | ⬜ P2 시작 시 |
| Affiliate disclosure 문구 | 02-legal-trust | ⬜ 검토 요청 예정 |
