const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve('dist-electron');
const outputDir = path.resolve('test-results', 'preview-2');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
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
    server.listen(65085, '127.0.0.1', resolve);
  });
}

app.whenReady().then(async () => {
  await startServer();
  fs.mkdirSync(outputDir, { recursive: true });
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    useContentSize: true,
    show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.webContents.setBackgroundThrottling(false);
  const evaluate = (code) => win.webContents.executeJavaScript(code, true);
  const waitForLaunch = async () => {
    const deadline = Date.now() + 7000;
    while (Date.now() < deadline) {
      if (!(await evaluate('Boolean(document.querySelector(".moran-launch"))'))) return;
      await sleep(100);
    }
  };
  const load = async (route) => {
    await win.loadURL(`http://127.0.0.1:65085${route}`);
    await sleep(250);
    await waitForLaunch();
    await sleep(750);
  };
  const capture = async (name) => {
    if (!win.isVisible()) win.showInactive();
    await sleep(250);
    const image = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, `${name}.png`), image.toPNG());
    win.hide();
  };

  try {
    await load('/');
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());
    await evaluate(`(() => {
      localStorage.setItem('cet6-practice:settings', JSON.stringify({
        selectedBookId: 'core', loginMethod: 'account', loggedIn: true, dailyTarget: 15,
        memoryMode: 0, accent: 'us', nickname: '莫兰学习者', wallpaper: 'dawn',
        theme: 'mist', avatar: 'leaf', fontScale: 1, glassOpacity: 52, language: 'zh'
      }));
      localStorage.setItem('cet6-practice:privacy-consent', JSON.stringify({
        version: '2026-11-02', acceptedAt: Date.now()
      }));
      localStorage.setItem('cet6-practice:permission-consent-v2', JSON.stringify({
        done: true,
        results: { network: 'accepted', storage: 'accepted', notifications: 'denied', calendar: 'denied' }
      }));
      localStorage.setItem('cet6-practice:study-reminder:${today}', String(Date.now() + 86400000));
    })()`);
    await load('/');
    await capture('desktop-home');
    await load('/books');
    await capture('desktop-books');
    await load('/plan');
    await capture('desktop-plan');
    await load('/settings');
    await capture('desktop-settings');
    await load('/progress');
    await capture('desktop-progress');
    await load('/updates');
    await capture('desktop-updates');

    await evaluate(`document.documentElement.dataset.touch = 'true'`);
    win.setContentSize(390, 844);
    await sleep(450);
    await load('/');
    await evaluate(`document.documentElement.dataset.touch = 'true'`);
    await sleep(500);
    await capture('mobile-home');
    await evaluate(`document.querySelector('.app-main-scroll').scrollTop = 560`);
    await sleep(350);
    await capture('mobile-home-lower');
    await load('/books');
    await evaluate(`document.documentElement.dataset.touch = 'true'`);
    await sleep(500);
    await capture('mobile-books');
    await load('/settings');
    await evaluate(`document.documentElement.dataset.touch = 'true'`);
    await sleep(500);
    await capture('mobile-settings');
    console.log(`Preview screenshots: ${outputDir}`);
  } finally {
    server?.close();
    win.destroy();
    app.exit(0);
  }
});
