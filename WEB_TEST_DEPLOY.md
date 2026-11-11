# 莫兰网页测试版 · 部署说明

生成时间：2026-11-10
产物：`dist/web/`（构建目录）、`dist/moran-webapp.zip`（部署包，479,603 字节）

## 这是什么

用现有源码构建的纯网页版本，**不影响 Windows、鸿蒙、iOS 任何一端**：

- 构建走 `vite.mobile.config.ts --mode web`，输出到 `dist/web`
- 网页版 `deviceSn` 恒为空 → 服务端跳过白名单校验 → **任何人打开就能注册登录**
- 学习数据存浏览器 localStorage，不上传

## 部署（三步）

服务端 `server.js` 已经内置了 `/app/` 静态托管（`WEBAPP_DIR`，默认 `C:\moran_server\webapp`），所以**不用改服务端代码**。

1. 把 `dist\moran-webapp.zip` 传到服务器，解压到 `C:\moran_server\webapp`
   （解压后 `webapp\index.html` 必须直接在这一层，不要再套一层文件夹）
2. 确保服务器上该目录存在；静态文件是即时读取，一般无需重启 `MoranServer`
3. 浏览器打开 `https://moranenglish.cn/app/`

## 已验证（本地实测）

| 检查项 | 结果 |
| --- | --- |
| `GET /app/` | 200，页面正常渲染，标题「莫兰 · 网页测试版」 |
| 隐私弹窗 + 测试引导弹窗 | 可正常勾选、关闭 |
| 注册流程 | 填手机号 + 图形验证码 + 密码，注册成功进入首页 |
| `POST /api/register`（无 deviceSn） | 200，返回 token |
| 线上 `https://moranenglish.cn/api/register`（无 deviceSn） | 200（线上本来就不拦） |
| 线上 `https://moranenglish.cn/app/` | 404（目录还没上传，这就是要部署的东西） |
| 线上 `POST /api/orders/iap` | 404（线上 server.js 仍是旧版，未含 IAP 接口） |

## 测试须知

- 注册用任意以 1 开头的 11 位手机号，无需短信验证码
- 图形验证码需人眼看图填写
- 账号与学习数据只存在当前浏览器，换浏览器或清缓存就没了
- 在线发音、听力音频需要联网
- **网页版没有支付**：华为 IAP 只在鸿蒙 App 内可用，浏览器里不接第三方支付
- 并发高时注意服务器带宽（单次首屏约 1.2 MB JS）

## 命令

```powershell
cd "D:\English prepare\cet6-practice"
npm run build:web
```

产物在 `dist/web`。想重新打包 zip：

```powershell
Compress-Archive -Path "dist\web\*" -DestinationPath "dist\moran-webapp.zip" -Force
```

## 我没做的

- 没有上传到服务器：本机没有该服务器的 SSH 凭据（`~/.ssh` 里只有 github.com 和 localhost.run，没有 192.144.179.230 的密钥或密码）
- 线上 server.js 仍是旧版（缺 `POST /api/orders/iap`），要等下次部署 `server.js` 才生效；这与网页版无关
- 未测试大并发
