const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve('dist/mobile');
const outputDir = path.resolve(
  'release',
  'platforms',
  'harmony',
  'screenshots',
  'store-2026-11-04-vocabulary-tablet',
);
const port = 65086;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  let filePath = path.join(root, relative);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, 'index.html');
  }
  response.writeHead(200, {
    'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  response.end(fs.readFileSync(filePath));
});

app.whenReady().then(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });

  const win = new BrowserWindow({
    width: 1920,
    height: 1280,
    useContentSize: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      offscreen: true,
    },
  });
  win.setContentSize(1920, 1280, false);
  win.webContents.setBackgroundThrottling(false);

  try {
    await win.loadURL(`http://127.0.0.1:${port}/`);
    await sleep(4200);
    await win.webContents.executeJavaScript(`(() => {
      localStorage.setItem('cet6-practice:settings', JSON.stringify({
        selectedBookId: 'cet6', loginMethod: 'account', loggedIn: true,
        dailyTarget: 15, memoryMode: 0, accent: 'us', examDate: '', planIntensity: 'standard',
        theme: 'mist', wallpaper: 'dawn'
      }));
      localStorage.setItem('cet6-practice:privacy-consent', JSON.stringify({
        version: '2026-11-02', acceptedAt: Date.now()
      }));
      localStorage.setItem('cet6-practice:permission-consent-v2', JSON.stringify({
        done: true,
        results: { network: 'accepted', storage: 'accepted', notifications: 'denied' }
      }));
    })()`, true);

    for (const [route, fileName] of [
      ['/', 'tablet-01-home.png'],
      ['/vocab', 'tablet-02-vocab.png'],
      ['/progress', 'tablet-03-progress.png'],
    ]) {
      await win.loadURL(`http://127.0.0.1:${port}${route}`);
      await sleep(4500);
      const image = await win.webContents.capturePage({ x: 0, y: 0, width: 1920, height: 1280 });
      fs.writeFileSync(path.join(outputDir, fileName), image.toPNG());
    }

    server.close();
    win.destroy();
    app.quit();
  } catch (error) {
    console.error(error.stack || error.message);
    server.close();
    win.destroy();
    app.exit(1);
  }
});
