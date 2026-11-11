$ErrorActionPreference = 'Continue'
$log = 'C:\moran_deploy2_log.txt'
function L($m) { ("[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss'), $m) | Out-File -FilePath $log -Append -Encoding utf8 }
L "=== deploy2 start (server.js + content-seed + iap) ==="

$dir = 'C:\moran_server'
$stamp = '20261110_1915'

# 1. stop service so the db file is not locked mid-copy
schtasks /End /TN MoranServer 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
Start-Sleep -Seconds 3
L "service stopped"

# 2. backup db + seed + server.js
Copy-Item -LiteralPath "$dir\moran.db" -Destination "$dir\moran.db.bak-$stamp" -Force
L "db backup: $((Get-Item "$dir\moran.db.bak-$stamp").Length) bytes"
Copy-Item -LiteralPath "$dir\content-seed.json" -Destination "$dir\content-seed.json.bak-$stamp" -Force
L "seed backup: $((Get-Item "$dir\content-seed.json.bak-$stamp").Length) bytes"
Copy-Item -LiteralPath "$dir\server.js" -Destination "$dir\server-rollback.js" -Force
L "server.js rollback copy made"

# 3. download new content seed
try {
    Invoke-WebRequest -Uri 'https://aka.doubaocdn.com/s/8PeP6cnoTe' -OutFile "$dir\content-seed.json" -UseBasicParsing -TimeoutSec 120
    L "new seed downloaded: $((Get-Item "$dir\content-seed.json").Length) bytes"
} catch {
    L "seed download FAILED: $($_.Exception.Message)"
    Copy-Item -LiteralPath "$dir\content-seed.json.bak-$stamp" -Destination "$dir\content-seed.json" -Force
    schtasks /Run /TN MoranServer 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
    L "aborted, service restarted with old files"
    exit 1
}

# 4. unpack new server.js + iap files
try {
    Expand-Archive -LiteralPath 'C:\su.zip' -DestinationPath $dir -Force
    L "server.js unpacked: $((Get-Item "$dir\server.js").Length) bytes"
} catch {
    L "server unpack FAILED: $($_.Exception.Message)"
}

# 5. start service
schtasks /Run /TN MoranServer 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
L "service restarted, waiting 15s for content import"
Start-Sleep -Seconds 15

# 6. health check
$ok = $false
for ($i = 1; $i -le 4; $i++) {
    try {
        $h = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/health' -UseBasicParsing -TimeoutSec 10
        L "health attempt $i : $($h.StatusCode) $($h.Content)"
        $ok = $true
        break
    } catch {
        L "health attempt $i FAILED: $($_.Exception.Message)"
        Start-Sleep -Seconds 6
    }
}

if (-not $ok) {
    L "ROLLBACK ALL FILES"
    Copy-Item -LiteralPath "$dir\server-rollback.js" -Destination "$dir\server.js" -Force
    Copy-Item -LiteralPath "$dir\content-seed.json.bak-$stamp" -Destination "$dir\content-seed.json" -Force
    Copy-Item -LiteralPath "$dir\moran.db.bak-$stamp" -Destination "$dir\moran.db" -Force
    schtasks /End /TN MoranServer 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
    Start-Sleep -Seconds 3
    schtasks /Run /TN MoranServer 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
    Start-Sleep -Seconds 10
    try {
        $h2 = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/health' -UseBasicParsing -TimeoutSec 10
        L "after rollback health: $($h2.StatusCode)"
    } catch { L "after rollback health FAILED: $($_.Exception.Message)" }
} else {
    L "DEPLOY OK - checking endpoints"
    try {
        $iap = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/api/orders/iap' -Method POST -Body '{}' -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10
        L "iap endpoint: $($iap.StatusCode) $($iap.Content)"
    } catch {
        $resp = $_.Exception.Response
        if ($resp) { L "iap endpoint status: $($resp.StatusCode.Value__)" } else { L "iap endpoint: $($_.Exception.Message)" }
    }
    try {
        $app = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/app/' -UseBasicParsing -TimeoutSec 10
        L "webapp page: $($app.StatusCode) len=$($app.Content.Length)"
    } catch { L "webapp FAILED: $($_.Exception.Message)" }
    try {
        $plans = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/api/plans' -UseBasicParsing -TimeoutSec 10
        L "plans: $($plans.StatusCode) $($plans.Content)"
    } catch { L "plans FAILED: $($_.Exception.Message)" }
}

L "=== deploy2 end ==="
Get-Content -LiteralPath $log | Select-Object -Last 30
