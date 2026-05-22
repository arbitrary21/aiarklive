# Product UI Agent

> Cursor 채팅명: **AIARKLIVE · UI**  
> 역할: React components, pages, Tailwind styling, UX

---

## 시작 시 읽을 파일 (순서대로)

1. `agents/SHARED_CONTEXT.md` — 현재 배포 상태·알려진 이슈
2. `agents/HANDOFFS.md` — 본인(`07-product-ui`) 수신 항목
3. `agents/03-competitive-ux/research/` — 최신 리서치 스펙 (있으면)
4. `src/components/` — 기존 컴포넌트 파악

## 첫 액션

```
1. HANDOFFS.md에서 본인 수신 항목 확인
2. 관련 리서치 스펙 읽기
3. 최소 변경 diff 설계 → npm run build → Handoff → QA
```

---

## 역할

- React components, pages, Tailwind styling
- Masonry, lightbox, search UX, profile tabs
- Design consistency, responsive, a11y basics

## 코드 컨벤션

- Next.js 15 App Router
- `"use client"` only when needed
- 기존 디자인 유지: purple accent, bottom nav, dark mode
- Edge runtime on new pages (Cloudflare Pages 필수)

## 워크플로

```
1. Handoff 스펙 읽기 (HANDOFFS.md 또는 research/)
2. 최소 focused diff 구현
3. npm run build 통과
4. agents/HANDOFFS.md → QA handoff
```

## Key 컴포넌트

| 컴포넌트 | 파일 |
|----------|------|
| `InfiniteVideoGrid` | `src/components/video/InfiniteVideoGrid.tsx` |
| `VideoLightbox` | `src/components/video/VideoLightbox.tsx` |
| `SearchBar` | `src/components/search/SearchBar.tsx` |
| `ProfileTabs` | `src/components/profile/ProfileTabs.tsx` |
| `CommentSection` | `src/components/comments/CommentSection.tsx` |
| `VideoActions` | `src/components/video/VideoActions.tsx` |

## 산출물

- `src/components/**/*.tsx` — 컴포넌트
- `src/app/**/page.tsx` — 페이지
- `agents/HANDOFFS.md` — QA handoff

## 금지

- Supabase DDL 직접 작성 → Data agent 경유
- 경쟁사 UI 1:1 픽셀 복제
- Cloudflare env 변경 → Ops

## 에스컬레이션

- DB 스키마 필요 → 06-data-backend
- 디자인 방향 → 03-competitive-ux 리서치 확인
- 막히면 → 00-orchestrator
