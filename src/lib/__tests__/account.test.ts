import { beforeEach, describe, expect, it, vi } from 'vitest';

const cloudState = vi.hoisted(() => ({
  deletePending: false,
  loginResult: { ok: true, status: 200, msg: '' },
  registerCalls: 0,
  registerResult: { ok: true, status: 200, msg: '' },
}));

vi.mock('@/lib/cloud-sync', () => ({
  cloudAccountsEnabled: true,
  cloudRegister: vi.fn(async () => {
    cloudState.registerCalls += 1;
    return cloudState.registerResult;
  }),
  cloudLogin: vi.fn(async () => cloudState.loginResult),
  cloudDeleteAccount: vi.fn(async () => ({
    ok: !cloudState.deletePending,
    cloudPending: cloudState.deletePending,
  })),
}));

class MemoryStorage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  clear() {
    this.values.clear();
  }
}

describe('local account deletion', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.stubGlobal('localStorage', new MemoryStorage());
    cloudState.deletePending = false;
    cloudState.loginResult = { ok: true, status: 200, msg: '' };
    cloudState.registerCalls = 0;
    cloudState.registerResult = { ok: true, status: 200, msg: '' };
  });

  it('does not create a local-only account when cloud registration fails', async () => {
    const { register } = await import('@/lib/auth');
    cloudState.registerResult = { ok: false, status: 503, msg: '账号服务暂不可用' };

    const result = await register('13800138003', 'MoranTest8');

    expect(result.ok).toBe(false);
    expect(result.msg).toBe('账号服务暂不可用');
    expect(cloudState.registerCalls).toBe(1);
    expect(localStorage.getItem('cet6-practice:accounts')).toBeNull();
  });

  it('accepts an admin-issued temporary password and updates the local account', async () => {
    const { login, register } = await import('@/lib/auth');
    await register('13800138003', 'MoranTest8');

    cloudState.loginResult = { ok: true, status: 200, msg: '' };
    const result = await login('13800138003', 'TemporaryPass9');

    expect(result.ok).toBe(true);
    expect(cloudState.registerCalls).toBe(1);
    expect(await login('13800138003', 'TemporaryPass9')).toMatchObject({ ok: true });
  });

  it('can sign in a cloud account that is not yet stored on this device', async () => {
    const { login } = await import('@/lib/auth');

    cloudState.loginResult = { ok: true, status: 200, msg: '' };
    const result = await login('13800138007', 'MoranTest8');

    expect(result.ok).toBe(true);
    expect(localStorage.getItem('cet6-practice:accounts')).toContain('13800138007');
  });

  it('removes the account, token, and every app data key after password verification', async () => {
    const { register, deleteAccount } = await import('@/lib/auth');
    const phone = '13800138000';
    expect((await register(phone, 'MoranTest8')).ok).toBe(true);
    localStorage.setItem('moran_token', 'test-token');
    localStorage.setItem('cet6-practice:progress', '{"learnedWords":["w1"]}');
    localStorage.setItem('cet6-practice:book-sort-cet6', 'alphabetical');
    localStorage.setItem('unrelated:key', 'keep');

    const result = await deleteAccount(phone, 'MoranTest8');

    expect(result.ok).toBe(true);
    expect(localStorage.getItem('cet6-practice:accounts')).toBeNull();
    expect(localStorage.getItem('cet6-practice:progress')).toBeNull();
    expect(localStorage.getItem('cet6-practice:book-sort-cet6')).toBeNull();
    expect(localStorage.getItem('moran_token')).toBeNull();
    expect(localStorage.getItem('unrelated:key')).toBe('keep');
  });

  it('keeps local data when the password is wrong', async () => {
    const { register, deleteAccount } = await import('@/lib/auth');
    const phone = '13800138001';
    expect((await register(phone, 'MoranTest8')).ok).toBe(true);

    const result = await deleteAccount(phone, 'wrong-password');

    expect(result.ok).toBe(false);
    expect(localStorage.getItem('cet6-practice:accounts')).not.toBeNull();
  });

  it('replaces the local password after the recovery service verifies the code', async () => {
    const { register, login, resetPasswordWithCode } = await import('@/lib/auth');
    const phone = '13800138002';
    expect((await register(phone, 'OldPassword8')).ok).toBe(true);
    const calls: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
      calls.push(String(input));
      const payload = String(input).endsWith('/verify')
        ? { ok: true, resetToken: 'verified-ticket' }
        : { ok: true };
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }));

    const result = await resetPasswordWithCode(phone, '123456', 'NewPassword9');

    expect(result.ok).toBe(true);
    expect(calls.some((url) => url.endsWith('/api/recovery/verify'))).toBe(true);
    expect(calls.some((url) => url.endsWith('/api/recovery/reset'))).toBe(true);
    cloudState.loginResult = { ok: false, status: 401, msg: '密码错误' };
    expect((await login(phone, 'OldPassword8')).ok).toBe(false);
    cloudState.loginResult = { ok: true, status: 200, msg: '' };
    expect((await login(phone, 'NewPassword9')).ok).toBe(true);
  });
});
