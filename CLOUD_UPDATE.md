# 莫兰云端更新与测试分发

## 可以热更新的内容

后台发布后，测试设备不需要数据线或重新安装即可更新的内容：

- 词书与单词
- 题目解析与参考答案

App 启动时会立即检查一次；下拉工作区会立即绕过 HTTP 缓存检查并同步最新发布，
在前台运行时每分钟检查一次，回到前台也会检查。
更新成功后会保存到本机 IndexedDB，下一次离线启动继续使用最后一个版本。

## 测试构建

`.env.test` 已配置：

```dotenv
VITE_PUBLIC_STORE=true
VITE_API_BASE_URL=
VITE_CONTENT_API_BASE_URL=https://moranenglish.cn
```

构建测试包：

```powershell
npm run build:test:harmony
```

产物：

```text
harmony/entry/build/default/outputs/default/entry-default-signed.hap
```

首次安装仍需通过 USB 调试、无线调试或 AppGallery 内部测试完成。安装一次后，
后续内容改动都可以在后台发布。

## 后台发布流程

1. 打开 `https://moranenglish.cn/admin`。
2. 修改词书或单词。
3. 点击“保存草稿”。
4. 打开“发布与历史”，填写版本说明并点击“发布新版本”。
5. 测试设备保持联网。App 最迟约一分钟内切换内容。
6. 可在 App 的“更多 → 更新中心”查看版本、发布时间和发布说明。

## 需要发布新 App 版本的改动

以下改动不能通过内容热更新完成：

- 页面布局和交互
- 新增页面或功能
- 权限、隐私政策与原生模块
- 新的依赖或打包配置

这类改动需要重新构建 HAP，并上传到 AppGallery Connect 的内部测试版本。
测试用户从 AppGallery 更新，不需要数据线。HarmonyOS 普通应用不能绕过系统
安装器静默安装新 HAP，因此“后台发布后自动更新整个 App”不能只靠网页实现。

## 服务器检查

```powershell
curl.exe https://moranenglish.cn/health
curl.exe "https://moranenglish.cn/api/content/latest?since=0"
```

`/api/content/latest` 是公开只读接口，已允许跨域读取。后台管理接口仍需管理员令牌。
