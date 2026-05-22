# AIARKLIVE Agent Team

역할별 서브에이전트 팀 지도. **Cursor 채팅 1개 = 에이전트 1명**으로 사용한다.

## 빠른 시작

1. 새 Cursor 채팅 생성 (이름 예: `AIARKLIVE · Ops`)
2. `agents/CHAT_PROMPTS.md` 에서 해당 에이전트 프롬프트 복사·붙여넣기
3. 산출물은 각 에이전트 폴더(`agents/XX-name/`) 또는 명시된 경로에 저장
4. 에이전트 간 인계: `agents/HANDOFFS.md` 에 항목 추가

## 핵심 공유 파일

| 파일 | 역할 | 읽는 에이전트 |
|------|------|--------------|
| `agents/SHARED_CONTEXT.md` | 현재 프로젝트 상태 (배포, DB, 이슈) | **전원 필수** |
| `agents/HANDOFFS.md` | 에이전트 간 작업 인계 큐 | **전원 필수** |
| `agents/CHAT_PROMPTS.md` | 채팅 시작 프롬프트 | 사용자 |
| `.cursor/rules/aiarklive-agents.mdc` | Cursor 자동 주입 규칙 | Cursor 자동 |

## 프로젝트 고정 정보

| 항목 | 값 |
|------|-----|
| Site | https://aiarklive.com |
| Repo | arbitrary21/aiarklive |
| Supabase | vsaqwmiwcbsuxcysbwru.supabase.co |
| OAuth start | `/api/auth/google` |
| OAuth callback | `/auth/callback` |
| Deploy check | `python check_deploy.py` |
| SQL queue | `PENDING_SQL.md` |
| Work log | `agent_log.json` |

## 에이전트 목록

| # | 폴더 | 채팅 이름 | 역할 |
|---|------|-----------|------|
| 00 | [agents/00-orchestrator](agents/00-orchestrator/AGENT.md) | AIARKLIVE · Orchestrator | 총괄 기획, 우선순위, handoff |
| 01 | [agents/01-ops-sre](agents/01-ops-sre/AGENT.md) | AIARKLIVE · Ops | 배포, env, OAuth, 장애 |
| 02 | [agents/02-legal-trust](agents/02-legal-trust/AGENT.md) | AIARKLIVE · Legal | 저작권, 업로드 정책, ToS |
| 03 | [agents/03-competitive-ux](agents/03-competitive-ux/AGENT.md) | AIARKLIVE · Research | 경쟁사 UI/UX 벤치마킹 |
| 04 | [agents/04-monetization](agents/04-monetization/AGENT.md) | AIARKLIVE · Monetization | 수익화 모델, affiliate, Pro tier |
| 05 | [agents/05-growth-seo](agents/05-growth-seo/AGENT.md) | AIARKLIVE · Growth | SEO, 랜딩, OG, 사이트맵 |
| 06 | [agents/06-data-backend](agents/06-data-backend/AGENT.md) | AIARKLIVE · Data | Supabase, RLS, API, 마이그레이션 |
| 07 | [agents/07-product-ui](agents/07-product-ui/AGENT.md) | AIARKLIVE · UI | 컴포넌트, 디자인 시스템, a11y |
| 08 | [agents/08-content-editorial](agents/08-content-editorial/AGENT.md) | AIARKLIVE · Editorial | Discover, 챌린지, 시드 데이터 |
| 09 | [agents/09-security-abuse](agents/09-security-abuse/AGENT.md) | AIARKLIVE · Security | rate limit, 신고, 남용 방지 |
| 10 | [agents/10-analytics-experiment](agents/10-analytics-experiment/AGENT.md) | AIARKLIVE · Analytics | 이벤트, 실험, KPI |
| 11 | [agents/11-qa-release](agents/11-qa-release/AGENT.md) | AIARKLIVE · QA | smoke test, 릴리즈 체크 |
| 12 | [agents/12-community-ops](agents/12-community-ops/AGENT.md) | AIARKLIVE · Community | 온보딩, FAQ, 공지 |

## Handoff 흐름 (자주 쓰는 패턴)

```
Competitive UX → Product UI → QA → Ops
Monetization → Orchestrator → Data/UI → QA
Legal → Data (업로드 가드) + Product UI (고지 UI)
Data → Ops (SQL 적용) → QA
```

## Phase 우선순위

**Phase 1 (지금):** 01 Ops, 06 Data, 11 QA  
**Phase 2:** 02 Legal, 03 Competitive, 04 Monetization  
**Phase 3:** 05 Growth, 09 Security, 10 Analytics  
**Phase 4:** 08 Editorial, 12 Community, 00 Orchestrator 루프 고도화

## 기존 루트 AGENT.md와의 관계

- `AGENT.md` (루트): 레거시 자율 개발 루프 — 기능 구현·배포 자동화
- `agents/*`: 역할 분리된 전문 에이전트 — **새 작업은 agents/ 우선 사용**

## SHARED_CONTEXT 업데이트 규칙

Ops 또는 QA 에이전트가 배포/마이그레이션 완료 후 `agents/SHARED_CONTEXT.md` 의 "현재 상태" 섹션을 갱신한다.
