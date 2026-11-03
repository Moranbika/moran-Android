import type { ContentBundle } from '@/context/content-context';

const API_BASE = __MORAN_CONTENT_API_BASE__;
export const contentApiEnabled = Boolean(API_BASE);

export type LatestContentResponse =
  | { unchanged: true; version: number }
  | {
      unchanged: false;
      version: number;
      publishedAt: number;
      note: string;
      content: ContentBundle;
    };

export function buildLatestContentRequest(
  apiBase: string,
  cachedVersion: number,
  requestNonce = Date.now(),
): { url: string; init: RequestInit } {
  const query = new URLSearchParams();
  if (cachedVersion > 0) query.set('since', String(cachedVersion));
  query.set('_', String(requestNonce));
  return {
    url: `${apiBase}/api/content/latest?${query.toString()}`,
    init: {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    },
  };
}

export async function fetchLatestContent(
  cachedVersion: number,
  signal?: AbortSignal,
): Promise<LatestContentResponse | null> {
  if (!API_BASE) return null;
  const request = buildLatestContentRequest(API_BASE, cachedVersion);
  const response = await fetch(request.url, {
    ...request.init,
    signal,
  });
  if (!response.ok) throw new Error(`内容服务返回 ${response.status}`);
  return response.json() as Promise<LatestContentResponse>;
}
