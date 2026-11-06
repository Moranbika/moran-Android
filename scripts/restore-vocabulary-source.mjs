import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const legacyPath = process.env.MORAN_LEGACY_CONTENT
  || 'D:\\English prepare\\_backup_content_20261031\\server__content-seed.json';
const legacy = JSON.parse(readFileSync(legacyPath, 'utf8'));

function cleanWord(word, fallbackCategory, fallbackId, preserveSourceId = true) {
  return {
    id: String(preserveSourceId ? word?.id || fallbackId : fallbackId),
    word: String(word?.word || '').trim(),
    definition: String(word?.definition || '').trim(),
    category: String(word?.category || fallbackCategory || '词书词汇').trim(),
    phonetic: '',
    pos: '',
    example: '',
    exampleZh: '',
  };
}

function cleanBook(book) {
  let wordIndex = 0;
  const units = (book.units || []).map((unit, unitIndex) => ({
    id: String(unit.id || `${book.id}-u${unitIndex + 1}`),
    title: String(unit.title || `Unit ${unitIndex + 1}`),
    words: (unit.words || [])
      .map((word) => cleanWord(word, book.stage, `${book.id}-w${wordIndex += 1}`, false))
      .filter((word) => word.word && word.definition),
  })).filter((unit) => unit.words.length > 0);
  const wordCount = units.reduce((total, unit) => total + unit.words.length, 0);
  return {
    id: String(book.id),
    name: String(book.name),
    stage: String(book.stage || '其他'),
    wordCount,
    builtin: true,
    desc: `${wordCount} 词 · 单词与释义`,
    units,
  };
}

const coreWords = (legacy.coreWords || [])
  .map((word, index) => cleanWord(word, '核心词汇', `core-w${index + 1}`))
  .filter((word) => word.word && word.definition);
const coreBook = {
  id: 'core',
  name: '英语核心词汇',
  stage: '通用',
  wordCount: coreWords.length,
  builtin: true,
  desc: `${coreWords.length} 词 · 单词与释义`,
  units: Array.from({ length: Math.ceil(coreWords.length / 50) }, (_, index) => ({
    id: `core-u${index + 1}`,
    title: `Unit ${index + 1}`,
    words: coreWords.slice(index * 50, (index + 1) * 50),
  })),
};
const restoredBooks = (legacy.books || [])
  .map(cleanBook)
  .filter((book) => book.units.length > 0);
const books = [coreBook, ...restoredBooks];
const content = { schemaVersion: 4, books, coreWords };

mkdirSync(path.join(root, 'src', 'data'), { recursive: true });
mkdirSync(path.join(root, 'server'), { recursive: true });
writeFileSync(
  path.join(root, 'src', 'data', 'maimemo-books.json'),
  `${JSON.stringify(books, null, 2)}\n`,
  'utf8',
);
writeFileSync(
  path.join(root, 'src', 'data', 'maimemo-core.json'),
  `${JSON.stringify(coreWords, null, 2)}\n`,
  'utf8',
);
writeFileSync(
  path.join(root, 'server', 'content-seed.json'),
  `${JSON.stringify(content, null, 2)}\n`,
  'utf8',
);

const bookWords = restoredBooks.reduce((total, book) => total + book.wordCount, 0);
console.log(`Restored ${restoredBooks.length} wordbooks, ${bookWords} book words and ${coreWords.length} core words.`);
