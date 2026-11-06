import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildMobileDeviceCode,
  checkMobileDeviceAuthorization,
  DEVICE_MESSAGE,
} from '../mobile-device-auth';

describe('mobile device authorization', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds a stable Moran device code from the native identifier', async () => {
    const first = await buildMobileDeviceCode('device-identifier-1');
    const second = await buildMobileDeviceCode('device-identifier-1');
    const other = await buildMobileDeviceCode('device-identifier-2');

    expect(first).toMatch(/^MORAN-[A-F0-9]{32}$/);
    expect(second).toBe(first);
    expect(other).not.toBe(first);
  });

  it('accepts only an explicit authorized response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ authorized: true }),
    }));

    await expect(checkMobileDeviceAuthorization('MORAN-TEST', '0.2.9', 'ios')).resolves.toEqual({
      authorized: true,
      deviceSn: 'MORAN-TEST',
      reason: '',
    });
  });

  it('fails closed when the authorization service is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    await expect(checkMobileDeviceAuthorization('MORAN-TEST', '0.2.9', 'harmony')).resolves.toEqual({
      authorized: false,
      deviceSn: 'MORAN-TEST',
      reason: '设备验证服务暂不可用，请联网后重试。',
    });
  });

  it('uses the administrator message when the device is denied', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    }));

    await expect(checkMobileDeviceAuthorization('MORAN-TEST', '0.2.9', 'ios')).resolves.toMatchObject({
      authorized: false,
      reason: DEVICE_MESSAGE,
    });
  });
});
