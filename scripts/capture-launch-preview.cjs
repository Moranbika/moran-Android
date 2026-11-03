const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const outputDir = path.resolve('test-results', 'e2e');
const root = path.resolve('dist-electron');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.whenReady().then(async () => {
  await new Promise((resolve) => server.listen(65085, '127.0.0.1', resolve));
  fs.mkdirSync(outputDir, { recursive: true });
  const win = new BrowserWindow({
    width: 390,
    height: 844,
    show: true,
    backgroundColor: '#0d0f0e',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.webContents.setBackgroundThrottling(false);

  const capture = async (name) => {
    const image = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, `${name}.png`), image.toPNG());
  };

  for (const [name, width, height] of [
    ['mobile', 390, 844],
    ['desktop', 1180, 820],
  ]) {
    win.setContentSize(width, height);
    await win.loadURL('http://127.0.0.1:65085/');
    await sleep(650);
    await capture(`launch-${name}-brand`);
    await sleep(1800);
    await capture(`launch-${name}-reveal`);
    await sleep(320);
    await capture(`launch-${name}-reveal-mid`);
    await sleep(340);
    await capture(`launch-${name}-reveal-late`);
    await sleep(900);
    await capture(`launch-${name}-settled`);
  }

  server.close();
  win.destroy();
  app.quit();
});
