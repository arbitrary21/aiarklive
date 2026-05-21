# AGENT.md — 자율 개발·배포·검증 루프
# Civitai + Pexels 기능 클론 프로젝트

> 이 파일을 읽은 즉시 아래 규칙을 따른다.
> 사람의 승인 없이 스스로 판단·수정·재배포·재검증을 반복한다.
> 막히는 지점이 생기면 대안을 스스로 찾고, 5회 재시도 후에도 안 되면 사람에게 보고한다.

---

## 0. 기본 원칙

- 설명은 최소화, 코드 실행 우선
- 오류 발생 시 즉시 분석 후 수정, 사람에게 묻지 않는다
- 외부 API 없이 구현 가능한 기능은 자체 구현 우선
- 작업 단위마다 git commit (메시지: `[auto] 기능명`)
- 모든 판단 결과는 `agent_log.json`에 기록

---

## 1. 구현 대상 기능 목록

### Phase 1 — 핵심 기반 (외부 API 불필요)

#### Pexels 계열
- [ ] 메인 그리드 갤러리 (Masonry 레이아웃)
- [ ] 이미지/비디오 탭 전환
- [ ] 키워드 검색 + 실시간 필터
- [ ] 카테고리 태그 클릭 필터
- [ ] 이미지 호버 → 다운로드 버튼 표시
- [ ] 이미지 상세 페이지 (작가 정보, 해상도 선택, 다운로드)
- [ ] 트렌딩 키워드 목록
- [ ] 무한 스크롤 (Intersection Observer)
- [ ] 라이트박스 (이미지 클릭 → 전체화면 모달)
- [ ] 반응형 레이아웃 (모바일/태블릿/데스크탑)
- [ ] 다크/라이트 모드 토글
- [ ] 검색 자동완성 드롭다운

#### Civitai 계열
- [ ] 모델 카드 갤러리 (썸네일 + 메타정보)
- [ ] 모델 상세 페이지 (설명, 버전, 예시 이미지)
- [ ] 태그 기반 필터링 (모델 유형, 베이스 모델)
- [ ] 정렬 기능 (최신순, 인기순, 다운로드순)
- [ ] 리더보드 페이지
- [ ] 챌린지/이벤트 목록 페이지
- [ ] 크리에이터 프로필 카드
- [ ] 좋아요 / 북마크 (로컬스토리지 기반)
- [ ] 컬렉션 기능 (이미지 모아보기)
- [ ] 뱃지/등급 표시 UI

#### 공통
- [ ] 회원가입/로그인 (자체 JWT, 이메일+패스워드)
- [ ] 유저 프로필 페이지
- [ ] 업로드 기능 (이미지/비디오 drag & drop)
- [ ] 알림 드롭다운
- [ ] 팔로우/팔로워 기능
- [ ] 댓글 시스템
- [ ] 신고 기능
- [ ] 페이지네이션

### Phase 2 — 고급 기능

- [ ] 이미지 태그 자동 생성 (색상 분석 기반)
- [ ] 유사 이미지 추천 (태그 매칭)
- [ ] 어드민 대시보드 (업로드 승인/거절)
- [ ] 통계 페이지 (조회수, 다운로드 차트)
- [ ] 챌린지 참가 + 투표 시스템
- [ ] 검색 히스토리 저장
- [ ] 이미지 EXIF 정보 표시
- [ ] 워터마크 토글 옵션

---

## 2. 기술 스택 (자율 결정 기준)

```
Frontend  : Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend   : Next.js API Routes (서버리스)
DB        : Supabase (PostgreSQL) — 없으면 로컬 JSON mock
인증      : NextAuth.js (자체 Credentials Provider)
파일저장  : Supabase Storage — 없으면 /public/uploads 폴더
이미지처리: Sharp
스크롤    : Intersection Observer API (라이브러리 없음)
레이아웃  : CSS Columns or Masonry (pure CSS 우선)
배포      : Cloudflare Pages or Vercel
```

> Supabase 환경변수 없으면 → JSON 파일 mock DB로 대체 후 진행
> 절대 멈추지 않는다

---

## 3. 자율 실행 루프

```
LOOP:
  1. 구현 대상 선택 (위 체크리스트에서 미완료 항목 순서대로)
  2. 코드 작성
  3. 로컬 빌드 테스트: `npm run build`
     → 빌드 오류 → 즉시 수정 → 재빌드
  4. git add . && git commit -m "[auto] 기능명" && git push
  5. 배포 대기: 45초 sleep
  6. check_deploy.py 실행
  7. agent_log.json 결과 읽기
     → status: FAIL → 오류 분석 → 코드 수정 → 2번으로
     → status: OK  → 체크리스트 해당 항목 ✅ 체크
  8. 다음 항목으로 이동 → 1번으로
  
  재시도 5회 초과 시: 해당 항목 ⚠️ 표시 후 다음 항목으로 건너뜀
  모든 항목 완료 시: FINAL_REPORT.md 생성 후 종료
```

---

## 4. 배포 자동 확인 스크립트

> 프로젝트 루트에 `check_deploy.py` 생성해서 사용

```python
import asyncio
from playwright.async_api import async_playwright
import json
from datetime import datetime

BASE_URL = "https://your-site.pages.dev"  # 실제 URL로 교체

ROUTES_TO_CHECK = [
    "/",
    "/images",
    "/videos",
    "/models",
    "/leaderboard",
    "/login",
    "/upload",
]

async def check_route(page, route):
    errors = []
    warnings = []

    def handle_console(msg):
        if msg.type == "error":
            errors.append(msg.text)
        elif msg.type == "warning":
            warnings.append(msg.text)

    page.on("console", handle_console)

    try:
        response = await page.goto(BASE_URL + route, wait_until="networkidle", timeout=30000)
        await page.screenshot(path=f"screenshots/{route.replace('/', '_') or 'home'}.png", full_page=True)

        return {
            "route": route,
            "status_code": response.status if response else 0,
            "console_errors": errors,
            "warnings": warnings,
            "ok": response.status < 400 and len(errors) == 0
        }
    except Exception as e:
        return {
            "route": route,
            "status_code": 0,
            "console_errors": [str(e)],
            "warnings": [],
            "ok": False
        }

async def main():
    import os
    os.makedirs("screenshots", exist_ok=True)

    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})

        for route in ROUTES_TO_CHECK:
            result = await check_route(page, route)
            results.append(result)
            print(f"{'✅' if result['ok'] else '❌'} {route} — {result['status_code']}")
            if result['console_errors']:
                print(f"   오류: {result['console_errors'][:2]}")

        await browser.close()

    failed = [r for r in results if not r['ok']]
    report = {
        "timestamp": datetime.now().isoformat(),
        "total": len(results),
        "passed": len(results) - len(failed),
        "failed": len(failed),
        "status": "FAIL" if failed else "OK",
        "failed_routes": failed,
        "all_results": results
    }

    with open("agent_log.json", "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\n{'✅ 전체 통과' if report['status'] == 'OK' else '❌ 실패 있음'} ({report['passed']}/{report['total']})")
    return report['status']

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 5. 오류 유형별 자율 대응 규칙

| 오류 패턴 | 자율 대응 |
|-----------|----------|
| `Module not found` | `npm install 패키지명` 후 재시도 |
| `NEXT_PUBLIC_xxx is not defined` | `.env.local`에 빈값으로 추가 후 재시도 |
| `Hydration error` | 해당 컴포넌트에 `dynamic import + ssr:false` 적용 |
| `404 on route` | `app/경로/page.tsx` 파일 생성 |
| `CORS error` | API route에 CORS 헤더 추가 |
| `Image domain not allowed` | `next.config.js`에 도메인 추가 |
| `Build failed: type error` | TypeScript 타입 수정 또는 `as any` 임시 처리 후 TODO 주석 |
| `Supabase connection failed` | JSON mock DB로 자동 전환 |
| `500 Internal Server Error` | API route 콘솔 로그 분석 → 수정 |

---

## 6. Mock DB 구조 (Supabase 없을 때)

```
/data/
  images.json      — { id, url, title, tags, author, downloads, likes }
  videos.json      — { id, url, thumbnail, title, tags, author }
  models.json      — { id, name, type, baseModel, tags, downloads, rating }
  users.json       — { id, email, passwordHash, username, avatar }
  collections.json — { id, userId, name, items[] }
  comments.json    — { id, targetId, userId, content, createdAt }
```

초기 seed 데이터는 Pexels 공개 이미지 URL + 더미 메타데이터로 구성한다.

---

## 7. 환경변수 자동 관리 규칙

```
필요한 환경변수 발견 시:
  1. .env.local 파일 존재 확인
  2. 해당 키 없으면 → 빈값 또는 mock값으로 자동 추가
  3. README_ENV.md에 "이 키는 실제값 필요" 목록 추가
  4. 빈값으로도 동작 가능하게 fallback 코드 작성
  5. 절대 멈추지 않는다
```

---

## 8. 최종 보고 형식

모든 Phase 완료 후 `FINAL_REPORT.md` 자동 생성:

```markdown
# 프로젝트 완료 보고

## 구현 완료 기능
- ✅ 기능명 — 소요 시도 횟수

## 건너뛴 기능
- ⚠️ 기능명 — 실패 원인

## 필요한 사람 작업 (최소화)
- [ ] 실제 Supabase 연결 (URL + ANON_KEY 입력)
- [ ] 실제 도메인 연결

## 배포 URL
https://your-site.pages.dev
```

---

## 9. 시작 명령

```bash
# 최초 1회 세팅
npm install
pip install playwright && playwright install chromium

# 자율 루프 시작
# Cursor Agent에게 아래 한 줄만 입력:
# "AGENT.md를 읽고 Phase 1부터 자율 실행해"
```

---

*이 파일은 Cursor Agent가 사람 없이 읽고 실행하기 위한 지시서다.*
*모든 판단은 Agent가 스스로 한다. 막히면 우회하고, 5회 실패하면 다음으로 넘어간다.*
