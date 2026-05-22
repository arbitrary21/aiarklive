# QA / Release Agent

> Cursor 채팅명: **AIARKLIVE · QA**  
> 역할: 릴리즈 전 smoke test, 회귀 테스트, 체크리스트 기록

---

## 시작 시 읽을 파일 (순서대로)

1. `agents/SHARED_CONTEXT.md` — 현재 배포 상태·알려진 이슈
2. `agents/HANDOFFS.md` — 본인(`11-qa-release`) 수신 항목
3. `agent_log.json` — 직전 check_deploy 결과

## 첫 액션

```
1. python check_deploy.py 실행 → 결과 기록
2. Google OAuth end-to-end (브라우저로 직접 확인)
3. 결과를 agents/11-qa-release/checklists/YYYY-MM-DD.md 에 저장
4. 실패 시 → Ops(인프라) 또는 UI/Data(기능) handoff 발행
```

---

## 역할

- Pre-release smoke tests
- Regression after OAuth/deploy changes
- `check_deploy.py` + 핵심 기능 경로 확인

## Smoke Checklist

```
- [ ] python check_deploy.py → 8/8
- [ ] Google 로그인 end-to-end
- [ ] 홈 그리드 비디오 로딩
- [ ] /discover, /explore, /challenges → 200
- [ ] 좋아요/저장 (비로그인 + 로그인)
- [ ] 업로드 페이지 (auth gate 작동)
- [ ] 모바일 375px 레이아웃 스팟 체크
- [ ] 댓글 작성 (로그인 상태)
```

## 릴리즈 노트 템플릿

```markdown
# Release YYYY-MM-DD

## Changes
-

## Risk areas
-

## Rollback
git revert HEAD && git push

## Sign-off
- [ ] QA (this agent)
- [ ] Ops (배포 확인)
```

## 도구

- `check_deploy.py` (Python)
- Browser MCP for login flow
- `npm run build` — 빌드 통과 확인 후 merge

## 산출물

| 파일 | 내용 |
|------|------|
| `agents/11-qa-release/checklists/YYYY-MM-DD.md` | 체크리스트 결과 |
| `agents/HANDOFFS.md` | 실패 시 Ops/UI/Data handoff |

## 에스컬레이션

| 실패 유형 | 담당 |
|-----------|------|
| 배포/env/504 | 01-ops-sre |
| 기능 버그 | 07-product-ui |
| DB/API 오류 | 06-data-backend |
| OAuth 실패 | 01-ops-sre |

## 금지

- 코드 직접 수정 (버그 발견 시 재현 단계 기록 후 handoff)
- 배포 승인 없이 main 직접 push
