import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 移动端（Capacitor/iOS）专用构建：不加载妙搭输出插件，直接输出平铺静态文件
const PRIVATE_API_BASE = 'https://moranenglish.cn';

export default defineConfig(({ mode }) => {
  const isWeb = mode === 'web';
  const isStore = mode === 'store' || isWeb;
  const deviceAuthEnabled = mode === 'device-auth' && !isStore;
  const env = loadEnv(mode, process.cwd(), '');
  const paymentsEnabled = env.VITE_PAYMENTS_ENABLED === 'true'
    ? true
    : env.VITE_PAYMENTS_ENABLED === 'false'
      ? false
      : !isStore;
  const configuredApi = String(env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
  const configuredContentApi = String(env.VITE_CONTENT_API_BASE_URL || '').trim().replace(/\/$/, '');
  const apiBase = isWeb
    ? ''
    : isStore
      ? (configuredApi.startsWith('https://') ? configuredApi : '')
      : configuredApi || PRIVATE_API_BASE;
  const contentApiBase = isWeb
    ? ''
    : isStore
      ? (configuredContentApi.startsWith('https://') ? configuredContentApi : '')
      : configuredContentApi || apiBase;
  const storeOnlyAliases = isStore
    ? [
        {
          find: '@/components/PaymentStatusProvider',
          replacement: path.resolve(import.meta.dirname, 'src', 'components', 'PaymentStatusProvider.store.tsx'),
        },
        {
          find: '@/pages/MembershipPage/MembershipPage',
          replacement: path.resolve(import.meta.dirname, 'src', 'pages', 'MembershipPage', 'MembershipPage.store.tsx'),
        },
        {
          find: '@/lib/payment-api',
          replacement: path.resolve(import.meta.dirname, 'src', 'lib', 'payment-api.store.ts'),
        },
        {
          find: '@/lib/feature-flags',
          replacement: path.resolve(import.meta.dirname, 'src', 'lib', 'feature-flags.store.ts'),
        },
        {
          find: '@/lib/payment-i18n',
          replacement: path.resolve(import.meta.dirname, 'src', 'lib', 'payment-i18n.store.ts'),
        },
      ]
    : [];

  return {
    plugins: [react(), tailwindcss()],
    base: './',
    define: {
      'import.meta.env.MIAODA_CLIENT_BASE_PATH': JSON.stringify('/'),
      'import.meta.env.VITE_PUBLIC_STORE': JSON.stringify(isStore ? 'true' : 'false'),
      'import.meta.env.VITE_PAYMENTS_ENABLED': JSON.stringify(paymentsEnabled ? 'true' : 'false'),
      'import.meta.env.VITE_DEVICE_AUTH_ENABLED': JSON.stringify(deviceAuthEnabled ? 'true' : 'false'),
      __MORAN_API_BASE__: JSON.stringify(apiBase),
      __MORAN_CONTENT_API_BASE__: JSON.stringify(contentApiBase),
      __MORAN_WEB_TEST__: JSON.stringify(isWeb),
    },
    resolve: {
      alias: [
        ...storeOnlyAliases,
        ...(!deviceAuthEnabled
          ? [{
              find: '@/components/DeviceGate/DeviceGate',
              replacement: path.resolve(
                import.meta.dirname,
                'src',
                'components',
                'DeviceGate',
                'DeviceGate.store.tsx',
              ),
            }]
          : []),
        { find: '@', replacement: path.resolve(import.meta.dirname, 'src') },
      ],
    },
    build: {
      outDir: isWeb ? 'dist/web' : 'dist/mobile',
      emptyOutDir: true,
    },
  };
});
