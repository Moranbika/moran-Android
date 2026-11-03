import { describe, expect, it } from 'vitest';
import { VOCAB_BOOKS, bookWords } from '../books';

describe('词书数据', () => {
  it('把元组短语和额外例句规范化为对象', () => {
    const word = VOCAB_BOOKS.flatMap(bookWords).find((item) => item.id === 's1u5-6');

    expect(word?.phrases?.[0]).toEqual({ en: 'specific to...', zh: '为……所特有' });
    expect(word?.extraExamples?.every((item) => !Array.isArray(item))).toBe(true);
  });
});
