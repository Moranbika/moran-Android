import type { ContentBundle } from '@/context/content-context';

const DB_NAME = 'moran-content';
const STORE_NAME = 'releases';
const CACHE_KEY = 'latest';

export interface CachedContentRelease {
  version: number;
  publishedAt: number;
  note: string;
  content: ContentBundle;
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

export async function readCachedContent(): Promise<CachedContentRelease | null> {
  const database = await openDatabase();
  if (!database) return null;
  return new Promise((resolve) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(CACHE_KEY);
    request.onsuccess = () => resolve((request.result as CachedContentRelease | undefined) ?? null);
    request.onerror = () => resolve(null);
    transaction.oncomplete = () => database.close();
  });
}

export async function writeCachedContent(release: CachedContentRelease): Promise<void> {
  const database = await openDatabase();
  if (!database) return;
  await new Promise<void>((resolve) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(release, CACHE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => resolve();
    transaction.onabort = () => resolve();
  });
  database.close();
}
