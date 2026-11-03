import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import {
  ContentContext,
  isContentBundle,
  type ContentBundle,
  type ContentContextValue,
  type ContentSource,
} from '@/context/content-context';
import { VOCAB_BOOKS } from '@/data/books';
import { VOCAB_WORDS } from '@/data/words';
import { LISTENING_SETS } from '@/data/listening';
import { EXAM_SETS } from '@/data/practice';
import { readCachedContent, writeCachedContent } from '@/lib/content-cache';
import {
  contentApiEnabled,
  fetchLatestContent,
  type LatestContentResponse,
} from '@/lib/content-api';

const BUNDLED_CONTENT: ContentBundle = {
  schemaVersion: 1,
  books: VOCAB_BOOKS,
  coreWords: VOCAB_WORDS,
  listeningSets: LISTENING_SETS,
  examSets: EXAM_SETS,
};

export default function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentBundle>(BUNDLED_CONTENT);
  const [version, setVersion] = useState(0);
  const [source, setSource] = useState<ContentSource>('bundled');
  const [status, setStatus] = useState<ContentContextValue['status']>('checking');
  const [releaseNote, setReleaseNote] = useState('');
  const [publishedAt, setPublishedAt] = useState(0);
  const versionRef = useRef(0);
  const refreshPromiseRef = useRef<Promise<{
    updated: boolean;
    version: number;
    status: ContentContextValue['status'];
  }> | null>(null);
  const lastCheckedAtRef = useRef(0);

  const refresh = useCallback((onProgress?: (progress: number) => void, options?: {
    notify?: boolean;
  }): Promise<{
    updated: boolean;
    version: number;
    status: ContentContextValue['status'];
  }> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }
    const promise = (async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 30000);
      const report = (value: number) => onProgress?.(Math.max(0, Math.min(100, Math.round(value))));
      setStatus('checking');
      try {
        report(8);
        const cached = await readCachedContent();
        report(30);
        const cachedContent = cached && isContentBundle(cached.content) ? cached : null;
        if (cachedContent && cachedContent.version > versionRef.current) {
          setContent(cachedContent.content);
          setVersion(cachedContent.version);
          versionRef.current = cachedContent.version;
          setSource('cache');
          setReleaseNote(cachedContent.note || '');
          setPublishedAt(cachedContent.publishedAt || 0);
        }
        const baseVersion = Math.max(versionRef.current, cachedContent?.version ?? 0);
        let latest: LatestContentResponse | null;
        try {
          latest = await fetchLatestContent(baseVersion, controller.signal);
        } catch (error) {
          if (controller.signal.aborted) throw error;
          await new Promise((resolve) => window.setTimeout(resolve, 650));
          latest = await fetchLatestContent(baseVersion, controller.signal);
        }
        report(72);
        if (!latest) {
          const nextStatus: ContentContextValue['status'] = contentApiEnabled ? 'offline' : 'idle';
          setStatus(nextStatus);
          report(100);
          return { updated: false, version: baseVersion, status: nextStatus };
        }
        if (!('content' in latest)) {
          setStatus('current');
          lastCheckedAtRef.current = Date.now();
          report(100);
          return { updated: false, version: latest.version, status: 'current' as const };
        }
        if (!isContentBundle(latest.content)) {
          throw new Error('内容版本格式不正确');
        }
        setContent(latest.content);
        setVersion(latest.version);
        versionRef.current = latest.version;
        setSource('remote');
        setReleaseNote(latest.note || '');
        setPublishedAt(latest.publishedAt || 0);
        await writeCachedContent({
          version: latest.version,
          publishedAt: latest.publishedAt,
          note: latest.note,
          content: latest.content,
        });
        setStatus('current');
        lastCheckedAtRef.current = Date.now();
        report(100);
        if (options?.notify !== false) {
          toast.success(`内容已更新 · Content updated (v${latest.version})`);
        }
        return { updated: true, version: latest.version, status: 'current' as const };
      } catch {
        setStatus('offline');
        report(100);
        return { updated: false, version: versionRef.current, status: 'offline' as const };
      } finally {
        window.clearTimeout(timeout);
      }
    })();
    refreshPromiseRef.current = promise;
    void promise.finally(() => {
      if (refreshPromiseRef.current === promise) refreshPromiseRef.current = null;
    });
    return promise;
  }, []);

  useEffect(() => {
    void refresh();
    const checkWhenVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastCheckedAtRef.current > 60_000) {
        void refresh();
      }
    };
    const timer = window.setInterval(checkWhenVisible, 60_000);
    window.addEventListener('focus', checkWhenVisible);
    document.addEventListener('visibilitychange', checkWhenVisible);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', checkWhenVisible);
      document.removeEventListener('visibilitychange', checkWhenVisible);
    };
  }, [refresh]);

  const value = useMemo(() => ({
    content,
    version,
    source,
    status,
    releaseNote,
    publishedAt,
    remoteEnabled: contentApiEnabled,
    refresh,
  }), [content, publishedAt, refresh, releaseNote, source, status, version]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
