# scripts/notify.ps1
# 에이전트 작업 완료 알림 전송
# 사용법: powershell -File scripts/notify.ps1 -Agent "Data" -Message "reports API DB 저장 완료"
#
# 구독 방법:
#   모바일: ntfy 앱 설치 후 토픽 'aiarklive-agents' 구독
#   웹:     https://ntfy.sh/aiarklive-agents
#   데스크탑: https://ntfy.sh/docs/subscribe/desktop/

param(
    [string]$Agent = "Agent",
    [string]$Message = "작업이 완료되었습니다.",
    [string]$Priority = "default"  # min, low, default, high, urgent
)

$TOPIC = "aiarklive-agents"
$NTFY_URL = "https://ntfy.sh/$TOPIC"

# --- ntfy.sh 푸시 알림 (모바일/웹) ---
try {
    $headers = @{
        "Title"    = "AIARKLIVE · $Agent 완료"
        "Priority" = $Priority
        "Tags"     = "white_check_mark,robot"
    }
    Invoke-RestMethod -Uri $NTFY_URL -Method POST -Body $Message -Headers $headers -TimeoutSec 5 | Out-Null
    Write-Host "[notify] ntfy.sh 전송 완료 → $NTFY_URL"
} catch {
    Write-Host "[notify] ntfy.sh 전송 실패 (오프라인?): $_"
}

# --- Windows 토스트 알림 (데스크탑) ---
try {
    Add-Type -AssemblyName System.Windows.Forms | Out-Null
    $balloon = New-Object System.Windows.Forms.NotifyIcon
    $balloon.Icon = [System.Drawing.SystemIcons]::Information
    $balloon.BalloonTipTitle = "AIARKLIVE · $Agent 완료"
    $balloon.BalloonTipText = $Message
    $balloon.BalloonTipIcon = "Info"
    $balloon.Visible = $true
    $balloon.ShowBalloonTip(5000)
    Start-Sleep -Milliseconds 500
    $balloon.Dispose()
    Write-Host "[notify] Windows 토스트 전송 완료"
} catch {
    Write-Host "[notify] Windows 토스트 실패: $_"
}
