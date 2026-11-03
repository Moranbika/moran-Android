const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

app.commandLine.appendSwitch('no-proxy-server');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

const root = path.resolve('dist/mobile');
const port = 65090;
const outputRoot = path.resolve(
  'release',
  'platforms',
  'harmony',
  'screenshots',
  'store-2026-11-02-upload',
);
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
  console.log(`request ${requestPath}`);
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

const now = Date.now();
const day = 86400000;
const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dateOfMonth = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dateOfMonth}`;
};

const wordIds = Array.from({ length: 52 }, (_, index) => `w${index + 1}`);
const streakDates = Array.from({ length: 10 }, (_, index) => (
  dateKey(new Date(now - (9 - index) * day))
));
const memory = {};
const wordStats = {};
const reviewLog = [];

wordIds.forEach((id, index) => {
  const mastered = index < 34;
  memory[id] = {
    status: mastered ? 'mastered' : 'learning',
    ease: mastered ? 2.6 : 1.8,
    interval: mastered ? 30 : 1,
    due: now + (index < 14 ? -(1 + (index % 3)) * 3600000 : (1 + (index % 10)) * day),
    reps: mastered ? 4 : 2,
    lapses: mastered ? 0 : 1,
    lastRating: mastered ? 3 : 1,
    learnedAt: now - (1 + (index % 18)) * day,
  };
  wordStats[id] = { correct: mastered ? 4 : 2, wrong: mastered ? 0 : 1 };
  for (let review = 0; review < 3; review += 1) {
    reviewLog.push({
      wordId: id,
      rating: review === 2 ? 1 : 2,
      ts: now - (index % 14 + 1) * day + review * 7200000,
    });
  }
});

const studyLog = {};
const dailyActivity = {};
streakDates.forEach((date, index) => {
  studyLog[date] = 1800 + ((index * 677) % 1800);
  dailyActivity[date] = {
    newWords: 6 + (index % 8),
    reviews: 12 + (index % 11),
    listening: index % 3,
    questions: 18 + (index % 16),
  };
});

const questionResults = {};
for (let index = 0; index < 327; index += 1) {
  questionResults[`sample-q-${index + 1}`] = index >= 52;
}

const settings = {
  selectedBookId: 'cet6',
  loginMethod: 'account',
  loggedIn: true,
  dailyTarget: 15,
  memoryMode: 0,
  accent: 'us',
  nickname: '莫兰同学',
  examDate: dateKey(new Date(now + 52 * day)),
  planIntensity: 'standard',
  theme: 'mist',
  wallpaper: 'dawn',
  avatar: 'leaf',
  fontScale: 1,
  glassOpacity: 52,
  language: 'zh',
};

const progress = {
  learnedWords: wordIds,
  favoriteWords: ['w7', 'w16', 'w31'],
  wordStats,
  memory,
  listeningDone: ['cet6-2025-12-1'],
  questionResults,
  streakDates,
  reviewLog: reviewLog.sort((left, right) => left.ts - right.ts),
  studyLog,
  dailyActivity,
  mockExamAttempts: [
    {
      id: 'store-screenshot-mock',
      examSetId: 'cet6-2025-12-1',
      completedAt: now - 2 * day,
      durationSeconds: 7380,
      listeningCorrect: 19,
      listeningTotal: 25,
      readingCorrect: 27,
      readingTotal: 30,
      answers: {},
    },
  ],
};

const seedStorage = `
  localStorage.setItem('cet6-practice:settings', ${JSON.stringify(JSON.stringify(settings))});
  localStorage.setItem('cet6-practice:progress', ${JSON.stringify(JSON.stringify(progress))});
  localStorage.setItem('cet6-practice:privacy-consent', ${JSON.stringify(JSON.stringify({
    version: '2026-11-02',
    acceptedAt: now,
  }))});
  localStorage.setItem('cet6-practice:permission-consent-v2', ${JSON.stringify(JSON.stringify({
    done: true,
    results: {
      network: 'accepted',
      storage: 'accepted',
      calendar: 'denied',
      notifications: 'denied',
    },
  }))});
`;

const profiles = [
  { folder: 'phone', width: 1080, height: 1920, prefix: 'phone', touch: true },
  { folder: 'tablet', width: 1920, height: 1280, prefix: 'tablet', touch: true },
  { folder: 'desktop', width: 1920, height: 1080, prefix: 'desktop', touch: false },
].filter((profile) => (
  !process.env.SCREENSHOT_PROFILE || profile.folder === process.env.SCREENSHOT_PROFILE
));

const routes = [
  ['/', '01-home'],
  ['/vocab', '02-vocab'],
  ['/practice', '03-practice'],
];

app.whenReady().then(async () => {
  fs.mkdirSync(outputRoot, { recursive: true });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });

  try {
    for (const profile of profiles) {
      const folder = path.join(outputRoot, profile.folder);
      fs.mkdirSync(folder, { recursive: true });

      const win = new BrowserWindow({
        width: profile.width,
        height: profile.height,
        useContentSize: true,
        show: false,
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          sandbox: false,
          offscreen: false,
        },
      });
      win.setContentSize(profile.width, profile.height, false);
      win.webContents.setBackgroundThrottling(false);
      win.webContents.setZoomFactor(1);
      win.webContents.on('did-fail-load', (_event, code, description, url) => {
        console.error(`load failed ${code} ${description} ${url}`);
      });
      win.webContents.on('console-message', (_event, level, message, line, sourceId) => {
        console.log(`console ${level} ${message} ${sourceId}:${line}`);
      });

      await win.loadURL(`http://127.0.0.1:${port}/`);
      await sleep(2600);
      await win.webContents.executeJavaScript(seedStorage, true);
      await win.loadURL(`http://127.0.0.1:${port}/`);
      await sleep(3600);

      for (const [route, suffix] of routes) {
        await win.loadURL(`http://127.0.0.1:${port}/`);
        await sleep(2000);
        if (route !== '/') {
          await win.webContents.executeJavaScript(
            `history.pushState({}, '', ${JSON.stringify(route)}); window.dispatchEvent(new PopStateEvent('popstate'));`,
            true,
          );
        }
        if (profile.touch) {
          await win.webContents.executeJavaScript(
            "document.documentElement.dataset.touch = 'true';",
            true,
          );
        }
        await sleep(3200);
        const image = await win.webContents.capturePage({
          x: 0,
          y: 0,
          width: profile.width,
          height: profile.height,
        });
        fs.writeFileSync(
          path.join(folder, `${profile.prefix}-${suffix}.png`),
          image.toPNG(),
        );
      }

      win.destroy();
    }

    server.close();
    app.quit();
  } catch (error) {
    console.error(error.stack || error.message);
    server.close();
    app.exit(1);
  }
});
