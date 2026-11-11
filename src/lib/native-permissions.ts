import { Capacitor, registerPlugin } from '@capacitor/core';

export type PermissionOutcome = 'granted' | 'denied' | 'unavailable';

export interface CalendarReminderInput {
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
}

interface MoranHarmonyBridge {
  getId: () => string;
  requestCalendar: (callbackId: string) => void;
  addReminder: (
    callbackId: string,
    title: string,
    description: string,
    startTime: number,
    endTime: number,
  ) => void;
  removeReminder: (callbackId: string, eventId: string) => void;
  iapEnvironment?: (callbackId: string) => void;
  iapQueryProducts?: (callbackId: string, productType: string, productIdsJson: string) => void;
  iapPurchase?: (
    callbackId: string,
    productId: string,
    productType: string,
    developerPayload: string,
  ) => void;
  iapFinish?: (
    callbackId: string,
    productType: string,
    purchaseToken: string,
    purchaseOrderId: string,
  ) => void;
  iapUnfinished?: (callbackId: string, productType: string) => void;
}

interface MoranDeviceCalendarPlugin {
  requestCalendar: () => Promise<{ granted?: boolean }>;
  addCalendarReminder: (options: CalendarReminderInput) => Promise<{ id?: string }>;
  removeCalendarReminder: (options: { id: string }) => Promise<void>;
}

declare global {
  interface Window {
    MoranHarmony?: MoranHarmonyBridge;
    __moranNativeResult?: (callbackId: string, payload: string) => void;
  }
}

const MoranDevice = registerPlugin<MoranDeviceCalendarPlugin>('MoranDevice');
const harmony = () => (typeof window === 'undefined' ? undefined : window.MoranHarmony);
const iosNative = () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';

let sequence = 0;
const pending = new Map<string, (payload: Record<string, unknown>) => void>();

function ensureNativeCallback() {
  if (typeof window === 'undefined' || window.__moranNativeResult) return;
  window.__moranNativeResult = (callbackId: string, payload: string) => {
    const resolve = pending.get(callbackId);
    if (!resolve) return;
    pending.delete(callbackId);
    try {
      resolve(JSON.parse(payload) as Record<string, unknown>);
    } catch {
      resolve({ ok: false });
    }
  };
}

type HarmonyMethod =
  | 'requestCalendar'
  | 'addReminder'
  | 'removeReminder'
  | 'iapEnvironment'
  | 'iapQueryProducts'
  | 'iapPurchase'
  | 'iapFinish'
  | 'iapUnfinished';

function callHarmony(
  method: HarmonyMethod,
  args: Array<string | number>,
): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    const bridge = harmony();
    if (!bridge) {
      resolve({ ok: false, error: 'unavailable' });
      return;
    }
    ensureNativeCallback();
    const callbackId = `moran_${Date.now()}_${sequence += 1}`;
    pending.set(callbackId, resolve);
    try {
      (bridge[method] as (...values: Array<string | number>) => void)(callbackId, ...args);
    } catch {
      pending.delete(callbackId);
      resolve({ ok: false, error: 'bridge' });
      return;
    }
    window.setTimeout(() => {
      if (pending.delete(callbackId)) resolve({ ok: false, error: 'timeout' });
    }, 30_000);
  });
}

export type IapProductType = 'consumable' | 'nonconsumable' | 'autorenewable' | 'nonrenewable';

export interface IapProductInfo {
  productId: string;
  name?: string;
  description?: string;
  price?: string;
  productType?: string;
  [key: string]: unknown;
}

export interface IapPurchaseOutcome {
  ok: boolean;
  code?: number;
  message?: string;
  purchaseData?: string;
  order?: Record<string, unknown>;
}

function decodeJwsPayload(jws: string): Record<string, unknown> | null {
  const parts = jws.split('.');
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function iapSupported(): boolean {
  return Boolean(harmony()?.iapPurchase);
}

export async function iapEnvironmentStatus(): Promise<{ ok: boolean; code?: number; message?: string }> {
  const result = await callHarmony('iapEnvironment', []);
  return {
    ok: Boolean(result.ok),
    code: result.code == null ? undefined : Number(result.code),
    message: result.message == null ? undefined : String(result.message),
  };
}

export async function queryIapProducts(
  productType: IapProductType,
  productIds: string[],
): Promise<{ ok: boolean; products: IapProductInfo[]; message?: string }> {
  const result = await callHarmony('iapQueryProducts', [productType, JSON.stringify(productIds)]);
  if (!result.ok) {
    return { ok: false, products: [], message: String(result.message || result.error || '查询商品失败') };
  }
  try {
    const list = JSON.parse(String(result.data || '[]')) as IapProductInfo[];
    return { ok: true, products: Array.isArray(list) ? list : [] };
  } catch {
    return { ok: false, products: [], message: '商品数据解析失败' };
  }
}

export async function purchaseIapProduct(
  productId: string,
  productType: IapProductType,
  developerPayload = '',
): Promise<IapPurchaseOutcome> {
  const result = await callHarmony('iapPurchase', [productId, productType, developerPayload]);
  if (!result.ok) {
    return {
      ok: false,
      code: result.code == null ? undefined : Number(result.code),
      message: String(result.message || result.error || '发起支付失败'),
    };
  }
  // 桥接返回的是 CreatePurchaseResult 的 JSON，真正的签名凭证在 jwsPurchaseOrder 里。
  // 服务端验签需要纯 JWS（三段式），所以这里把外层 JSON 剥掉。
  const rawData = String(result.data || '');
  let jws = rawData;
  let order: Record<string, unknown> | undefined;
  if (rawData.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawData) as { jwsPurchaseOrder?: string };
      if (parsed.jwsPurchaseOrder) {
        jws = parsed.jwsPurchaseOrder;
        order = decodeJwsPayload(jws) ?? undefined;
      }
    } catch {
      order = undefined;
    }
  } else {
    order = decodeJwsPayload(jws) ?? undefined;
  }
  return { ok: true, purchaseData: jws, order };
}

export async function finishIapPurchase(
  productType: IapProductType,
  purchaseToken: string,
  purchaseOrderId: string,
): Promise<{ ok: boolean; message?: string }> {
  const result = await callHarmony('iapFinish', [productType, purchaseToken, purchaseOrderId]);
  return { ok: Boolean(result.ok), message: String(result.message || '') };
}

export async function queryUnfinishedPurchases(
  productType: IapProductType,
): Promise<{ ok: boolean; purchaseDataList: string[]; message?: string }> {
  const result = await callHarmony('iapUnfinished', [productType]);
  if (!result.ok) {
    return { ok: false, purchaseDataList: [], message: String(result.message || '') };
  }
  try {
    const list = JSON.parse(String(result.data || '[]')) as string[];
    return { ok: true, purchaseDataList: Array.isArray(list) ? list : [] };
  } catch {
    return { ok: false, purchaseDataList: [], message: '待发货记录解析失败' };
  }
}

export function calendarSupported(): boolean {
  if (harmony()) return true;
  return iosNative();
}

export async function requestCalendarPermission(): Promise<PermissionOutcome> {
  if (harmony()) {
    const result = await callHarmony('requestCalendar', []);
    return result.granted ? 'granted' : 'denied';
  }
  if (iosNative()) {
    try {
      const result = await MoranDevice.requestCalendar();
      return result.granted ? 'granted' : 'denied';
    } catch {
      return 'unavailable';
    }
  }
  return 'unavailable';
}

export async function scheduleCalendarReminder(input: CalendarReminderInput): Promise<string | null> {
  if (harmony()) {
    const result = await callHarmony('addReminder', [
      input.title,
      input.description || '',
      input.startTime,
      input.endTime,
    ]);
    return result.ok && result.id != null ? String(result.id) : null;
  }
  if (iosNative()) {
    try {
      const result = await MoranDevice.addCalendarReminder(input);
      return result.id || null;
    } catch {
      return null;
    }
  }
  return null;
}

export async function removeCalendarReminder(eventId: string): Promise<void> {
  if (!eventId) return;
  if (harmony()) {
    await callHarmony('removeReminder', [eventId]);
    return;
  }
  if (iosNative()) {
    try {
      await MoranDevice.removeCalendarReminder({ id: eventId });
    } catch {
      // The event may already be gone.
    }
  }
}

export async function requestNotificationPermission(): Promise<PermissionOutcome> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unavailable';
  try {
    const result = await Notification.requestPermission();
    return result === 'granted' ? 'granted' : 'denied';
  } catch {
    return 'unavailable';
  }
}
