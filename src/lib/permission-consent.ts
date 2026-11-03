import type { PermissionOutcome } from '@/lib/native-permissions';

export const PERMISSION_CONSENT_KEY = 'cet6-practice:permission-consent-v2';
export const PERMISSION_CHANGED_EVENT = 'moran:permissions-changed';
export const PERMISSION_OPEN_EVENT = 'moran:open-permissions';

export type PermissionStepKey = 'network' | 'storage' | 'calendar' | 'notifications';

export interface PermissionConsentRecord {
  done: boolean;
  results: Partial<Record<PermissionStepKey, PermissionOutcome | 'accepted'>>;
}

export function readPermissionConsent(): PermissionConsentRecord | null {
  try {
    const raw = localStorage.getItem(PERMISSION_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PermissionConsentRecord;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function writePermissionConsent(record: PermissionConsentRecord): void {
  try {
    localStorage.setItem(PERMISSION_CONSENT_KEY, JSON.stringify(record));
  } catch {
    // Consent still applies for this session.
  }
}

export function calendarPermissionGranted(): boolean {
  return readPermissionConsent()?.results.calendar === 'granted';
}

export function notifyPermissionChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(PERMISSION_CHANGED_EVENT));
}
