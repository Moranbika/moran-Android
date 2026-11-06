import { describe, expect, it } from 'vitest';
import { DEFAULT_BOOK_ID, VOCAB_BOOKS, bookWords } from '../books';

describe('词书数据', () => {
  it('恢复原词书，只保留单词与中文释义', () => {
    const words = VOCAB_BOOKS.flatMap(bookWords);

    expect(DEFAULT_BOOK_ID).toBe('core');
    expect(VOCAB_BOOKS).toHaveLength(32);
    expect(words).toHaveLength(3588);
    expect(words.every((word) => word.word && word.definition)).toBe(true);
    expect(words.every((word) => !word.phonetic && !word.pos && !word.example && !word.exampleZh)).toBe(true);
    expect(new Set(words.map((word) => word.id)).size).toBe(words.length);
  });
});
