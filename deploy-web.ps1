$ErrorActionPreference = 'Continue'
$log = 'C:\moran_deploy_log.txt'
function L($m) { ("[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss'), $m) | Out-File -FilePath $log -Append -Encoding utf8 }
L "=== deploy start ==="

$dir = 'C:\moran_server'

# 1. backup current server.js
if (Test-Path "$dir\server.js") {
    Copy-Item -LiteralPath "$dir\server.js" -Destination "$dir\server.js.bak" -Force
    L "backup server.js -> server.js.bak ok"
} else {
    L "WARN: $dir\server.js not found"
}

# 2. download both packages
try {
    Invoke-WebRequest -Uri 'https://aka.doubaocdn.com/s/c8cgtrd1ZI' -OutFile 'C:\su.zip' -UseBasicParsing -TimeoutSec 60
    L "server zip downloaded: $((Get-Item 'C:\su.zip').Length) bytes"
} catch { L "server zip download FAILED: $($_.Exception.Message)" }

try {
    Invoke-WebRequest -Uri 'https://aka.doubaocdn.com/s/33mAD9MLhK' -OutFile 'C:\wa.zip' -UseBasicParsing -TimeoutSec 120
    L "web zip downloaded: $((Get-Item 'C:\wa.zip').Length) bytes"
} catch { L "web zip download FAILED: $($_.Exception.Message)" }

# 3. unpack server files
try {
    Expand-Archive -LiteralPath 'C:\su.zip' -DestinationPath $dir -Force
    L "server files unpacked"
} catch { L "server unpack FAILED: $($_.Exception.Message)" }

foreach ($f in @('server.js','iap-verify.js','iap-public-key.pem')) {
    if (Test-Path "$dir\$f") { L "  present: $f ($((Get-Item "$dir\$f").Length) bytes)" } else { L "  MISSING: $f" }
}

# 4. unpack webapp
if (-not (Test-Path "$dir\webapp")) { New-Item -ItemType Directory -Path "$dir\webapp" -Force | Out-Null }
try {
    Expand-Archive -LiteralPath 'C:\wa.zip' -DestinationPath "$dir\webapp" -Force
    L "webapp unpacked, files: $((Get-ChildItem -Path "$dir\webapp" -Recurse -File).Count)"
} catch { L "webapp unpack FAILED: $($_.Exception.Message)" }

# 5. restart service
schtasks /End /TN MoranServer 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
Start-Sleep -Seconds 2
schtasks /Run /TN MoranServer 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
L "service restarted, waiting 10s"
Start-Sleep -Seconds 10

# 6. health check with rollback
$ok = $false
for ($i = 1; $i -le 3; $i++) {
    try {
        $h = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/health' -UseBasicParsing -TimeoutSec 10
        L "health attempt $i : $($h.StatusCode) $($h.Content)"
        $ok = $true
        break
    } catch {
        L "health attempt $i FAILED: $($_.Exception.Message)"
        Start-Sleep -Seconds 5
    }
}

if (-not $ok) {
    L "ROLLBACK: restoring server.js.bak"
    if (Test-Path "$dir\server.js.bak") {
        Copy-Item -LiteralPath "$dir\server.js.bak" -Destination "$dir\server.js" -Force
        schtasks /End /TN MoranServer 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
        Start-Sleep -Seconds 2
        schtasks /Run /TN MoranServer 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
        Start-Sleep -Seconds 8
        try {
            $h2 = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/health' -UseBasicParsing -TimeoutSec 10
            L "after rollback health: $($h2.StatusCode)"
        } catch { L "after rollback health FAILED: $($_.Exception.Message)" }
    }
}

# 7. verify app page locally
try {
    $a = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/app/' -UseBasicParsing -TimeoutSec 10
    L "app page: $($a.StatusCode) len=$($a.Content.Length)"
} catch { L "app page FAILED: $($_.Exception.Message)" }

# 8. verify iap endpoint exists (should NOT be 404 now)
try {
    $iapTest = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/api/orders/iap' -Method POST -Body '{}' -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10
    L "iap endpoint: $($iapTest.StatusCode) $($iapTest.Content)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) { L "iap endpoint returned status: $($resp.StatusCode.Value__)" } else { L "iap endpoint: $($_.Exception.Message)" }
}

L "=== deploy end ==="
Get-Content -LiteralPath $log | Select-Object -Last 40
