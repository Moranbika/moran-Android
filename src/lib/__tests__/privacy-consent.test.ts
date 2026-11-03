import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PRIVACY_CONSENT_VERSION,
  hasCurrentPrivacyConsent,
  readPrivacyConsent,
  writePrivacyConsent,
} from '../privacy-consent';

const data = new Map<string, string>();

vi.stubGlobal('localStorage', {
  get length() {
    return data.size;
  },
  getItem: (key: string) => data.get(key) ?? null,
  setItem: (key: string, value: string) => {
    data.set(key, value);
  },
  removeItem: (key: string) => {
    data.delete(key);
  },
  key: (index: number) => Array.from(data.keys())[index] ?? null,
  clear: () => data.clear(),
});

describe('privacy consent', () => {
  beforeEach(() => data.clear());

  it('requires consent before any record exists', () => {
    expect(hasCurrentPrivacyConsent()).toBe(false);
    expect(readPrivacyConsent()).toBeNull();
  });

  it('records the current policy version after explicit consent', () => {
    const record = writePrivacyConsent();
    expect(record.version).toBe(PRIVACY_CONSENT_VERSION);
    expect(hasCurrentPrivacyConsent()).toBe(true);
    expect(readPrivacyConsent()?.acceptedAt).toBe(record.acceptedAt);
  });

  it('asks for consent again after the policy version changes', () => {
    localStorage.setItem(
      'cet6-practice:privacy-consent',
      JSON.stringify({ version: '2026-10-28', acceptedAt: Date.now() }),
    );
    expect(hasCurrentPrivacyConsent()).toBe(false);
  });
});
