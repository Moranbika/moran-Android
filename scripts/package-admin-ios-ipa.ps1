param(
  [string]$BaseIpa = 'release\platforms\ios\Moran-unsigned.ipa',
  [string]$OutIpa = 'release\platforms\ios\MoranAdmin-unsigned.ipa',
  [string]$AdminUrl = 'https://moranenglish.cn/admin/'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$base = (Resolve-Path (Join-Path $root $BaseIpa)).Path
$out = Join-Path $root $OutIpa
$outTemp = "$out.new"
$temp = Join-Path $env:TEMP ("moran-admin-ipa-" + [guid]::NewGuid().ToString('N'))
$appName = [string]([char]0x83AB + [char]0x5170 + [char]0x540E + [char]0x53F0)

New-Item -ItemType Directory -Path $temp | Out-Null
try {
  [System.IO.Compression.ZipFile]::ExtractToDirectory($base, $temp)
  $app = Join-Path $temp 'Payload\App.app'
  if (-not (Test-Path -LiteralPath $app)) {
    throw "IPA app bundle was not found: $app"
  }

  $infoPlist = Join-Path $app 'Info.plist'
  $plistPatch = @'
import plistlib, sys
path = sys.argv[1]
with open(path, 'rb') as source:
    data = plistlib.load(source)
data['CFBundleIdentifier'] = 'com.moranbika.admin'
data['CFBundleDisplayName'] = '\u83ab\u5170\u540e\u53f0'
data['CFBundleName'] = 'MoranAdmin'
data['CFBundleShortVersionString'] = '1.1.6'
data['CFBundleVersion'] = '8'
data['UILaunchStoryboardName'] = 'LaunchScreen'
with open(path, 'wb') as target:
    plistlib.dump(data, target)
'@
  & py -c $plistPatch $infoPlist
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to patch the admin IPA Info.plist"
  }

  $configPath = Join-Path $app 'capacitor.config.json'
  $config = [ordered]@{
    appId = 'com.moranbika.admin'
    appName = $appName
    webDir = 'public'
    ios = [ordered]@{
      contentInset = 'always'
      scheme = 'moranadmin'
    }
    packageClassList = @()
  }
  [System.IO.File]::WriteAllText(
    $configPath,
    ($config | ConvertTo-Json -Depth 10),
    (New-Object System.Text.UTF8Encoding($false))
  )

  $public = Join-Path $app 'public'
  if (Test-Path -LiteralPath $public) {
    Remove-Item -LiteralPath $public -Recurse -Force
  }
  New-Item -ItemType Directory -Force -Path $public | Out-Null
  $adminSource = Join-Path $root 'server'
  $adminUri = [uri]$AdminUrl
  $apiOrigin = "$($adminUri.Scheme)://$($adminUri.Host)"
  $bootstrap = "<script>window.__MORAN_ADMIN_API_BASE__=$($apiOrigin | ConvertTo-Json);window.__MORAN_ADMIN_NATIVE__=true;</script>"
  $adminHtml = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $adminSource 'admin.html')
  $adminHtml = $adminHtml.Replace('<base href="/admin/">', '<base href="./">')
  $adminHtml = $adminHtml -replace '\s*<link rel="manifest"[^>]*>', ''
  $adminHtml = $adminHtml.Replace('</head>', "$bootstrap`n</head>")
  [System.IO.File]::WriteAllText(
    (Join-Path $public 'index.html'),
    $adminHtml,
    (New-Object System.Text.UTF8Encoding($false))
  )
  Copy-Item -LiteralPath (Join-Path $adminSource 'admin.css') -Destination (Join-Path $public 'admin.css')
  Copy-Item -LiteralPath (Join-Path $adminSource 'admin.js') -Destination (Join-Path $public 'admin.js')
  Copy-Item -LiteralPath (Join-Path $adminSource 'admin-icons') -Destination (Join-Path $public 'icons') -Recurse

  if (Test-Path -LiteralPath $outTemp) {
    Remove-Item -LiteralPath $outTemp -Force
  }
  [System.IO.Compression.ZipFile]::CreateFromDirectory(
    $temp,
    $outTemp,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
  )
  Move-Item -LiteralPath $outTemp -Destination $out -Force
  Write-Output $out
} finally {
  Remove-Item -LiteralPath $temp -Recurse -Force
}
