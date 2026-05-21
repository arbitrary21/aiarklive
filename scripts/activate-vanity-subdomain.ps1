# Requires Supabase Pro (vanity subdomains are included on paid plans).
# After activation, update Google OAuth redirect URI to:
#   https://aiarklive.supabase.co/auth/v1/callback
# And set NEXT_PUBLIC_SUPABASE_URL=https://aiarklive.supabase.co

$ProjectRef = "vsaqwmiwcbsuxcysbwru"
$Subdomain = "aiarklive"

Write-Host "Checking availability for $Subdomain.supabase.co..."
npx supabase vanity-subdomains check-availability `
  --project-ref $ProjectRef `
  --desired-subdomain $Subdomain `
  --experimental

Write-Host ""
Write-Host "Activating vanity subdomain..."
npx supabase vanity-subdomains activate `
  --project-ref $ProjectRef `
  --desired-subdomain $Subdomain `
  --experimental

Write-Host ""
Write-Host "Done. Update .env.production and Google OAuth, then redeploy."
