export const DEVICE_API = 'http://192.144.179.230:3000/api/device/check';
export const DEVICE_MESSAGE = '设备未授权，请联系管理员 2218145697@qq.com';

export type NativeDevicePlatform = 'ios' | 'harmony';

export interface MobileDeviceAuthorization {
  authorized: boolean;
  deviceSn: string;
  reason: string;
}

export async function buildMobileDeviceCode(identifier: string): Promise<string | null> {
  const normalized = identifier.trim();
  if (!normalized) return null;
  const payload = new TextEncoder().encode(`moran-device-v1|${normalized}`);
  const digest = await crypto.subtle.digest('SHA-256', payload);
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `CET6-${hex.slice(0, 32)}`;
}

export async function checkMobileDeviceAuthorization(
  deviceSn: string,
  appVersion: string,
  platform: NativeDevicePlatform,
): Promise<MobileDeviceAuthorization> {
  try {
    const response = await fetch(DEVICE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceSn, appVersion, platform }),
      signal: AbortSignal.timeout(12000),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok && payload.authorized === true) {
      return { authorized: true, deviceSn, reason: '' };
    }
    return {
      authorized: false,
      deviceSn,
      reason: typeof payload.msg === 'string' ? payload.msg : DEVICE_MESSAGE,
    };
  } catch {
    return {
      authorized: false,
      deviceSn,
      reason: '设备验证服务暂不可用，请联网后重试。',
    };
  }
}
