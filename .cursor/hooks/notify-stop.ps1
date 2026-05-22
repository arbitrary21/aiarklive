# .cursor/hooks/notify-stop.ps1
# Cursor 에이전트 세션 종료(stop) 시 자동 실행

$input_json = $null
try { $input_json = $input | ConvertFrom-Json } catch {}

$agent   = if ($input_json.subagent_type) { $input_json.subagent_type } else { "Agent" }
$message = "세션 종료 — 결과를 확인하세요."

$TOPIC = "aiarklive-agents"

try {
    $headers = @{
        "Title" = "AIARKLIVE · $agent 종료"
        "Tags"  = "checkered_flag"
    }
    Invoke-RestMethod -Uri "https://ntfy.sh/$TOPIC" -Method POST -Body $message -Headers $headers -TimeoutSec 5 | Out-Null
} catch {}

# stdout에 빈 JSON 반환 (훅 프로토콜 준수)
Write-Output '{}'
