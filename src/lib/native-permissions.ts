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

function callHarmony(
  method: 'requestCalendar' | 'addReminder' | 'removeReminder',
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
