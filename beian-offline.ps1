$ErrorActionPreference = 'Continue'
$log = 'C:\moran_beian_log.txt'
function L($m) { ("[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss'), $m) | Out-File -FilePath $log -Append -Encoding utf8 }
L "=== beian offline start ==="

$dir = 'C:\moran_server'
Copy-Item -LiteralPath "$dir\Caddyfile" -Destination "$dir\Caddyfile.bak-20261110" -Force
L "caddyfile backed up"

$conf = @'
{
  admin off
  http_port 80
  https_port 443
}

moran.team {
  encode zstd gzip
  reverse_proxy 127.0.0.1:3000
}

moranenglish.cn {
  encode zstd gzip
  @page not path /api/*
  respond @page 404
  reverse_proxy 127.0.0.1:3000
}

www.moranenglish.cn {
  encode zstd gzip
  @page not path /api/*
  respond @page 404
  reverse_proxy 127.0.0.1:3000
}
'@
Set-Content -LiteralPath "$dir\Caddyfile" -Value $conf -Encoding utf8
L "new caddyfile written"

$caddy = (Get-Process caddy -ErrorAction SilentlyContinue | Select-Object -First 1).Path
if (-not $caddy) {
    $cmd = Get-Command caddy -ErrorAction SilentlyContinue
    if ($cmd) { $caddy = $cmd.Source }
}
L "caddy exe: $caddy"

$validated = $true
if ($caddy) {
    $out = & $caddy validate --config "$dir\Caddyfile" 2>&1
    L "validate output: $out"
    L "validate exit=$LASTEXITCODE"
    if ($LASTEXITCODE -ne 0) {
        $validated = $false
        L "VALIDATE FAILED -> restoring old caddyfile"
        Copy-Item -LiteralPath "$dir\Caddyfile.bak-20261110" -Destination "$dir\Caddyfile" -Force
    }
} else {
    L "WARN: caddy exe not found, cannot validate"
}

if ($validated) {
    schtasks /End /TN MoranCaddy 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
    Start-Sleep -Seconds 3
    schtasks /Run /TN MoranCaddy 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
    L "caddy restarted, waiting 10s"
    Start-Sleep -Seconds 10
}

# verify node itself
try {
    $h = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/health' -UseBasicParsing -TimeoutSec 10
    L "node health: $($h.StatusCode)"
} catch { L "node health FAILED: $($_.Exception.Message)" }

# verify root through caddy (expect 404)
try {
    $r = Invoke-WebRequest -Uri 'https://moranenglish.cn/' -UseBasicParsing -TimeoutSec 15
    L "root via caddy: $($r.StatusCode) len=$($r.Content.Length)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) { L "root via caddy status: $($resp.StatusCode.Value__)" } else { L "root test FAILED: $($_.Exception.Message)" }
}

# verify api through caddy (expect 200)
try {
    $a = Invoke-WebRequest -Uri 'https://moranenglish.cn/api/plans' -UseBasicParsing -TimeoutSec 15
    L "api via caddy: $($a.StatusCode) $($a.Content)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) { L "api status: $($resp.StatusCode.Value__)" } else { L "api test FAILED: $($_.Exception.Message)" }
}

# verify app page (expect 404)
try {
    $p = Invoke-WebRequest -Uri 'https://moranenglish.cn/app/' -UseBasicParsing -TimeoutSec 15
    L "app page via caddy: $($p.StatusCode) len=$($p.Content.Length)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) { L "app page status: $($resp.StatusCode.Value__)" } else { L "app page FAILED: $($_.Exception.Message)" }
}

L "=== beian offline end ==="
Get-Content -LiteralPath $log | Select-Object -Last 20
