import { beforeEach, describe, expect, it, vi } from 'vitest';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

beforeEach(() => {
  vi.unstubAllGlobals();
  vi.stubGlobal('localStorage', new MemoryStorage());
  vi.stubGlobal('window', new EventTarget());
});

describe('cloud logout', () => {
  it('calls the server endpoint and clears the local token immediately', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    localStorage.setItem('moran_token', 'session-token');
    const { cloudLogout } = await import('@/lib/cloud-sync');

    const pending = cloudLogout();

    expect(localStorage.getItem('moran_token')).toBeNull();
    await pending;
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/logout$/), expect.objectContaining({
      method: 'POST',
      headers: { Authorization: 'Bearer session-token' },
    }));
  });

  it('keeps the local logout complete when the server is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    localStorage.setItem('moran_token', 'session-token');
    const { cloudLogout } = await import('@/lib/cloud-sync');

    await expect(cloudLogout()).resolves.toBeUndefined();
    expect(localStorage.getItem('moran_token')).toBeNull();
  });

  it('does not let a pending login restore a token after logout', async () => {
    let resolveLogin!: (response: Response) => void;
    vi.stubGlobal('fetch', vi.fn((input: string | URL | Request) => {
      if (String(input).endsWith('/api/login')) {
        return new Promise<Response>((resolve) => { resolveLogin = resolve; });
      }
      return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    }));
    const { cloudLogin, cloudLogout } = await import('@/lib/cloud-sync');
    const loginPending = cloudLogin('13800138000', 'password');
    await vi.waitFor(() => expect(resolveLogin).toBeTypeOf('function'));

    await cloudLogout();
    resolveLogin(new Response(JSON.stringify({ ok: true, token: 'stale-token' }), { status: 200 }));

    await expect(loginPending).resolves.toMatchObject({ ok: false });
    expect(localStorage.getItem('moran_token')).toBeNull();
  });
});
