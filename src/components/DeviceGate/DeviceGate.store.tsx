import type { ReactNode } from 'react';

// 默认构建与公开商店包不包含启动级设备授权流程。
export function DeviceGate({ children }: { children: ReactNode }) {
  return children;
}
