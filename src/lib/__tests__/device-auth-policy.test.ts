import { describe, expect, it } from 'vitest';
import { isDeviceAuthorizationEnabled } from '../device-auth-policy';

describe('device authorization policy', () => {
  it('is disabled by default', () => {
    expect(isDeviceAuthorizationEnabled(undefined, false)).toBe(false);
    expect(isDeviceAuthorizationEnabled('', false)).toBe(false);
    expect(isDeviceAuthorizationEnabled('false', false)).toBe(false);
  });

  it('can be enabled explicitly', () => {
    expect(isDeviceAuthorizationEnabled('true', false)).toBe(true);
    expect(isDeviceAuthorizationEnabled('enabled', false)).toBe(true);
    expect(isDeviceAuthorizationEnabled(true, false)).toBe(true);
  });

  it('stays disabled in public store builds', () => {
    expect(isDeviceAuthorizationEnabled('true', true)).toBe(false);
  });
});
