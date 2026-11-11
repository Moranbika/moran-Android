const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve('dist', 'mobile');
const outputRoot = path.resolve('release', 'store-submission-20261111', 'screenshots');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
};

let server;

async function startServer() {
  server = http.createServer((request, response) => {
    const pathname = decodeURIComponent((request.url || '/').split('?')[0]);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    let file = path.join(root, relative);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(root, 'index.html');
    }
    response.writeHead(200, {
      'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(fs.readFileSync(file));
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(65086, '127.0.0.1', resolve);
  });
}

async function captureSet(win, name, cssWidth, cssHeight, scale, outputWidth, outputHeight, routes) {
  const outputDir = path.join(outputRoot, name);
  fs.mkdirSync(outputDir, { recursive: true });
  win.setContentSize(outputWidth, outputHeight);
  await sleep(250);
  win.webContents.setZoomFactor(outputWidth / cssWidth);
  await sleep(400);
  for (const [index, route] of routes.entries()) {
    await win.loadURL(`http://127.0.0.1:65086${route}`);
    await sleep(300);
    const deadline = Date.now() + 9000;
    while (Date.now() < deadline) {
      const launching = await win.webContents.executeJavaScript(
        'Boolean(document.querySelector(".moran-launch"))',
        true,
      );
      if (!launching) break;
      await sleep(120);
    }
    await sleep(900);
    await win.webContents.executeJavaScript(
      `document.documentElement.dataset.touch = 'true'`,
      true,
    );
    await sleep(250);
    const captured = await win.webContents.capturePage();
    const image = captured.getSize().width === outputWidth && captured.getSize().height === outputHeight
      ? captured
      : captured.crop({ x: 0, y: 0, width: outputWidth, height: outputHeight });
    const file = path.join(outputDir, `${name}-${String(index + 1).padStart(2, '0')}-${route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'}.png`);
    fs.writeFileSync(file, image.toPNG());
    console.log(file);
  }
}

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    throw new Error(`Missing mobile build: ${root}`);
  }
  await startServer();
  fs.mkdirSync(outputRoot, { recursive: true });
  const win = new BrowserWindow({
    width: 960,
    height: 640,
    useContentSize: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      offscreen: true,
    },
  });
  win.webContents.setBackgroundThrottling(false);
  const evaluate = (code) => win.webContents.executeJavaScript(code, true);

  try {
    await win.loadURL('http://127.0.0.1:65086/');
    await sleep(500);
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    await evaluate(`(() => {
      localStorage.setItem('cet6-practice:settings', JSON.stringify({
        selectedBookId: 'core',
        loginMethod: 'account',
        loggedIn: true,
        accountId: '13800138000',
        dailyTarget: 15,
        memoryMode: 0,
        accent: 'us',
        nickname: '莫兰学习者',
        wallpaper: 'dawn',
        theme: 'mist',
        avatar: 'leaf',
        fontScale: 1,
        glassOpacity: 52,
        language: 'zh'
      }));
      localStorage.setItem('cet6-practice:privacy-consent', JSON.stringify({
        version: '2026-11-02',
        acceptedAt: Date.now()
      }));
      localStorage.setItem('cet6-practice:permission-consent-v2', JSON.stringify({
        done: true,
        results: {
          network: 'accepted',
          storage: 'accepted',
          notifications: 'denied',
          calendar: 'denied'
        }
      }));
      localStorage.setItem('cet6-practice:study-reminder:${today}', String(Date.now() + 86400000));
      document.documentElement.dataset.touch = 'true';
    })()`);

    await captureSet(win, 'phone', 360, 640, 3, 1080, 1920, ['/', '/books', '/progress']);
    await captureSet(win, 'tablet', 960, 640, 2, 1920, 1280, ['/', '/books', '/progress']);
    console.log(`Store screenshots: ${outputRoot}`);
  } finally {
    server?.close();
    win.destroy();
    app.exit(0);
  }
});
