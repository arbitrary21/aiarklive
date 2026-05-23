import asyncio
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

def _last_commit() -> str:
    """최근 git 커밋 메시지 한 줄 반환 (실패 시 빈 문자열)."""
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--pretty=%s (%h)"],
            capture_output=True, text=True, timeout=5
        )
        return result.stdout.strip()
    except Exception:
        return ""

try:
    import requests as _requests

    def notify(msg="✅ 작업 완료!", title="AIARKLIVE", details=""):
        body = msg
        if details:
            body += f"\n\n{details}"
        _requests.post(
            "https://ntfy.sh/aiarklive-agents",
            data=body.encode("utf-8"),
            headers={"Title": title},
        )
except ImportError:
    def notify(msg="✅ 작업 완료!", title="Cursor 작업", details=""):
        pass

BASE_URL = os.environ.get("DEPLOY_BASE_URL", "https://aiarklive.com")

ROUTES_TO_CHECK = [
    "/",
    "/login",
    "/explore",
    "/leaderboard",
    "/upload",
    "/auth/callback",
    "/discover",
    "/challenges",
    "/terms",
    "/tools/kling",
    "/tools/runway",
    "/tools/pixverse",
]


def check_route_http(route: str) -> dict:
    url = BASE_URL + route
    errors: list[str] = []
    status_code = 0

    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "aiarklive-deploy-check/1.0"},
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            status_code = response.status
            body = response.read(4096).decode("utf-8", errors="ignore")
            if "Application error" in body or "Internal Server Error" in body:
                errors.append("error page content detected")
    except urllib.error.HTTPError as exc:
        status_code = exc.code
        if exc.code >= 500:
            errors.append(f"HTTP {exc.code}")
    except Exception as exc:
        errors.append(str(exc))

    return {
        "route": route,
        "status_code": status_code,
        "console_errors": errors,
        "warnings": [],
        "ok": status_code < 500 and len(errors) == 0,
    }


async def check_route_playwright(page, route: str) -> dict:
    errors: list[str] = []
    warnings: list[str] = []

    def handle_console(msg):
        if msg.type == "error":
            errors.append(msg.text)
        elif msg.type == "warning":
            warnings.append(msg.text)

    page.on("console", handle_console)

    try:
        response = await page.goto(
            BASE_URL + route,
            wait_until="domcontentloaded",
            timeout=30000,
        )
        os.makedirs("screenshots", exist_ok=True)
        safe_name = route.replace("/", "_") or "home"
        await page.screenshot(path=f"screenshots/{safe_name}.png", full_page=True)
        status_code = response.status if response else 0
        return {
            "route": route,
            "status_code": status_code,
            "console_errors": errors,
            "warnings": warnings,
            "ok": status_code < 400 and len(errors) == 0,
        }
    except Exception as exc:
        return {
            "route": route,
            "status_code": 0,
            "console_errors": [str(exc)],
            "warnings": warnings,
            "ok": False,
        }


async def main() -> str:
    results: list[dict] = []

    try:
        from playwright.async_api import async_playwright

        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch()
            page = await browser.new_page(viewport={"width": 1440, "height": 900})
            for route in ROUTES_TO_CHECK:
                result = await check_route_playwright(page, route)
                results.append(result)
                mark = "OK" if result["ok"] else "FAIL"
                print(f"[{mark}] {route} - {result['status_code']}")
            await browser.close()
    except Exception as exc:
        print(f"Playwright unavailable ({exc}); falling back to HTTP checks.")
        for route in ROUTES_TO_CHECK:
            result = check_route_http(route)
            results.append(result)
            mark = "OK" if result["ok"] else "FAIL"
            print(f"[{mark}] {route} - {result['status_code']}")

    failed = [item for item in results if not item["ok"]]
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "base_url": BASE_URL,
        "total": len(results),
        "passed": len(results) - len(failed),
        "failed": len(failed),
        "status": "FAIL" if failed else "OK",
        "failed_routes": failed,
        "all_results": results,
    }

    with open("agent_log.json", "w", encoding="utf-8") as handle:
        json.dump(report, handle, ensure_ascii=False, indent=2)

    print(
        f"\n{'ALL PASS' if report['status'] == 'OK' else 'FAILURES'} "
        f"({report['passed']}/{report['total']})"
    )

    commit = _last_commit()
    if report["status"] == "OK":
        notify(
            f"✅ 배포 정상 {report['passed']}/{report['total']} 통과",
            "AIARKLIVE Deploy OK",
            details=f"최근 변경: {commit}" if commit else "",
        )
    else:
        routes = ", ".join(r["route"] for r in failed)
        notify(
            f"❌ 배포 실패 {report['failed']}개 오류: {routes}",
            "AIARKLIVE Deploy FAIL",
            details=f"최근 변경: {commit}" if commit else "",
        )

    return report["status"]


if __name__ == "__main__":
    status = asyncio.run(main())
    sys.exit(0 if status == "OK" else 1)
