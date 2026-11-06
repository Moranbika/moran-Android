// EXPORTS: VocabBook, BOOK_STAGES, VOCAB_BOOKS, DEFAULT_BOOK_ID,
// groupBooksByStage, bookWords

import rawBooks from './maimemo-books.json';
import type { IVocabWord } from './words';

export interface BookUnit {
  id: string;
  title: string;
  words: IVocabWord[];
}

export interface VocabBook {
  id: string;
  name: string;
  stage: string;
  wordCount: number;
  builtin: boolean;
  desc?: string;
  units?: BookUnit[];
}

export const VOCAB_BOOKS = rawBooks as VocabBook[];
export const BOOK_STAGES = [...new Set(VOCAB_BOOKS.map((book) => book.stage))];

export function groupBooksByStage(
  books: VocabBook[] = VOCAB_BOOKS,
  stages: string[] = BOOK_STAGES,
): Array<{ stage: string; books: VocabBook[] }> {
  return stages
    .map((stage) => ({ stage, books: books.filter((book) => book.stage === stage) }))
    .filter((group) => group.books.length > 0);
}

export function bookWords(book: VocabBook): IVocabWord[] {
  return book.units?.flatMap((unit) => unit.words) ?? [];
}

export const DEFAULT_BOOK_ID = 'core';
