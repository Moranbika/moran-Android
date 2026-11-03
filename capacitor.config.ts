import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moranbika.cet6',
  appName: '莫兰',
  webDir: 'dist/mobile',
  ios: {
    contentInset: 'always',
    scheme: 'moran',
  },
};

export default config;
