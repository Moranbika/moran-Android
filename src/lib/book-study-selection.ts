import type { IVocabWord } from '@/data/words';

export const BOOK_SELECTION_STORAGE_KEY = 'book-selected-words';

export function readBookSelection(bookId: string, validWordIds: string[]): string[] {
  try {
    const raw = localStorage.getItem(`${BOOK_SELECTION_STORAGE_KEY}-${bookId}`);
    if (!raw) return [];
    const validIds = new Set(validWordIds);
    const selected = JSON.parse(raw) as unknown;
    return Array.isArray(selected)
      ? [...new Set(selected.filter((id): id is string => typeof id === 'string' && validIds.has(id)))]
      : [];
  } catch {
    return [];
  }
}

export function filterSelectedWords(words: IVocabWord[], selectedIds: string[]): IVocabWord[] {
  const selected = new Set(selectedIds);
  return words.filter((word) => selected.has(word.id));
}
