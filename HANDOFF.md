# 莫兰 App 交接（给 Codex）

## 项目
- 路径：`D:\English prepare\cet6-practice`
- 栈：React 19 + TS + Vite + Tailwind 4 + shadcn/ui + Electron 44 + ECharts
- 构建：`npm run typecheck` → `npm run electron:build` → `npm run electron:dist`
- 产物：`release/` 目录下 NSIS 安装包

## 路由（app.tsx）
Layout 下：`/`(Home) `/books` `/book/:id` `/vocab` `/listening` `/practice` `/progress` `/settings`
独立页：`/login` `/register`

## 关键文件
- `src/lib/memory.ts` — SRS，Rating=0忘/1难/2好/3易，间隔[1,2,4,7,15,30,60,120]天
- `src/lib/cloud-sync.ts` — 云端API，API_BASE=http://192.144.179.230:3000
- `src/lib/auth.ts` — 本地账号（手机号+密码SHA-256）
- `src/lib/store.ts` — localStorage，前缀`cet6-practice:`
- `src/components/ProgressProvider.tsx` — 全局学习状态
- `src/components/Layout.tsx` — 侧边栏
- `src/pages/VocabPage/` — 背单词卡片
- `src/pages/ProgressPage/` — 记忆统计三标签
- `electron/main.cjs` — 主进程（无边框/托盘/单实例）

## 加单词
编辑 `src/data/words.ts` 的 IVocabWord 对象，id 格式如 `g1-1`。
词书在 `src/data/books.ts`，按 stage 分组。

## 服务器
- IP：192.144.179.230:3000，后台 /admin（admin/admin123）
- API：POST /api/register、POST /api/login，body={username,password}
- ⚠️ 路由是 /api/register 不是 /api/auth/register
- 服务器挂了：OrcaTerm 远程桌面 → powershell →
  `cd C:\moran_server; Start-Process C:/nodejs/node-v22.11.0-win-x64/node.exe "--experimental-sqlite","server.js" -WorkingDirectory C:/moran_server -WindowStyle Hidden`

## 配色
- 主色 #1EB8A9（墨墨青绿），不要紫色渐变
- 图表 ECharts，配色同墨墨背单词

## 已知 bug
- Layout 退出登录按钮没反应
- 登录成功后没有 toast 提示
- 未登录用户没限制操作

## 禁忌
- 不要改 localStorage 前缀
- 不要改 API_BASE IP
- 不要编造"智能推荐"功能
- 不要动已验收页面布局
