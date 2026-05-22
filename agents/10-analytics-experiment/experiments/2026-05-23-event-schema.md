# AIARKLIVE — Event Schema v1.0

> **작성일:** 2026-05-23  
> **작성자:** AIARKLIVE · Analytics  
> **목적:** 핵심 사용자 행동 10종 이벤트 스키마 정의 및 KPI 대시보드 지표 제안

---

## 이벤트 스키마

### 1. `video_view` — 영상 재생 시작

| 항목 | 값 |
|------|-----|
| **트리거** | 영상 3초 이상 재생 시 (IntersectionObserver or timeupdate >= 3s) |
| **수집 위치** | `src/components/VideoLightbox.tsx` — 영상 열릴 때 + 3초 경과 시 |

**Properties:**
```typescript
{
  video_id:  string,           // videos.id (UUID)
  user_id:   string | null,    // 비로그인 허용 (anonymous 추적)
  source:    'feed' | 'discover' | 'search' | 'direct' | 'profile',
  ai_tool:   string,           // videos.ai_tools[0] 또는 'unknown'
  platform:  string,           // videos.platform (youtube, tiktok 등)
  genre:     string | null,    // videos.genre
}
```

**구현 노트:** `views_count`는 이미 DB에 존재 (`videos.views_count`). 이벤트는 별도 analytics 시스템으로 전송 — DB 카운터와 이중화.

---

### 2. `video_like` — 좋아요 클릭

| 항목 | 값 |
|------|-----|
| **트리거** | 좋아요 버튼 클릭 (로그인 필수) |
| **수집 위치** | `src/components/VideoActions.tsx` — `likeVideo()` 호출 성공 직후 |

**Properties:**
```typescript
{
  video_id:  string,
  user_id:   string,           // 로그인 필수 이벤트
  source:    'feed' | 'lightbox' | 'profile',
  ai_tool:   string,
  action:    'like' | 'unlike',
}
```

**서버 함수:** `src/lib/interactions.ts` → `likeVideo()` / `unlikeVideo()` (atomic RPC 사용 중)

---

### 3. `video_save` — 저장 클릭

| 항목 | 값 |
|------|-----|
| **트리거** | 저장(북마크) 버튼 클릭 |
| **수집 위치** | `src/components/VideoActions.tsx` — `saveVideo()` 호출 성공 직후 |

**Properties:**
```typescript
{
  video_id:  string,
  user_id:   string,
  source:    'feed' | 'lightbox' | 'profile',
  ai_tool:   string,
  action:    'save' | 'unsave',
}
```

**서버 함수:** `src/lib/interactions.ts` → `saveVideo()` / `unsaveVideo()`

---

### 4. `comment_post` — 댓글 작성

| 항목 | 값 |
|------|-----|
| **트리거** | 댓글 작성 완료 (submit) |
| **수집 위치** | `src/components/CommentSection.tsx` — POST 성공 직후 |

**Properties:**
```typescript
{
  video_id:      string,
  user_id:       string,
  comment_length: number,      // 댓글 글자 수 (PII 없이 패턴 파악)
  ai_tool:       string,
}
```

**주의:** 댓글 본문 내용은 절대 포함 금지 (PII/개인정보).

---

### 5. `upload_start` — 업로드 시작

| 항목 | 값 |
|------|-----|
| **트리거** | 업로드 폼 첫 제출 시도 시 |
| **수집 위치** | `src/components/UploadForm.tsx` — form submit handler 진입 시 |

**Properties:**
```typescript
{
  user_id:   string,
  platform:  string,           // 선택한 플랫폼 (youtube, tiktok 등)
  ai_tools:  string[],         // 태그한 AI 도구 목록
  genre:     string | null,
}
```

---

### 6. `upload_complete` — 업로드 완료

| 항목 | 값 |
|------|-----|
| **트리거** | 업로드 성공 (DB INSERT 완료, `createVideo()` 반환 후) |
| **수집 위치** | `src/components/UploadForm.tsx` — `createVideo()` 성공 직후 |

**Properties:**
```typescript
{
  user_id:   string,
  video_id:  string,           // 새로 생성된 videos.id
  platform:  string,
  ai_tools:  string[],
  genre:     string | null,
  has_prompt: boolean,         // prompt 필드 입력 여부
}
```

**서버 함수:** `src/lib/videos.ts` → `createVideo()`

---

### 7. `follow_user` — 팔로우

| 항목 | 값 |
|------|-----|
| **트리거** | 팔로우 버튼 클릭 |
| **수집 위치** | `src/components/auth/FollowButton.tsx` — 팔로우 성공 직후 |

**Properties:**
```typescript
{
  follower_id:   string,
  followee_id:   string,
  source:        'profile' | 'video_lightbox' | 'top_creators',
  action:        'follow' | 'unfollow',
}
```

---

### 8. `search_query` — 검색

| 항목 | 값 |
|------|-----|
| **트리거** | 검색 쿼리 제출 (Enter 또는 검색 버튼) |
| **수집 위치** | `src/components/SearchBar.tsx` — submit 시 |

**Properties:**
```typescript
{
  user_id:      string | null,
  query_length: number,        // 검색어 길이 (내용 제외)
  has_results:  boolean,       // 검색 결과 존재 여부
  result_count: number,        // 결과 개수
  source:       'header' | 'discover',
}
```

**주의:** 검색어 본문은 집계 분석(popular queries)을 위해 해시처리 또는 별도 동의 후 수집. 기본은 길이만 수집.

---

### 9. `affiliate_click` — Affiliate CTA 클릭

| 항목 | 값 |
|------|-----|
| **트리거** | AI 도구 링크 / Affiliate CTA 버튼 클릭 |
| **수집 위치** | `src/components/VideoToolbar.tsx` 또는 향후 `AffiliateButton.tsx` |

**Properties:**
```typescript
{
  user_id:    string | null,
  video_id:   string,
  ai_tool:    string,          // 클릭한 AI 도구명
  link_url:   string,          // affiliate URL (도메인만, 전체 path는 서버에서 처리)
  source:     'lightbox' | 'feed_card' | 'discover',
}
```

**Phase 2 구현:** Monetization 에이전트 handoff 필요 (`04-monetization`).

---

### 10. `login_success` — 로그인 성공

| 항목 | 값 |
|------|-----|
| **트리거** | Google OAuth 콜백 완료 후 세션 수립 |
| **수집 위치** | `src/app/auth/callback/route.ts` (서버) 또는 `src/components/auth/AuthProvider.tsx` (클라이언트 세션 감지) |

**Properties:**
```typescript
{
  user_id:    string,
  method:     'google',        // 현재 Google OAuth만 지원
  is_new_user: boolean,        // 신규 가입 vs 재로그인
  referrer:   string | null,   // 어디서 로그인 진입했는지 (page path)
}
```

**서버 함수:** `src/app/auth/callback/route.ts` → `src/lib/auth-profile.ts`의 `upsertProfile()`

---

## KPI 대시보드 지표 제안

### Core KPIs (Phase 1 — 즉시 추적)

| Metric | Formula | 목표 (Phase 1) | 데이터 소스 |
|--------|---------|----------------|-------------|
| **DAU** | 일별 `login_success` + `video_view` unique user_id 수 | — (베이스라인 측정) | analytics events |
| **MAU** | 월별 unique active user_id | — | analytics events |
| **DAU/MAU ratio** | DAU ÷ MAU × 100 | ≥ 20% (스티키 목표) | 계산값 |
| **업로드 수/일** | 일별 `upload_complete` 이벤트 수 | 5+ / day | analytics events |
| **좋아요율** | `video_like` (like only) ÷ `video_view` | ≥ 5% | analytics events |
| **Affiliate CTR** | `affiliate_click` ÷ `video_view` | ≥ 2% | analytics events |

### Engagement KPIs (Phase 2)

| Metric | Formula | 목표 |
|--------|---------|------|
| **저장율** | `video_save` ÷ `video_view` | ≥ 3% |
| **댓글율** | `comment_post` ÷ `video_view` | ≥ 1% |
| **팔로우 전환율** | `follow_user` ÷ profile 방문 | ≥ 10% |
| **업로드 완료율** | `upload_complete` ÷ `upload_start` | ≥ 80% |
| **D7 retention** | D0 신규 유저 중 D7에도 활성 비율 | ≥ 30% |
| **Signup conversion** | `login_success(is_new_user=true)` ÷ auth 시도 | ≥ 60% |

### AI 도구 분석 (Phase 3)

| Metric | 설명 |
|--------|------|
| **Top AI tools by views** | `ai_tool` 기준 `video_view` 합산 |
| **Top AI tools by likes** | `ai_tool` 기준 `video_like` 합산 |
| **Affiliate CTR by tool** | 도구별 `affiliate_click` ÷ `video_view` |

---

## 구현 로드맵

### Phase 1 — 이벤트 인프라 (→ 07-product-ui, 06-data-backend)

```
1. analytics provider 선택: PostHog (self-host 가능, cookie-light)
   - 대안: Plausible (더 간단, 이벤트 커스텀 제한)
2. src/lib/analytics.ts 생성 — track() wrapper
3. 10개 이벤트 컴포넌트에 삽입
4. Supabase analytics_events 테이블 or PostHog 대시보드 설정
```

### Phase 2 — KPI 대시보드

```
5. PostHog 또는 Supabase에서 KPI 쿼리 작성
6. /admin/analytics 페이지 (내부용)
```

### 금지 사항

- ❌ 댓글 본문 / 검색어 원문을 이벤트 payload에 포함
- ❌ 이메일, 실명 등 PII를 이벤트에 포함
- ❌ Production tracking key를 git에 커밋 (환경변수만 사용)
- ❌ 동의 없이 쿠키 기반 추적 (GDPR 고려)

---

## Handoff 대상

| 에이전트 | 작업 내용 |
|----------|-----------|
| **07-product-ui** | `src/lib/analytics.ts` 생성 + 10개 이벤트 컴포넌트 삽입 |
| **06-data-backend** | `analytics_events` 테이블 스키마 (선택적 — PostHog 외부 사용 시 불필요) |
| **04-monetization** | `affiliate_click` 이벤트 구현 및 CTA 버튼 추가 |
| **01-ops-sre** | PostHog env vars (`NEXT_PUBLIC_POSTHOG_KEY`) Cloudflare Pages 설정 |

---

*이 문서는 `agents/10-analytics-experiment/experiments/2026-05-23-event-schema.md` 에 저장됩니다.*
