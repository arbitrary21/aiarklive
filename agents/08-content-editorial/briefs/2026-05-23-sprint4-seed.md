# Sprint 4 — 앵커 콘텐츠 시드

**상태:** Ready to apply  
**영상 ID:** `5ba1af16-7ab1-4605-b66b-fbc3f9607e5a`  
**계정:** `cozyambience` (또는 병합 후 실제 소유 계정)

---

## 1. 영상 메타 (복사해서 Edit 모달에 붙여넣기)

| 필드 | 값 |
|------|-----|
| **Title** | Candlelight Cozy Ambience — Warm AI Loop |
| **Genre** | Loop |
| **AI tools** | Kling |
| **AI generated** | ✅ 체크 |
| **Description** | Soft candlelight and warm ambient mood — perfect for study, sleep, or background. Made with Kling AI. Tags: #ambient #cozy #loop #candlelight #kling |
| **Prompt** | Warm cozy room, soft candlelight flicker, gentle ambient atmosphere, cinematic loop, 4K mood |

---

## 2. Discover 컬렉션 매핑 (이 영상 1개로 채워지는 곳)

| 컬렉션 ID | 노출 조건 | 이 영상 |
|-----------|-----------|---------|
| `cinematic-kling` | `ai_tool = kling` | ✅ |
| `runway-loops` | runway + loop | ❌ (Runway 미사용 시 스킵) |
| `trending-this-week` | 7일 이내 + 인기순 | ✅ (최근 업로드면) |
| `tool-starter-kit` | kling/runway/pixverse | ✅ |
| `experimental` / `animation` / `short-form` / `suno-mv` | genre/tool 불일치 | ❌ |

**목표:** Discover 9칸 중 **최소 3칸**에 썸네일 표시 (위 3개).

---

## 3. DB 일괄 적용 (선택)

Supabase SQL Editor에서 실행:

`supabase/scripts/sprint4-anchor-video.sql`

---

## 4. 다음 업로드 템플릿 (크리에이터용)

```
Title: [도구명] — [한 줄 무드]
Genre: Loop | Short-form | …
AI tools: Kling (또는 실제 사용 도구)
Description: [2문장 설명] Tags: #kling #loop #ambient
Prompt: [핵심 프롬프트 1줄]
```

추가 영상 3~5개가 쌓이면 `runway-loops`, `challenge-gallery` 등 빈 컬렉션도 자연히 채워짐.
