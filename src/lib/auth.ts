// 手机号 + 密码账号系统：云端保存不可逆密码摘要，本机保存加盐摘要用于离线校验。

import { store } from '@/lib/store';
import {
  cloudAccountsEnabled,
  cloudDeleteAccount,
  cloudLogin,
  cloudRegister,
} from '@/lib/cloud-sync';

interface Account {
  phone: string;
  salt: string;
  hash: string;
  createdAt: number;
}

const KEY = 'accounts';
const API_BASE = __MORAN_API_BASE__;

function notifyAuthChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('moran:auth-changed'));
  }
}

export function isValidPhone(phone: string): boolean {
  return /^1\d{10}$/.test(phone.trim());
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}::${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomSalt(): string {
  const arr = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function register(
  phone: string,
  password: string,
): Promise<{ ok: boolean; msg: string }> {
  const ph = phone.trim();
  if (!isValidPhone(ph)) return { ok: false, msg: '请输入有效的 11 位手机号' };
  if (password.length < 6) return { ok: false, msg: '密码至少 6 位' };
  const list = store.get<Account[]>(KEY, []);
  if (list.some((a) => a.phone === ph)) return { ok: false, msg: '该手机号已注册，请直接登录' };
  if (cloudAccountsEnabled) {
    const cloud = await cloudRegister(ph, password);
    if (!cloud.ok) return { ok: false, msg: cloud.msg || '账号服务暂时不可用，请稍后重试' };
  }
  const salt = randomSalt();
  const hash = await hashPassword(password, salt);
  list.push({ phone: ph, salt, hash, createdAt: Date.now() });
  store.set(KEY, list);
  return { ok: true, msg: '注册成功' };
}

export async function login(
  phone: string,
  password: string,
): Promise<{ ok: boolean; msg: string; phone?: string }> {
  const ph = phone.trim();
  const list = store.get<Account[]>(KEY, []);
  const account = list.find((a) => a.phone === ph);
  if (!cloudAccountsEnabled) {
    if (!account) return { ok: false, msg: '该手机号未注册，请先注册' };
    const hash = await hashPassword(password, account.salt);
    if (hash !== account.hash) return { ok: false, msg: '密码错误' };
    return { ok: true, msg: '登录成功', phone: ph };
  }

  const localMatches = account
    && (await hashPassword(password, account.salt)) === account.hash;
  let cloud = await cloudLogin(ph, password);
  if (!cloud.ok && cloud.status === 404 && localMatches) {
    // Migrate accounts created by an older build that could not reach the server.
    cloud = await cloudRegister(ph, password);
  }
  if (!cloud.ok) {
    if (cloud.status === 404) return { ok: false, msg: '该手机号未注册，请先注册' };
    if (account && !localMatches && cloud.status === 401) {
      return { ok: false, msg: '密码错误' };
    }
    return { ok: false, msg: cloud.msg || '无法连接账号服务，请稍后重试' };
  }

  if (account) {
    const hash = await hashPassword(password, account.salt);
    if (hash !== account.hash) {
      const salt = randomSalt();
      const nextHash = await hashPassword(password, salt);
      const nextList = list.map((item) => (
        item.phone === ph
          ? { ...item, salt, hash: nextHash }
          : item
      ));
      store.set(KEY, nextList);
    }
  } else {
    const salt = randomSalt();
    list.push({
      phone: ph,
      salt,
      hash: await hashPassword(password, salt),
      createdAt: Date.now(),
    });
    store.set(KEY, list);
  }
  return { ok: true, msg: '登录成功', phone: ph };
}

export function hasLocalAccount(phone: string): boolean {
  const ph = phone.trim();
  return store.get<Account[]>(KEY, []).some((account) => account.phone === ph);
}

async function recoveryRequest(path: string, body: unknown): Promise<{ ok: boolean; msg: string; [key: string]: unknown }> {
  if (!API_BASE) return { ok: false, msg: '当前版本未启用短信找回，请使用原设备或联系开发者' };
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });
    const payload = await response.json().catch(() => ({}));
    return {
      ...payload,
      ok: response.ok && payload.ok !== false,
      msg: payload.msg || (response.ok ? '' : '找回失败，请稍后再试'),
    };
  } catch {
    return { ok: false, msg: '无法连接找回服务，请检查网络后重试' };
  }
}

export async function sendPasswordResetCode(phone: string) {
  const ph = phone.trim();
  if (!isValidPhone(ph)) return { ok: false, msg: '请输入有效的 11 位手机号' };
  if (!hasLocalAccount(ph)) return { ok: false, msg: '当前设备上没有这个账号，请先注册或联系开发者' };
  return recoveryRequest('/api/recovery/send', { scope: 'app', account: ph });
}

export async function resetPasswordWithCode(phone: string, code: string, newPassword: string) {
  const ph = phone.trim();
  if (!isValidPhone(ph)) return { ok: false, msg: '请输入有效的 11 位手机号' };
  if (!hasLocalAccount(ph)) return { ok: false, msg: '当前设备上没有这个账号' };
  if (!/^\d{6}$/.test(code.trim())) return { ok: false, msg: '请输入 6 位短信验证码' };
  if (newPassword.length < 6) return { ok: false, msg: '新密码至少 6 位' };

  const verified = await recoveryRequest('/api/recovery/verify', {
    scope: 'app',
    account: ph,
    code: code.trim(),
  });
  if (!verified.ok || typeof verified.resetToken !== 'string') return verified;

  const reset = await recoveryRequest('/api/recovery/reset', {
    scope: 'app',
    account: ph,
    resetToken: verified.resetToken,
    newPassword,
  });
  if (!reset.ok) return reset;

  const list = store.get<Account[]>(KEY, []);
  const index = list.findIndex((account) => account.phone === ph);
  if (index < 0) return { ok: false, msg: '当前设备上的账号已不存在' };
  const salt = randomSalt();
  list[index] = { ...list[index], salt, hash: await hashPassword(newPassword, salt) };
  store.set(KEY, list);
  localStorage.removeItem('moran_token');
  notifyAuthChanged();
  return { ok: true, msg: '密码已重置，请使用新密码登录' };
}

export async function deleteAccount(
  phone: string,
  password: string,
): Promise<{ ok: boolean; msg: string; cloudPending?: boolean }> {
  const ph = phone.trim();
  const list = store.get<Account[]>(KEY, []);
  const account = list.find((item) => item.phone === ph);
  if (!account) return { ok: false, msg: '当前账号不在本机，请重新登录后再试' };
  const hash = await hashPassword(password, account.salt);
  if (hash !== account.hash) return { ok: false, msg: '密码不正确' };
  const cloud = await cloudDeleteAccount(password);
  store.clearAll();
  localStorage.removeItem('moran_token');
  notifyAuthChanged();
  return {
    ok: true,
    msg: cloud.cloudPending ? '本机账号与学习数据已删除，云端删除待联网确认' : '账号与数据已删除',
    cloudPending: cloud.cloudPending,
  };
}
