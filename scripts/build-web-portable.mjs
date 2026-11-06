import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist', 'web');
const out = path.join(root, 'dist', 'web-portable');
const publicDir = path.join(root, 'public');

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  throw new Error('Run npm run build:web first.');
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const sourceHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const cssName = sourceHtml.match(/href="\.\/assets\/([^"]+\.css)"/)?.[1];
const jsName = sourceHtml.match(/src="\.\/assets\/([^"]+\.js)"/)?.[1];

if (!cssName || !jsName) {
  throw new Error('Could not find the built CSS or JavaScript asset.');
}

let css = fs.readFileSync(path.join(dist, 'assets', cssName), 'utf8');
let js = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');

css = css.replace(/url\((['"]?)\/moran-([a-z0-9-]+)\.svg\1\)/g, "url('./moran-$2.svg')");
css = css.replace(/url\((['"]?)\/favicon\.ico\1\)/g, "url('./favicon.ico')");

js = js.replace(/\/audio\//g, './audio/');
js = js.replace(/(["'])\/moran-([a-z0-9-]+)\.svg\1/g, '$1./moran-$2.svg$1');
js = js.replace(/<\/script/gi, '<\\/script');

const html = sourceHtml
  .replace(
    /<link[^>]+rel="stylesheet"[^>]*>/i,
    () => `<style>\n${css}\n</style>`,
  )
  .replace(
    /<script[^>]+src="\.\/assets\/[^"]+\.js"[^>]*><\/script>/i,
    () => `<script type="module">\n${js}\n</script>`,
  );

fs.writeFileSync(path.join(out, 'index.html'), html);

for (const name of fs.readdirSync(publicDir)) {
  const source = path.join(publicDir, name);
  const target = path.join(out, name);
  if (fs.statSync(source).isFile()) {
    fs.copyFileSync(source, target);
  } else if (name === 'audio') {
    fs.cpSync(source, target, { recursive: true });
  }
}

fs.writeFileSync(
  path.join(out, '使用说明.txt'),
  [
    '莫兰网页测试版（便携版）',
    '',
    '1. 解压整个文件夹，请保留所有 SVG 文件。',
    '2. 推荐双击 start.bat：会自动启动本机服务并打开浏览器。',
    '3. 也可以直接双击 index.html；如果页面空白或验证码不显示，请改用 start.bat。',
    '4. 注册可使用任意以 1 开头的 11 位手机号，无需短信验证码。',
    '5. 学习数据只保存在当前浏览器；清除浏览器数据后会丢失。',
    '6. 关闭 start.bat 的命令行窗口即可停止本机服务。',
    '',
    '发现问题时，请记录页面、浏览器、设备和操作步骤。',
  ].join('\r\n'),
);

fs.writeFileSync(
  path.join(out, 'start.bat'),
  [
    '@echo off',
    'chcp 65001 >nul',
    'cd /d "%~dp0"',
    'powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"',
    'pause',
  ].join('\r\n'),
);

fs.writeFileSync(
  path.join(out, 'start-server.ps1'),
  '\uFEFF' + [
    "$ErrorActionPreference = 'Stop'",
    '$root = $PSScriptRoot',
    '$listener = $null',
    '$port = 8080',
    'while ($port -lt 8090) {',
    '  try {',
    '    $listener = [System.Net.HttpListener]::new()',
    '    $listener.Prefixes.Add("http://127.0.0.1:$port/")',
    '    $listener.Start()',
    '    break',
    '  } catch {',
    '    if ($listener) { $listener.Close() }',
    '    $listener = $null',
    '    $port++',
    '  }',
    '}',
    'if (-not $listener) {',
    "  Write-Host '无法启动本地服务，请把此窗口截图发给开发者。'",
    '  Read-Host',
    '  exit 1',
    '}',
    '$url = "http://127.0.0.1:$port/"',
    'Start-Process $url',
    'Write-Host "莫兰网页测试版已启动：$url"',
    "Write-Host '请保持此窗口打开；关闭窗口即停止服务。'",
    'while ($listener.IsListening) {',
    '  $response = $null',
    '  try {',
    '    $context = $listener.GetContext()',
    '    $request = $context.Request',
    '    $response = $context.Response',
    '    $path = [Uri]::UnescapeDataString($request.Url.AbsolutePath)',
    '    if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }',
    "    $file = Join-Path $root $path.TrimStart('/')",
    '    if (-not (Test-Path -LiteralPath $file -PathType Leaf)) {',
    "      $file = Join-Path $root 'index.html'",
    '    }',
    '    $extension = [System.IO.Path]::GetExtension($file).ToLowerInvariant()',
    '    $mime = switch ($extension) {',
    "      '.html' { 'text/html; charset=utf-8' }",
    "      '.js' { 'text/javascript; charset=utf-8' }",
    "      '.css' { 'text/css; charset=utf-8' }",
    "      '.svg' { 'image/svg+xml' }",
    "      '.mp3' { 'audio/mpeg' }",
    "      '.ico' { 'image/x-icon' }",
    "      '.json' { 'application/json; charset=utf-8' }",
    "      '.txt' { 'text/plain; charset=utf-8' }",
    "      default { 'application/octet-stream' }",
    '    }',
    '    $length = (Get-Item -LiteralPath $file).Length',
    '    $response.ContentType = $mime',
    "    $response.Headers.Add('Cache-Control', 'no-store')",
    "    $response.Headers.Add('Accept-Ranges', 'bytes')",
    "    $range = $request.Headers['Range']",
    "    if ($range -match 'bytes=(\\d+)-(\\d*)') {",
    '      $start = [int64]$Matches[1]',
    '      $end = if ($Matches[2]) { [int64]$Matches[2] } else { $length - 1 }',
    '      if ($end -ge $length) { $end = $length - 1 }',
    '      $count = $end - $start + 1',
    '      $response.StatusCode = 206',
    '      $response.Headers.Add("Content-Range", "bytes $start-$end/$length")',
    '      $response.ContentLength64 = $count',
    '      if ($request.HttpMethod -ne "HEAD") {',
    '        $stream = [System.IO.File]::OpenRead($file)',
    '        $stream.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null',
    '        $buffer = New-Object byte[] 65536',
    '        $remaining = $count',
    '        while ($remaining -gt 0) {',
    '          $read = $stream.Read($buffer, 0, [Math]::Min($buffer.Length, $remaining))',
    '          if ($read -le 0) { break }',
    '          $response.OutputStream.Write($buffer, 0, $read)',
    '          $remaining -= $read',
    '        }',
    '        $stream.Close()',
    '      }',
    '    } else {',
    '      $response.StatusCode = 200',
    '      $response.ContentLength64 = $length',
    '      if ($request.HttpMethod -ne "HEAD") {',
    '        $bytes = [System.IO.File]::ReadAllBytes($file)',
    '        $response.OutputStream.Write($bytes, 0, $bytes.Length)',
    '      }',
    '    }',
    '  } catch {',
    "    # Ignore browser disconnects while serving audio ranges.",
    '  } finally {',
    '    if ($response) { try { $response.Close() } catch {} }',
    '  }',
    '}',
  ].join('\r\n'),
);

console.log(`Portable web build: ${out}`);
