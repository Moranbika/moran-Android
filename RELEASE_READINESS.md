# 莫兰上架准备清单

更新日期：2026-11-04

当前范围：只公开发布 HarmonyOS / AppGallery，同一 HAP 覆盖手机、平板与鸿蒙电脑（2in1）。Windows 继续作为私有安装版维护；iOS 公开商店与 Android 不在本次范围。

## 结论

代码侧的设备审核阻塞、演示短信、公开隐私/协议、账号删除、私有 HTTP 地址、服务端默认密码和构建隔离已完成。公开商店版已启用 HTTPS 云端账号与跨端学习进度同步：`.env.store` 同时配置 `VITE_API_BASE_URL` 和 `VITE_CONTENT_API_BASE_URL=https://moranenglish.cn`。重新提交商店前必须同步更新 AGC 数据安全声明，明确手机号、不可逆密码摘要和学习进度会传输到莫兰账号服务。

`1.0.0（2）` 已于 2026-10-30 重新提交，APP 备案通过后 AGC 当前状态已更新为“正在等待审核”。上传包已通过合法性与素材校验，使用仍生效的发布证书和新建 Profile；当前只需跟进审核结果，无需重复上传或提交。

2026-11-04 私有构建已恢复 32 本词书（3,588 个词）和 150 个核心词，内容格式升级为 `schemaVersion=4`，旧 ECDICT 远程内容不会再覆盖内置词书。Windows 已覆盖安装并验证；iOS IPA 与鸿蒙 release 签名 HAP / AGC APP 已重建。新内容服务包已生成，但尚未部署到 `moranenglish.cn`；公开商店版本继续使用内置内容。

## 已完成

- 新增独立公开商店构建；商店包不包含设备授权接口、设备锁定页面或私有 HTTP 地址。
- 新增可视化内容后台：词书、单词、草稿、发布、历史和 JSON 备份均可操作。
- 新增 App 内容版本检查与 IndexedDB 离线缓存；内容服务失败时回退到上一缓存或内置内容。
- 内容服务和账号服务使用不同构建变量，启用内容更新不会自动上传手机号。
- 注册页移除演示短信和虚假验证码，保留图形人机验证。
- 新增可公开访问的 `/privacy`、`/terms` 页面，登录和注册页均可进入。
- 设置页提供账号与全部本机学习数据删除入口。
- 删除操作会清理应用命名空间、登录令牌并按密码确认执行。
- 商店构建未配置 HTTPS API 时完全本机运行，不发起账号网络请求。
- 服务端改为环境变量配置管理员账号、密码和令牌密钥，增加令牌过期、登录/注册限流、CORS 白名单、请求大小限制和 scrypt 密码哈希。
- 六套清新壁纸、玻璃透明度与光线反射样式在鸿蒙手机和 2in1 模拟器通过实测。
- 鸿蒙手机完成注册、登录持久化、导航、设置、隐私页、壁纸与透明度持久化验证。
- 鸿蒙电脑 2in1 完成独立窗口启动、注册、宽屏首页和侧栏布局验证。
- 内容后台已部署到现有服务器 `http://192.144.179.230:3000/admin`，旧文件已备份，管理登录、内容总览和发布接口实测通过。
- Windows 私有版已配置该内容服务，重新构建并替换安装；安装版可读取已发布内容并建立 `moran-content` 离线缓存。
- App 与后台已加入手机号验证码找回密码流程；验证码 5 分钟有效、最多验证 5 次，并限制发送和验证频率。
- 密码重置后旧登录会话立即失效；后台可在“安全”页绑定找回手机号。
- 公网短信发送当前处于关闭状态，不会回显测试验证码；本地测试使用 `MORAN_SMS_MODE=dev` 环回模式。

## 自动化结果

- TypeScript：通过
- ESLint：通过
- Vitest：10 个测试文件 / 37 项测试通过
- Server smoke：环境变量、CORS、令牌过期、注册、登录、账号删除通过
- Electron E2E：12 个应用路由与桌面/平板/手机三档响应式检查通过
- Admin E2E：登录、四类内容编辑器、草稿保存、发布 v2 与 900px 自适应通过
- 已安装 Windows：登录页正常，运行时错误 0
- HarmonyOS 7.0 手机模拟器：调试签名包安装并启动，首页、词书和词汇页面通过
- HarmonyOS 7.0 MateBook Pro（2in1）模拟器：通过
- 正式签名 HAP：`hap-sign-tool verify-app` 通过，证书链、代码签名、权限签名和 Profile 合法
- AGC 上传包：包名、`1.0.0（2）`、设备类型和合法性检查通过，状态“已达标”
- AGC 提审：手机与 PC/2in1 截图校验通过，APP 备案通过后已进入“正在等待审核”
- 最终 HAP 设备授权复查：未包含设备授权页面、授权接口、设备码或旧授权服务器地址；公开商店构建使用透传版 `DeviceGate.store`

## 当前可交付产物

- 正式签名 HAP：`release/platforms/harmony/Moran-HarmonyOS-1.0.0-books-signed.hap`
- HAP SHA-256：`76D39F610886B355474AF1D061ABAE3E38F6EB7836BB814F26589CD44FF257D4`（2,472,318 字节）
- AGC 上传包：`release/platforms/harmony/Moran-HarmonyOS-1.0.0-books.app`
- AGC 上传包 SHA-256：`D1A270E383E71D3AB9FB77ADCBA7FA2282DAD23E68068B4DEB23C98922BD15F3`（1,284,639 字节）
- Harmony 模拟器调试签名 HAP：`release/platforms/harmony/Moran-HarmonyOS-1.0.0-emulator-signed.hap`，19,302,086 字节，SHA-256 `C2D2B79024A933382E460D8F5C5DE476707AE90869386881E31C1DDA1E408025`
- AppGallery 提审资料：`HARMONY_APPGALLERY_SUBMISSION.md`
- 商店截图：`release/platforms/harmony/screenshots/store-2026-10-28/phone/`（1080×1920）与 `desktop/`（1920×1080）
- Windows 私有安装包：`release/platforms/windows/莫兰-Setup.exe`
- Windows 安装包 SHA-256：`E7E359092D7438F3EE63497DC050CFA8C11EE0EC9501D9A187C5908E4AFB8AA1`（147,578,414 字节）
- iOS 未签名 IPA：`release/platforms/ios/Moran-unsigned.ipa`
- iOS IPA SHA-256：`332163E9FF51636953E0371B4BE61FBEDBFBCB29F4384400E08768419E5769FC`（3,523,395 字节）
- 内容后台部署包：`release/content-admin/moran-content-admin-books-20261104.zip`
- 内容后台 ZIP SHA-256：`69F806AB8DF0C3283BE6EBF8B066861169DF7E45D4715E94CC615C7822520EA3`（207,925 字节）
- 数据中心：登录在线、活跃终端、访问/访客趋势、月度/年度流量、学习、用户、订单、收入和系统健康；每 20 秒刷新，并可导出 CSV。
- 后台截图：`release/content-admin/`

当前上传包已由 DevEco 原生产包流程生成并签名。`harmony/build-profile.json5` 启用 `packOptions.appWithSignedPkg`，发布 Profile 为 `莫兰发布Profile3`。上传包内的 HAP 已解包单独验证，嵌入 Profile 与下载文件哈希一致。
个人内容后台仍可在 `https://moran.team/admin` 使用，但不属于公开商店版本，也不作为 APP 备案域名；公开版不需要等待 `moran.team` 恢复或备案。

## 提交前必须由你完成

### 1. APP 备案与 AGC 主体

- 使用真实身份完成 APP 备案。
- 确认备案主体与 AGC 开发者实名主体一致。
- 已完成：APP 备案现已通过，备案号 `晋ICP备2026017079号-1A`（服务名称“莫兰”，域名 `moranenglish.cn`）；AGC 当前版本已进入“正在等待审核”。

### 2. 正式签名

- 已完成：使用仍生效的“莫兰发布证书”创建 Profile `莫兰发布Profile3`。
- 已完成：启用 `appWithSignedPkg`，通过 DevEco `SignPackagesFromApp` 与 `SignApp` 生成正式签名包。
- 已完成：正式 HAP 与 AGC 上传包均完成本地签名验证。

### 3. 公网 HTTPS 合规页面

- 公开页已更新并发布到 `https://moranbika.github.io/moran-privacy-policy/` 与 `https://moranbika.github.io/moran-privacy-policy/user-agreement.html`。
- `server.js` 已部署到服务器；`https://moran.team/privacy` 与 `https://moran.team/terms` 已在服务器本机验证返回 302 到上述公开页。
- 确认页面无需登录即可访问，且域名、主体、应用名称与 AGC 信息一致。

### 4. 内容服务边界

- `moranenglish.cn` 同时用于公开商店版内容更新、账号登录、学习进度同步和开发者内容后台。
- 当前商店构建同时启用 `VITE_API_BASE_URL` 与 `VITE_CONTENT_API_BASE_URL`；账号请求包含手机号、不可逆密码摘要，学习同步包含学习进度，不包含明文密码或作文正文。
- 提交 AppGallery 前必须更新 AGC 数据安全表与应用内隐私说明，确认手机号、账号和学习进度会传输到莫兰账号服务，并保留账号删除与找回流程。

### 5. 内容版权

- 当前内置词书根据旧版本地内容备份恢复，只保留英文单词、中文释义和分类，去除了音标、例句与旧复习数据。
- 公开发布前必须确认这批恢复词书及其教材名称的使用授权；未确认时应继续使用 ECDICT MIT 版本或取得书面许可，不得把本地构建验收等同于商店版权审核通过。

### 6. AGC 审核资料

- 已完成：简介、分类、年龄问卷、数据安全、隐私地址、联系方式与发布范围已保存。
- 已完成：手机和 2in1 截图已通过提交前尺寸校验。
- 已完成：使用审核说明中的现场注册流程，不需要短信或服务器账号。
- 确认隐私政策中的手机号、学习数据、第三方音频服务和删除说明与最终抓包一致。

### 7. 真机最终验收

- 当前没有连接 HarmonyOS 真机，正式包尚缺真机启动验收。
- 完成注册、登录、词书、词汇、设置、重启持久化和账号删除。
- 在鸿蒙电脑上确认窗口缩放、侧栏、长文本、图表和触控/鼠标交互。

## 可选但建议

- 为 Windows 安装包购买代码签名证书，减少 SmartScreen 警告。
- 给正式隐私政策做一次法律审阅，尤其是未成年人、第三方服务和删除期限。
- 配置服务器监控、备份和告警；当前公开商店版不依赖你的服务器。
- 将公开静态页面、签名证书密码和服务器密钥保存在密码管理器中，不提交到 Git。

## Git 安全提醒

旧历史曾包含暴露过的 API Key。清理历史并轮换所有旧凭据之前，不要推送当前仓库到公开或不受控的远端。
