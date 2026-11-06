// EXPORTS: IVocabWord, VOCAB_WORDS, WORD_CATEGORIES
// Bundled vocabulary contains only words and Chinese definitions.

import rawWords from './maimemo-core.json';

export interface IVocabWord {
  id: string;
  word: string;
  phonetic: string;
  pos: string;
  definition: string;
  example: string;
  exampleZh?: string;
  category: string;
  phrases?: { en: string; zh: string }[];
  mnemonic?: string;
  extraExamples?: { en: string; zh: string }[];
  senses?: { pos: string; zh: string }[];
  forms?: { label: string; value: string }[];
}

export const WORD_CATEGORIES = [
  '核心词汇',
  '行为与动作',
  '品质与状态',
] as const;

export const VOCAB_WORDS = rawWords as IVocabWord[];
