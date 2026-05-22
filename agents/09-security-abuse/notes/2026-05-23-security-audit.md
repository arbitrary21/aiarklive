# Security Audit — 2026-05-23

> 에이전트: AIARKLIVE · Security (09-security-abuse)  
> 기준: `supabase/migrations/` 전체 + `src/app/api/report/route.ts` + `src/lib/interactions.ts` + `src/lib/supabase/client.ts`

---

## A. Upload Rate Limit Spec

### 권장 임계값

| 대상 | 시간 창 | 최대 요청 수 | 초과 응답 |
|------|---------|-------------|----------|
| 인증 유저 (user_id 기준) | 1시간 | 10회 업로드 | 429 + Retry-After |
| IP (비인증 포함) | 1시간 | 20회 | 429 + Retry-After |
| `/api/report` (신고) | 1시간 | 30회 (IP) | 429 + Retry-After |
| `/api/comments` (댓글) | 10분 | 20회 (user_id) | 429 + Retry-After |

> 근거: 일반 창작자 기준 시간당 10회면 충분, IP 2배는 NAT/공유망 허용. 신고/댓글은 스팸 위험이 높아 별도 임계값 적용.

---

### 구현 방법 1 — Cloudflare Workers Edge Rate Limiting (권장 P1)

Cloudflare Pages는 엣지에서 Rate Limiting Rules 또는 Workers KV + Durable Objects를 사용할 수 있다.

#### 옵션 A: Cloudflare Dashboard Rate Limiting Rules (코드 불필요)

```
Security > WAF > Rate Limiting Rules
- URL path: /api/upload*
  - Dimension: IP + User-Agent (또는 CF-Connecting-IP)
  - Threshold: 20 req / 3600s (IP 기준)
  - Action: Block → 429, custom response header: Retry-After: 3600
```

장점: 인프라 변경 없음, 즉시 적용.  
단점: user_id(인증 토큰) 기반 분리는 Workers 커스텀 없이는 불가.

#### 옵션 B: Cloudflare Workers + KV (user_id 기반, 권장)

```typescript
// middleware-style edge handler (Next.js middleware.ts or CF Worker)
import { NextRequest, NextResponse } from "next/server";

const UPLOAD_LIMIT = 10;
const WINDOW_SECONDS = 3600;

export async function rateLimitUpload(req: NextRequest, userId: string): Promise<NextResponse | null> {
  const key = `rl:upload:${userId}`;
  const kv = (process.env as unknown as { RATE_LIMIT_KV: KVNamespace }).RATE_LIMIT_KV;

  const current = parseInt((await kv.get(key)) ?? "0", 10);
  if (current >= UPLOAD_LIMIT) {
    return NextResponse.json(
      { error: "Upload rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(WINDOW_SECONDS) },
      }
    );
  }

  await kv.put(key, String(current + 1), { expirationTtl: WINDOW_SECONDS });
  return null; // 통과
}
```

`wrangler.toml`에 KV 바인딩 추가:
```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "<KV_NAMESPACE_ID>"
```

Cloudflare Pages Functions 또는 Next.js edge middleware에서 호출.

---

### 구현 방법 2 — Next.js API Route Fallback (서버 측, 엣지 불가 환경용)

```typescript
// src/lib/rate-limit.ts
const rateMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}
```

```typescript
// src/app/api/upload/route.ts 사용 예시
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const userId = /* auth.uid() */ "...";
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "anon";

  const userLimit = checkRateLimit(`upload:user:${userId}`, 10, 3600_000);
  const ipLimit = checkRateLimit(`upload:ip:${ip}`, 20, 3600_000);

  if (!userLimit.allowed || !ipLimit.allowed) {
    const retryAfter = Math.max(userLimit.retryAfterSeconds, ipLimit.retryAfterSeconds);
    return Response.json(
      { error: "Rate limit exceeded." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }
  // ... upload logic
}
```

> ⚠️ **주의**: `Map` 기반 in-memory 구현은 서버 재시작 시 초기화되고 다중 워커 인스턴스 환경에서 공유되지 않는다. Cloudflare Pages edge 환경에서는 반드시 KV 또는 Durable Objects 사용.

---

### 초과 시 응답 스펙

```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3600

{"error":"Rate limit exceeded. Try again in 3600 seconds."}
```

---

## B. RLS 감사 체크리스트 실행 결과

감사 기준 파일:
- `supabase/schema.sql`
- `supabase/migrations/add_auth_policies.sql`
- `supabase/migrations/add_user_profile_insert_policy.sql`
- `supabase/migrations/add_comments.sql`
- `supabase/migrations/add_reports.sql`

---

### 1. `users` 테이블

| 항목 | 상태 | 근거 |
|------|------|------|
| RLS 활성화 | ✅ | `schema.sql:83` — `alter table public.users enable row level security` |
| SELECT: 공개 읽기 | ✅ | `"Public users read"` — `for select using (true)` |
| INSERT: 본인 행만 | ✅ | `"User can insert own profile"` — `with check (auth.uid() = id)` |
| UPDATE: 본인 행만 | ✅ | `"User can update own profile"` — `using (auth.uid() = id)` |
| DELETE 정책 | ⚠️ **없음** | DELETE 정책이 없어서 `authenticated` role이 삭제 가능한지 확인 필요. `schema.sql` 기본 RLS deny-all이면 문제 없으나 명시적 정책 권장. |

**결론**: INSERT/UPDATE 정책은 안전. DELETE 명시 정책 없음 → 현재는 default-deny로 삭제 불가이나, 명시적 `"User can delete own profile"` 정책 추가 권장 (또는 의도적 금지라면 주석 명시).

---

### 2. `comments` 테이블

| 항목 | 상태 | 근거 |
|------|------|------|
| RLS 활성화 | ✅ | `add_comments.sql:13` — `alter table public.comments enable row level security` |
| SELECT: 공개 읽기 | ✅ | `"Public comments read"` — `for select using (true)` |
| INSERT: auth.uid() = user_id | ✅ | `"User can comment"` — `with check (auth.uid() = user_id)` |
| DELETE: 본인 댓글만 | ✅ | `"User can delete own comment"` — `using (auth.uid() = user_id)` |
| UPDATE 정책 | ⚠️ **없음** | 댓글 수정 정책 없음 — 현재 수정 기능이 없다면 default-deny로 안전. 향후 수정 기능 추가 시 정책 필요. |
| 길이 제한 DB 레벨 | ✅ | `check (char_length(content) between 1 and 2000)` |

**결론**: auth.uid() = user_id INSERT 정책 확인됨. 안전.

---

### 3. `videos` 테이블

| 항목 | 상태 | 근거 |
|------|------|------|
| RLS 활성화 | ✅ | `schema.sql:84` — `alter table public.videos enable row level security` |
| SELECT: NSFW 필터 | ✅ | `"Public videos read"` — `for select using (not is_nsfw)` |
| INSERT: 인증 유저 + 본인 user_id | ✅ | `"Authenticated video insert"` — `with check (auth.uid() = user_id)` |
| UPDATE: 소유자만 | ✅ | `"Owner video update"` — `using (auth.uid() = user_id)` |
| DELETE 정책 | ⚠️ **없음** | 비디오 삭제 정책 없음. default-deny로 일반 유저는 삭제 불가이나, 소유자 삭제 기능 추가 시 정책 필요. |
| Rate limit (업로드) | ❌ **미구현** | 현재 API 레벨 rate limit 없음 → **A 섹션 구현 필요** |

**결론**: 업로드 INSERT 정책은 안전. Rate limit 미구현이 주요 리스크.

---

### 4. `reports` 테이블

| 항목 | 상태 | 근거 |
|------|------|------|
| RLS 활성화 | ✅ | `add_reports.sql:31` — `alter table public.reports enable row level security` |
| INSERT: 인증 유저 — 본인 user_id | ✅ | `"Authenticated user can report"` — `to authenticated with check (auth.uid() = user_id)` |
| INSERT: 익명 — user_id IS NULL 강제 | ✅ | `"Anon can report"` — `to anon with check (user_id is null)` (user_id 스푸핑 방지) |
| SELECT: 본인 신고만 | ✅ | `"User can view own reports"` — `using (auth.uid() = user_id)` |
| 관리자 접근 | ✅ | `service_role`이 RLS 우회 → 모더레이션 가능 |
| 중복 신고 방지 | ✅ | unique index on `(video_id, user_id) WHERE user_id IS NOT NULL` |
| 관리자 큐 UI | ❌ **미구현** | `status` 컬럼 있으나 admin 대시보드/처리 플로우 없음 |

**결론**: RLS 정책 견고함. 관리 도구가 없어 신고 데이터가 쌓여도 처리 불가 → 08-content-editorial / 00-orchestrator와 협의 필요.

---

### 5. `service_role` key 클라이언트 번들 노출 검사

**검사 파일**: `src/lib/supabase/client.ts`

```typescript
// 현재 코드 (안전)
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!   // ✅ ANON KEY만 사용
  );
}
```

| 항목 | 상태 | 근거 |
|------|------|------|
| 클라이언트에 `service_role` key 노출 | ✅ **없음** | `NEXT_PUBLIC_SUPABASE_ANON_KEY`만 사용, `service_role` 참조 없음 |
| `NEXT_PUBLIC_` prefix 환경변수만 노출 | ✅ | 브라우저 번들에 포함되는 변수는 ANON KEY뿐 |
| `src/` 전체에 `SERVICE_ROLE` 참조 | ✅ **없음** | grep 결과 0건 |

**결론**: service_role key 클라이언트 번들 노출 없음. 안전.

---

### RLS 감사 종합 요약

| 테이블 | RLS | INSERT | UPDATE | DELETE | 특이사항 |
|--------|-----|--------|--------|--------|----------|
| `users` | ✅ | ✅ | ✅ | ⚠️ 정책 없음 | trigger로 자동 생성 |
| `videos` | ✅ | ✅ | ✅ | ⚠️ 정책 없음 | rate limit 미구현 |
| `likes` | ✅ | ✅ | N/A | ✅ | — |
| `saves` | ✅ | ✅ | N/A | ✅ | — |
| `follows` | ✅ | ✅ | N/A | ✅ | 자기 팔로우 방지 |
| `comments` | ✅ | ✅ | ⚠️ 정책 없음 | ✅ | content 길이 DB 제한 |
| `reports` | ✅ | ✅ | N/A | N/A | admin 큐 미구현 |
| `notifications` | ✅ | 조건부 | ✅ | N/A | — |

---

## C. Comment Spam 휴리스틱

### 동일 내용 반복 감지

- **기준**: 동일 `user_id`가 60초 내에 `content` 해시가 일치하는 댓글을 2회 이상 작성
- **구현 위치**: `/api/comments` route 또는 Supabase trigger
- **구현 방법 (추천: DB trigger)**:

```sql
-- 최근 60초 이내 동일 내용 댓글 방지
create or replace function public.check_comment_spam()
returns trigger as $$
begin
  if exists (
    select 1 from public.comments
    where user_id = new.user_id
      and content = new.content
      and created_at > now() - interval '60 seconds'
  ) then
    raise exception 'duplicate_comment' using errcode = 'P0001';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger comment_spam_check
  before insert on public.comments
  for each row execute function public.check_comment_spam();
```

- API route에서 `P0001` 에러 코드 수신 시 → `400 Bad Request` + `"중복 댓글입니다"` 응답

### 단시간 다량 댓글 임계값

| 시간 창 | 임계값 | 대응 |
|---------|--------|------|
| 1분 | 5회 | 일시 차단 (rate limit 429) |
| 10분 | 20회 | 소프트 차단 (댓글 기능 일시 비활성화) |
| 1시간 | 50회 | 유저 플래그 (admin 검토 큐) |

- 구현: 위 A 섹션의 `checkRateLimit()` 동일 패턴으로 `/api/comments` 에 적용
- Key: `comment:user:{userId}` (10분/20회), `comment:ip:{ip}` (10분/30회)

### 06-data-backend Handoff 필요 여부

**필요함** — 아래 두 가지 DB 변경이 필요하다:
1. 댓글 스팸 방지 trigger (`check_comment_spam`) 마이그레이션
2. 스팸 플래그 컬럼 (`is_flagged boolean default false`) — admin 검토 큐용

---

## 액션 아이템 요약

| # | 항목 | 우선순위 | 담당 |
|---|------|---------|------|
| 1 | 업로드 rate limit — Cloudflare KV 기반 구현 | **P1** | 09-security → 01-ops-sre |
| 2 | `/api/comments` rate limit 구현 | **P1** | 09-security → 07-product-ui |
| 3 | 댓글 spam trigger 마이그레이션 | **P2** | 09-security → 06-data-backend |
| 4 | `users` / `videos` DELETE 정책 명시 | **P2** | 06-data-backend |
| 5 | 신고 admin 큐 UI | **P3** | 00-orchestrator 우선순위 결정 |
| 6 | CSP / security headers 검토 | **P3** | 09-security → 01-ops-sre |
