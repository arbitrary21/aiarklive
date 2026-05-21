# Apply all pending SQL migrations via Supabase CLI
# Requires: npx supabase login (or SUPABASE_ACCESS_TOKEN env var)

$ErrorActionPreference = "Stop"
$ProjectRef = "vsaqwmiwcbsuxcysbwru"
$Root = Split-Path -Parent $PSScriptRoot
$Migrations = @(
  "add_source_url.sql",
  "add_auth_policies.sql",
  "add_downloads_and_notifications.sql",
  "add_user_profile_insert_policy.sql",
  "add_username_confirmation.sql",
  "add_comments.sql"
)

Write-Host "Project: $ProjectRef"
Write-Host "Checking Supabase auth..."
npx supabase projects list 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "ERROR: Not logged in. Run: npx supabase login"
  Write-Host "Or set SUPABASE_ACCESS_TOKEN and retry."
  exit 1
}

foreach ($file in $Migrations) {
  $path = Join-Path $Root "supabase/migrations/$file"
  if (-not (Test-Path $path)) {
    Write-Host "SKIP missing: $file"
    continue
  }
  Write-Host "Applying $file ..."
  Get-Content $path -Raw | npx supabase db execute --project-ref $ProjectRef --file -
  if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED on $file (may already be applied - check dashboard)"
  } else {
    Write-Host "OK: $file"
  }
}

Write-Host "Done. Update PENDING_SQL.md checkmarks manually."
