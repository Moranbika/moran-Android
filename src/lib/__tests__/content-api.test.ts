import { describe, expect, it } from 'vitest';
import { buildLatestContentRequest } from '@/lib/content-api';
import { contentRefreshOutcome } from '@/context/content-context';

describe('content refresh requests', () => {
  it('bypasses HTTP caches and includes a fresh nonce', () => {
    const request = buildLatestContentRequest('https://moranenglish.cn', 12, 345);

    expect(request.url).toBe('https://moranenglish.cn/api/content/latest?since=12&_=345');
    expect(request.init.cache).toBe('no-store');
    expect(request.init.headers).toEqual({ Accept: 'application/json' });
  });

  it('omits since for a first download but still bypasses caches', () => {
    const request = buildLatestContentRequest('https://moranenglish.cn', 0, 789);

    expect(request.url).toBe('https://moranenglish.cn/api/content/latest?_=789');
    expect(request.init.cache).toBe('no-store');
  });

  it('reports the actual pull-to-refresh outcome', () => {
    expect(contentRefreshOutcome({ updated: true, status: 'current' })).toBe('updated');
    expect(contentRefreshOutcome({ updated: false, status: 'current' })).toBe('current');
    expect(contentRefreshOutcome({ updated: false, status: 'offline' })).toBe('offline');
    expect(contentRefreshOutcome({ updated: false, status: 'idle' })).toBe('disabled');
  });
});
