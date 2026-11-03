const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve('dist/mobile');
const outputDir = path.resolve('test-results', 'store-no-payments');
const port = 65085;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
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
  '.ttf': 'font/ttf',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readBuiltFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return readBuiltFiles(filePath);
    if (!/\.(?:js|css|html)$/i.test(entry.name)) return [];
    return [{ filePath, text: fs.readFileSync(filePath, 'utf8') }];
  });
}

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
  const builtFiles = readBuiltFiles(root);
  for (const marker of [
    '会员套餐',
    '登录云端账号',
    '确认支付',
    '支付宝',
    '/api/orders',
    '/api/plans',
    '/api/me/quota',
    'payment-tracker',
    'payment-result',
  ]) {
    const match = builtFiles.find(({ text }) => text.includes(marker));
    assert(!match, `商店构建仍包含收费功能标记：${marker} (${match?.filePath || ''})`);
  }

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  fs.mkdirSync(outputDir, { recursive: true });

  const win = new BrowserWindow({
    width: 390,
    height: 844,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.webContents.setBackgroundThrottling(false);
  const errors = [];
  win.webContents.on('console-message', (event) => {
    if (event.level === 'error') errors.push(event.message);
  });
  const evaluate = (expression) => win.webContents.executeJavaScript(expression, true);
  const waitForLaunch = async () => {
    const deadline = Date.now() + 4500;
    while (Date.now() < deadline) {
      if (!(await evaluate('Boolean(document.querySelector(".moran-launch"))'))) return;
      await sleep(100);
    }
    throw new Error('启动动画超过 4.5 秒仍未结束');
  };
  const navigate = async (route) => {
    await win.loadURL(`http://127.0.0.1:${port}${route}`);
    await sleep(3500);
    await waitForLaunch();
    await sleep(500);
  };

  try {
    await navigate('/');
    await evaluate(`(() => {
      localStorage.setItem('cet6-practice:settings', JSON.stringify({
        selectedBookId: 'cet6', loginMethod: 'account', loggedIn: true,
        dailyTarget: 15, memoryMode: 0, accent: 'us', examDate: '', planIntensity: 'standard',
        theme: ${JSON.stringify(process.env.THEME || 'mist')},
        wallpaper: ${JSON.stringify(process.env.WALLPAPER || 'dawn')}
      }));
      localStorage.setItem('cet6-practice:privacy-consent', JSON.stringify({
        version: '2026-11-02', acceptedAt: Date.now()
      }));
      localStorage.setItem('cet6-practice:permission-consent-v2', JSON.stringify({
        done: true,
        results: { network: 'accepted', storage: 'accepted', notifications: 'denied' }
      }));
    })()`);

    await navigate('/settings');
    const settingsText = await evaluate('document.body.innerText');
    for (const marker of ['会员额度', '开通会员', '购买 / 续费', '会员套餐']) {
      assert(!settingsText.includes(marker), `商店版设置页仍出现收费入口：${marker}`);
    }
    for (const marker of ['APP 备案号', '晋ICP备2026017079号-1A', '隐私政策', '用户协议', '本地规则', 'AI 生成功能仍在开发中']) {
      assert(settingsText.includes(marker), `商店版设置页缺少底部信息：${marker}`);
    }

    await navigate('/membership');
    const membershipUrl = new URL(win.webContents.getURL()).pathname;
    const membershipText = await evaluate('document.body.innerText');
    assert(membershipUrl === '/settings', `商店版 /membership 没有回到设置页：${membershipUrl}`);
    assert(!membershipText.includes('会员套餐'), '商店版仍能打开会员套餐页');

    const image = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'settings-no-payments.png'), image.toPNG());
    await evaluate(`document.querySelector('.app-main-scroll')?.scrollTo({ top: 999999 })`);
    await sleep(300);
    const footerImage = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'settings-footer-no-payments.png'), footerImage.toPNG());
    await navigate('/more');
    const moreImage = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'more-no-payments.png'), moreImage.toPNG());
    assert(errors.length === 0, `商店版设置页出现运行时错误：${errors.join(' | ')}`);
    console.log('Store no-payments check passed.');
    console.log(`Screenshot: ${path.join(outputDir, 'settings-no-payments.png')}`);
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
