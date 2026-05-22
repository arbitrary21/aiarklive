# Editorial Brief — Discover 컬렉션 & 챌린지 기획
**작성일:** 2026-05-23  
**작성자:** AIARKLIVE · Editorial (Agent 08)  
**상태:** Draft — Data(06) / UI(07) handoff 전

---

## 참조 데이터 구조

`src/lib/discover.ts` — `DiscoverCollection` 인터페이스

```ts
interface DiscoverCollection {
  id: string;         // URL-safe slug
  title: string;      // 표시 제목
  description: string; // 한 줄 설명
  href: string;       // /explore?{query}
  accent: string;     // Tailwind gradient class
}
```

기존 컬렉션 (참고 — 중복 금지):  
`cinematic-kling` · `runway-loops` · `suno-mv` · `experimental` · `short-form` · `animation`

---

## 신규 컬렉션 기획 3개

---

### 컬렉션 1 — 트렌딩 AI 영상

| 항목 | 내용 |
|------|------|
| **ID** | `trending-this-week` |
| **제목 (한국어)** | 이번 주 인기 AI 영상 |
| **제목 (영문)** | Trending This Week |
| **한 줄 설명** | 지난 7일간 좋아요·저장이 폭발한 영상들 |
| **href** | `/explore?sort=trending&window=7d` |
| **accent** | `from-brand-500/30 to-amber-500/15` |

**추천 예시 태그 5개**  
`#trending` · `#viral` · `#week-pick` · `#most-liked` · `#hot-now`

**추천 AI 도구**  
Kling, Runway Gen-3, PixVerse, Hailuo (MiniMax), Vidu

**타깃 사용자 페르소나**  
> "AI 영상에 막 입문한 20-30대 — 뭐가 요즘 핫한지 빠르게 파악하고 싶은 캐주얼 브라우저"

**큐레이션 기준**  
- 최근 7일 이내 업로드  
- `likes_count + saves_count` 합산 상위 50개  
- 동일 크리에이터 최대 3개로 제한 (다양성 확보)  
- 신규 가입 사용자 첫 화면 기본 컬렉션으로 노출 권장

**Data handoff 요청**  
`/explore?sort=trending&window=7d` 쿼리 파라미터 처리 로직 — `videos` 테이블에서  
`created_at >= now() - interval '7 days'` + `ORDER BY (likes_count + saves_count) DESC` 구현 필요 → **06-data-backend**

---

### 컬렉션 2 — AI 도구별 쇼케이스

| 항목 | 내용 |
|------|------|
| **ID** | `tool-starter-kit` |
| **제목 (한국어)** | AI 도구 입문 쇼케이스 |
| **제목 (영문)** | Tool Starter Kit |
| **한 줄 설명** | Kling·Runway·PixVerse 각 도구의 대표작으로 배우는 입문 가이드 |
| **href** | `/explore?collection=tool-starter-kit` |
| **accent** | `from-cyan-500/25 to-violet-500/10` |

**추천 예시 태그 5개**  
`#kling-tutorial` · `#runway-gen3` · `#pixverse-guide` · `#beginners` · `#tool-compare`

**추천 AI 도구**  
Kling 2.0, Runway Gen-3 Alpha, PixVerse v2, Hailuo Video, Pika 2.1

**타깃 사용자 페르소나**  
> "AI 영상 생성 도구를 처음 쓰려는 크리에이터 — 어떤 도구로 시작할지 몰라서 실제 결과물을 비교해보고 싶은 사람"

**큐레이션 기준**  
- `ai_tool` 태그가 명확히 붙어 있는 영상  
- 각 도구별 추천작 5-8개씩 균형 배분  
- 영상 설명(description)에 프롬프트/파라미터 공유한 크리에이터 우대  
- 기술 수준: 입문~중급 (과도하게 난해한 실험 영상 제외)

**UI handoff 요청**  
이 컬렉션 카드에 도구 로고 배지(`Kling` / `Runway` / `PixVerse` 등) 태그 표시 요청 → **07-product-ui**

---

### 컬렉션 3 — 챌린지 참여작 모음

| 항목 | 내용 |
|------|------|
| **ID** | `challenge-gallery` |
| **제목 (한국어)** | 챌린지 갤러리 |
| **제목 (영문)** | Challenge Gallery |
| **한 줄 설명** | 커뮤니티 챌린지에 제출된 창의적인 참여작 모음 |
| **href** | `/explore?tag=challenge` |
| **accent** | `from-rose-500/25 to-fuchsia-500/10` |

**추천 예시 태그 5개**  
`#challenge` · `#community-pick` · `#aiarklive-challenge` · `#weekly` · `#submitted`

**추천 AI 도구**  
제한 없음 — 도구 다양성이 컬렉션의 강점

**타깃 사용자 페르소나**  
> "커뮤니티 소속감을 원하는 기존 사용자 + 챌린지 참여 동기를 자극받을 신규 가입자"

**큐레이션 기준**  
- `#challenge` 또는 `#aiarklive-challenge` 태그 포함 영상  
- 최신 챌린지 기간 내 업로드  
- 운영팀 추천(`is_featured = true`) 영상 상단 고정  
- 주간 챌린지 종료 후 수상작 3개에 별도 배지 표시

**Data handoff 요청**  
`tags` 컬럼 배열 필터 쿼리 지원 확인 → 없으면 `videos.tags @> ARRAY['challenge']` 또는 `is_challenge_entry boolean` 컬럼 추가 검토 → **06-data-backend**

---

## 주간 챌린지 기획 초안

---

### 챌린지 #001 — "나만의 미래 도시"

| 항목 | 내용 |
|------|------|
| **주제** | AI로 상상한 2050년 도시 풍경 |
| **부제** | 한국어 프롬프트로 만든 미래 도시 — 빌딩 숲부터 해저 도시까지 |
| **해시태그** | `#AIARKChallenge001` `#미래도시` `#FutureCity` |
| **기간** | 2026-05-26 (월) 00:00 KST ~ 2026-06-01 (일) 23:59 KST |

**참여 방법**  
1. Kling · Runway · PixVerse 등 AI 영상 도구로 "미래 도시" 주제 영상 제작 (15초~60초)  
2. AIARKLIVE에 업로드 시 해시태그 `#AIARKChallenge001` 포함  
3. 설명란에 사용한 AI 도구명 + 핵심 프롬프트(한 줄) 기재 권장  

**심사 기준**  
- 창의성 (30%) — 얼마나 독창적인 미래 비전인가  
- 완성도 (30%) — 영상 품질, 연출  
- 프롬프트 공유 (20%) — 커뮤니티 학습 기여  
- 반응 (20%) — 기간 내 좋아요 + 저장 합산  

**수상**  
- 🥇 1위: 프로필 Featured Creator 배지 + 홈 피처드 노출 1주  
- 🥈 2위: 프로필 Badge 지급  
- 🥉 3위: 프로필 Badge 지급  
- 전원: `#챌린지참여자` 프로필 배지

**운영 노트**  
- 수상작 발표: 2026-06-03 (수) — `challenge-gallery` 컬렉션 상단 고정  
- 운영 채널 공지 초안 → **12-community-ops** handoff 필요  
- 배지/Featured 구현 → **07-product-ui** handoff 필요

---

## Handoff 요약

| 대상 에이전트 | 요청 내용 | 우선순위 |
|--------------|----------|---------|
| **06-data-backend** | `trending` 정렬 쿼리 (`7d window`), `tags` 배열 필터 지원 | P1 |
| **07-product-ui** | 도구 배지 컴포넌트, 챌린지 배지 UI, Featured Creator 배지 | P1 |
| **12-community-ops** | 챌린지 #001 공지 문안 작성, SNS 크로스포스트 | P2 |

---

## discover.ts 반영 제안 (Data → UI 검토 후 merge)

```ts
// 추가 제안 — src/lib/discover.ts
{
  id: "trending-this-week",
  title: "Trending This Week",
  description: "This week's most-liked and saved AI videos",
  href: "/explore?sort=trending&window=7d",
  accent: "from-brand-500/30 to-amber-500/15",
},
{
  id: "tool-starter-kit",
  title: "Tool Starter Kit",
  description: "Best beginner examples from Kling, Runway, and PixVerse",
  href: "/explore?collection=tool-starter-kit",
  accent: "from-cyan-500/25 to-violet-500/10",
},
{
  id: "challenge-gallery",
  title: "Challenge Gallery",
  description: "Creative submissions from the community challenges",
  href: "/explore?tag=challenge",
  accent: "from-rose-500/25 to-fuchsia-500/10",
},
```

> ⚠️ `discover.ts` 직접 수정은 UI 에이전트(07)와 조율 후 진행 — 현재 파일은 정적 배열이므로 DB 기반으로 전환 시 Data 에이전트(06)와 스키마 협의 필요.
