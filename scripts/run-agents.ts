/**
 * scripts/run-agents.ts
 *
 * Cursor SDK로 AIARKLIVE 에이전트들을 프로그래밍 방식으로 실행합니다.
 *
 * 사용법:
 *   npx ts-node scripts/run-agents.ts              # 전체 Wave 1 동시 실행
 *   npx ts-node scripts/run-agents.ts data ops     # 특정 에이전트만 실행
 *   npx ts-node scripts/run-agents.ts --list        # 사용 가능한 에이전트 목록
 *
 * 사전 조건:
 *   npm install @cursor/sdk ts-node typescript
 *   export CURSOR_API_KEY="cursor_..."   # https://cursor.com/dashboard/cloud-agents
 */

import { Agent, CursorAgentError } from "@cursor/sdk";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const CWD = process.cwd();
const NTFY_TOPIC = "aiarklive-agents";

// ── 에이전트 프롬프트 정의 ──────────────────────────────────────────────────

const AGENTS: Record<string, { name: string; wave: 1 | 2; prompt: string }> = {
  data: {
    name: "AIARKLIVE · Data",
    wave: 1,
    prompt: `
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/06-data-backend/AGENT.md 를 순서대로 읽고,
Known Gaps P1 항목을 처리해줘:
1. /api/report route.ts 를 in-memory 배열 대신 Supabase DB INSERT로 수정
2. src/lib/interactions.ts Likes/saves 영속성 감사
수정 후 npm run build 확인하고 배포해줘.
`.trim(),
  },
  ops: {
    name: "AIARKLIVE · Ops",
    wave: 1,
    prompt: `
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/01-ops-sre/AGENT.md 를 순서대로 읽고,
PENDING_SQL.md 미적용 항목을 Supabase SQL Editor에서 모두 실행하고
agent_log.json 갱신해줘.
`.trim(),
  },
  legal: {
    name: "AIARKLIVE · Legal",
    wave: 1,
    prompt: `
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/02-legal-trust/AGENT.md 를 순서대로 읽고,
업로드 페이지용 저작권 고지 + AI 생성 콘텐츠 면책 체크박스 copy 초안을
agents/02-legal-trust/POLICY_DRAFTS/upload-notice.md 에 작성해줘. 코드 수정 없이 draft만.
`.trim(),
  },
  security: {
    name: "AIARKLIVE · Security",
    wave: 1,
    prompt: `
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/09-security-abuse/AGENT.md 를 순서대로 읽고,
P2 항목: Upload rate limit per user/IP 스펙 + RLS 감사 체크리스트 실행 결과를
agents/09-security-abuse/notes/ 에 작성해줘.
`.trim(),
  },
  monetization: {
    name: "AIARKLIVE · Monetization",
    wave: 1,
    prompt: `
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/04-monetization/AGENT.md 를 순서대로 읽고,
Affiliate CTA (Runway, Kling, PixVerse) + Pro tier 2-track 수익화 spec을
agents/04-monetization/models/ 에 작성해줘.
`.trim(),
  },
  growth: {
    name: "AIARKLIVE · Growth",
    wave: 1,
    prompt: `
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/05-growth-seo/AGENT.md 를 순서대로 읽고,
/tools/kling 랜딩 페이지용 SEO brief (키워드, title, meta, H1, schema.org) 를
agents/05-growth-seo/briefs/ 에 작성해줘.
`.trim(),
  },
  analytics: {
    name: "AIARKLIVE · Analytics",
    wave: 1,
    prompt: `
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/10-analytics-experiment/AGENT.md 를 순서대로 읽고,
MVP 이벤트 스키마 10개 (video_view, video_like, video_save, comment_post,
upload_start, upload_complete, follow_user, search_query, affiliate_click, login_success)
를 agents/10-analytics-experiment/experiments/ 에 정의해줘.
`.trim(),
  },
  ui: {
    name: "AIARKLIVE · UI",
    wave: 2,
    prompt: `
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/07-product-ui/AGENT.md 를 순서대로 읽고,
HANDOFFS.md Active 항목 중 본인(07-product-ui) 수신 작업을 구현해줘.
구현 후 npm run build 확인하고 배포해줘.
`.trim(),
  },
  qa: {
    name: "AIARKLIVE · QA",
    wave: 2,
    prompt: `
agents/SHARED_CONTEXT.md, agents/HANDOFFS.md, agents/11-qa-release/AGENT.md 를 순서대로 읽고,
전체 smoke checklist 실행하고 결과를 agents/11-qa-release/checklists/ 에 기록해줘.
실패 항목 있으면 HANDOFFS.md 에 담당 에이전트 handoff 발행해줘.
`.trim(),
  },
};

// ── 알림 헬퍼 ──────────────────────────────────────────────────────────────

async function notify(message: string, title: string, priority = "default") {
  try {
    await execAsync(
      `powershell -NoProfile -File scripts/notify.ps1 -Agent "${title}" -Message "${message}" -Priority "${priority}"`
    );
  } catch {
    // 알림 실패는 무시
  }
}

// ── 단일 에이전트 실행 ─────────────────────────────────────────────────────

async function runAgent(key: string): Promise<"ok" | "fail"> {
  const def = AGENTS[key];
  if (!def) throw new Error(`알 수 없는 에이전트: ${key}`);

  console.log(`\n[${def.name}] 시작...`);

  try {
    const result = await Agent.prompt(def.prompt, {
      apiKey: process.env.CURSOR_API_KEY!,
      model: { id: "composer-2" },
      local: { cwd: CWD },
    });

    if (result.status === "finished") {
      console.log(`[${def.name}] ✅ 완료`);
      await notify(`${def.name} 완료`, def.name);
      return "ok";
    } else {
      console.error(`[${def.name}] ❌ 실패 (status: ${result.status})`);
      await notify(`${def.name} 실패`, def.name, "high");
      return "fail";
    }
  } catch (err) {
    if (err instanceof CursorAgentError) {
      console.error(`[${def.name}] 시작 실패: ${err.message}`);
    } else {
      console.error(`[${def.name}] 오류:`, err);
    }
    await notify(`${def.name} 오류`, def.name, "urgent");
    return "fail";
  }
}

// ── 메인 ───────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--list")) {
    console.log("\n사용 가능한 에이전트:");
    for (const [key, def] of Object.entries(AGENTS)) {
      console.log(`  ${key.padEnd(15)} Wave ${def.wave}  ${def.name}`);
    }
    return;
  }

  if (!process.env.CURSOR_API_KEY) {
    console.error(
      "오류: CURSOR_API_KEY 환경변수가 없습니다.\n" +
      "https://cursor.com/dashboard/cloud-agents 에서 발급 후\n" +
      "set CURSOR_API_KEY=cursor_... 으로 설정하세요."
    );
    process.exit(1);
  }

  // 실행할 에이전트 결정
  const wave1Keys = Object.entries(AGENTS)
    .filter(([, d]) => d.wave === 1)
    .map(([k]) => k);

  const targets = args.length > 0
    ? args.filter((a) => !a.startsWith("--"))
    : wave1Keys;

  console.log(`\n실행 대상: ${targets.join(", ")}`);
  console.log("병렬 실행 시작...\n");

  // 병렬 실행
  const results = await Promise.allSettled(targets.map((key) => runAgent(key)));

  const passed = results.filter((r) => r.status === "fulfilled" && r.value === "ok").length;
  const failed = results.length - passed;

  console.log(`\n완료: ${passed}/${results.length} 성공`);

  if (failed > 0) {
    await notify(`${failed}개 에이전트 실패 — 확인 필요`, "Orchestrator", "high");
    process.exit(1);
  } else {
    await notify(`Wave 1 전체 완료 (${passed}개)`, "Orchestrator");
  }
}

main().catch((err) => {
  console.error("치명적 오류:", err);
  process.exit(1);
});
