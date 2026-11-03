// EXPORTS: readPrivacyConsent, writePrivacyConsent, hasCurrentPrivacyConsent
// 记录用户对隐私政策与用户协议的主动同意，版本变化后需要重新确认。

import { store } from '@/lib/store';

export const PRIVACY_CONSENT_VERSION = '2026-11-02';
const KEY = 'privacy-consent';

export interface PrivacyConsentRecord {
  version: string;
  acceptedAt: number;
}

export function readPrivacyConsent(): PrivacyConsentRecord | null {
  const record = store.get<PrivacyConsentRecord | null>(KEY, null);
  if (!record || record.version !== PRIVACY_CONSENT_VERSION) return null;
  return record;
}

export function hasCurrentPrivacyConsent(): boolean {
  return Boolean(readPrivacyConsent());
}

export function writePrivacyConsent(): PrivacyConsentRecord {
  const record: PrivacyConsentRecord = {
    version: PRIVACY_CONSENT_VERSION,
    acceptedAt: Date.now(),
  };
  store.set(KEY, record);
  return record;
}
