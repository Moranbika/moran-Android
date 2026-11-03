// 云端同步：仅在构建时提供了有效 HTTPS 服务地址时启用。
// 公开商店构建未配置服务地址时保持完全本地运行。
const API_BASE = __MORAN_API_BASE__;
const CLOUD_ENABLED = Boolean(API_BASE);
export const cloudAccountsEnabled = CLOUD_ENABLED;

export interface CloudProgressSnapshot {
  data: unknown;
  updatedAt: number;
  revision: number;
}

export interface CloudPushResult {
  ok: boolean;
  status: number;
  conflict?: boolean;
  unauthorized?: boolean;
  data?: unknown;
  updatedAt?: number;
  revision?: number;
}

function notifyAuthChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('moran:auth-changed'));
  }
}

function clearInvalidSession(): void {
  localStorage.removeItem('moran_token');
  notifyAuthChanged();
}

async function currentDeviceSn(): Promise<string> {
  const bridge = (window as Window & {
    deviceAuth?: { getState: () => Promise<{ deviceSn?: string } | null> };
  }).deviceAuth;
  try {
    return (await bridge?.getState())?.deviceSn ?? '';
  } catch {
    return '';
  }
}

export async function cloudRegister(phone: string, password: string) {
  if (!CLOUD_ENABLED) return { ok: true, status: 0 };
  try {
    const r = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: phone, password, deviceSn: await currentDeviceSn() }),
    });
    const j = await r.json();
    if (j.token) {
      localStorage.setItem('moran_token', j.token);
      notifyAuthChanged();
    }
    return { ...j, ok: r.ok && j.ok !== false, status: r.status };
  } catch {
    return { ok: false, status: 0, msg: '无法连接账号服务，请检查网络后重试' };
  }
}

export async function cloudLogin(phone: string, password: string) {
  if (!CLOUD_ENABLED) return { ok: true, status: 0 };
  try {
    const r = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: phone, password, deviceSn: await currentDeviceSn() }),
    });
    const j = await r.json();
    if (j.token) {
      localStorage.setItem('moran_token', j.token);
      notifyAuthChanged();
    }
    return { ...j, ok: r.ok && j.ok !== false, status: r.status };
  } catch {
    return { ok: false, status: 0, msg: '无法连接账号服务，请检查网络后重试' };
  }
}

export async function cloudPushProgress(
  data: unknown,
  baseRevision = 0,
): Promise<CloudPushResult> {
  if (!CLOUD_ENABLED) return { ok: true, status: 0 };
  try {
    const token = localStorage.getItem('moran_token');
    if (!token) return { ok: false, status: 0, unauthorized: true };
    const response = await fetch(`${API_BASE}/api/sync/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data, baseRevision }),
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 401) {
      clearInvalidSession();
      return { ok: false, status: 401, unauthorized: true };
    }
    const payload = await response.json().catch(() => ({}));
    return {
      ok: response.ok && payload.ok !== false,
      status: response.status,
      conflict: response.status === 409 || payload.conflict === true,
      data: payload.data,
      updatedAt: Number(payload.updated_at || 0),
      revision: Number(payload.revision || 0),
    };
  } catch {
    return { ok: false, status: 0 };
  }
}

export async function cloudPullProgress(): Promise<CloudProgressSnapshot | null> {
  if (!CLOUD_ENABLED) return null;
  try {
    const token = localStorage.getItem('moran_token');
    if (!token) return null;
    const r = await fetch(`${API_BASE}/api/sync/pull`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    if (r.status === 401) {
      clearInvalidSession();
      return null;
    }
    const j = await r.json();
    return {
      data: j.data,
      updatedAt: Number(j.updated_at || 0),
      revision: Number(j.revision || 0),
    };
  } catch {
    return null;
  }
}

export async function cloudDeleteAccount(password: string) {
  if (!CLOUD_ENABLED) return { ok: true, cloudPending: false };
  const token = localStorage.getItem('moran_token');
  if (!token) return { ok: true, cloudPending: false };
  try {
    const response = await fetch(`${API_BASE}/api/account/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
      signal: AbortSignal.timeout(12000),
    });
    if (response.ok) {
      localStorage.removeItem('moran_token');
      notifyAuthChanged();
      return { ok: true, cloudPending: false };
    }
  } catch {
    // The local account can still be deleted while the device is offline.
  }
  return { ok: true, cloudPending: true };
}
