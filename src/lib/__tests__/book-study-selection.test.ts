import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BOOK_SELECTION_STORAGE_KEY, filterSelectedWords, readBookSelection } from '@/lib/book-study-selection';
import { buildStudyQueue } from '@/lib/memory';
import type { IVocabWord } from '@/data/words';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
});

describe('book word selection', () => {
  it('queues only the five selected words', () => {
    const words = Array.from({ length: 12 }, (_, index) => ({ id: `w${index}` }) as IVocabWord);
    const selected = words.slice(2, 7).map((word) => word.id);
    const queue = buildStudyQueue({}, filterSelectedWords(words, selected).map((word) => word.id), 5);

    expect(queue.newWords).toEqual(selected);
    expect(queue.dueWords).toEqual([]);
  });

  it('keeps each book selection separate and rejects ids outside that book', () => {
    localStorage.setItem(`${BOOK_SELECTION_STORAGE_KEY}-book-a`, JSON.stringify(['a1', 'b1', 'a1']));
    localStorage.setItem(`${BOOK_SELECTION_STORAGE_KEY}-book-b`, JSON.stringify(['b1']));

    expect(readBookSelection('book-a', ['a1', 'a2'])).toEqual(['a1']);
    expect(readBookSelection('book-b', ['b1', 'b2'])).toEqual(['b1']);
  });

  it('does not fall back to the full book when nothing is selected', () => {
    const words = [{ id: 'a1' }, { id: 'a2' }] as IVocabWord[];
    const queue = buildStudyQueue({}, filterSelectedWords(words, []).map((word) => word.id), 10);

    expect(queue.newWords).toEqual([]);
    expect(queue.dueWords).toEqual([]);
  });
});
