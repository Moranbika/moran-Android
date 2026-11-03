import { describe, expect, it } from 'vitest';
import { maskAccountId } from '../account-display';

describe('account display', () => {
  it('masks an 11-digit phone number', () => {
    expect(maskAccountId('13327444108')).toBe('133****4108');
  });

  it('masks the local part of an email address', () => {
    expect(maskAccountId('moran@example.com')).toBe('mo***@example.com');
  });

  it('leaves short account labels unchanged', () => {
    expect(maskAccountId('本机账号')).toBe('本机账号');
    expect(maskAccountId()).toBe('');
  });
});
