import { createContext, useContext } from 'react';
import type { IVocabWord } from '@/data/words';
import type { VocabBook } from '@/data/books';

export interface ContentBundle {
  schemaVersion: 4;
  books: VocabBook[];
  coreWords: IVocabWord[];
}

export type ContentSource = 'bundled' | 'cache' | 'remote';
export type ContentRefreshOutcome = 'updated' | 'current' | 'offline' | 'disabled';

export interface ContentContextValue {
  content: ContentBundle;
  version: number;
  source: ContentSource;
  status: 'idle' | 'checking' | 'current' | 'offline';
  releaseNote: string;
  publishedAt: number;
  remoteEnabled: boolean;
  refresh: (onProgress?: (progress: number) => void, options?: { notify?: boolean }) => Promise<{
    updated: boolean;
    version: number;
    status: ContentContextValue['status'];
  }>;
}

export const ContentContext = createContext<ContentContextValue | null>(null);

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
}

export function isContentBundle(value: unknown): value is ContentBundle {
  if (!value || typeof value !== 'object') return false;
  const bundle = value as Partial<ContentBundle>;
  return bundle.schemaVersion === 4
    && Array.isArray(bundle.books)
    && Array.isArray(bundle.coreWords)
    && bundle.books.every((book) => (
      typeof book?.id === 'string'
      && typeof book?.name === 'string'
      && Array.isArray(book?.units)
    ))
    && bundle.coreWords.every((word) => typeof word?.id === 'string' && typeof word?.word === 'string');
}

export function contentRefreshOutcome(
  result: { updated: boolean; status: ContentContextValue['status'] },
): ContentRefreshOutcome {
  if (result.status === 'offline') return 'offline';
  if (result.status === 'idle') return 'disabled';
  return result.updated ? 'updated' : 'current';
}
