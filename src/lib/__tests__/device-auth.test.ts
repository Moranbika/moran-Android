import { createRequire } from 'node:module';
import { describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const {
  buildDeviceCode,
  checkDeviceAuthorization,
} = require('../../../electron/device-auth.cjs') as {
  buildDeviceCode: (identity: Record<string, string>) => string | null;
  checkDeviceAuthorization: (deviceSn: string, version: string) => Promise<{
    authorized: boolean;
    deviceSn: string;
    reason: string;
  }>;
};

describe('设备授权', () => {
  it('用硬件标识生成稳定且不暴露原始 SN 的设备码', () => {
    const first = buildDeviceCode({
      uuid: 'UUID-001',
      serial: 'BIOS-SERIAL-001',
      machineGuid: 'MACHINE-GUID-001',
    });
    const second = buildDeviceCode({
      uuid: ' UUID-001 ',
      serial: 'BIOS-SERIAL-001',
      machineGuid: 'MACHINE-GUID-001',
    });
    expect(first).toBe(second);
    expect(first).toMatch(/^MORAN-[A-F0-9]{32}$/);
    expect(first).not.toContain('BIOS-SERIAL-001');
  });

  it('无法读取有效硬件标识时不生成设备码', () => {
    expect(buildDeviceCode({ uuid: 'To be filled by O.E.M.', serial: '' })).toBeNull();
  });

  it('授权通过时返回可用状态', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ authorized: true }),
    }));
    await expect(checkDeviceAuthorization('MORAN-TEST', '0.2.9')).resolves.toMatchObject({
      authorized: true,
      deviceSn: 'MORAN-TEST',
    });
    vi.unstubAllGlobals();
  });

  it('未授权和服务异常都拒绝进入 App', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ authorized: false, msg: '未授权设备' }),
    }));
    await expect(checkDeviceAuthorization('MORAN-TEST', '0.2.9')).resolves.toMatchObject({
      authorized: false,
      reason: '未授权设备',
    });

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(checkDeviceAuthorization('MORAN-TEST', '0.2.9')).resolves.toMatchObject({
      authorized: false,
      reason: '设备验证服务暂不可用，请联网后重试。',
    });
    vi.unstubAllGlobals();
  });
});
