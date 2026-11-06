import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const books = JSON.parse(await readFile(resolve(root, 'src/data/maimemo-books.json'), 'utf8'));
const coreWords = JSON.parse(await readFile(resolve(root, 'src/data/maimemo-core.json'), 'utf8'));
const content = { schemaVersion: 4, books, coreWords };

await writeFile(
  resolve(root, 'server/content-seed.json'),
  `${JSON.stringify(content, null, 2)}\n`,
  'utf8',
);

const wordCount = books.reduce(
  (total, book) => total + (book.units || []).reduce((sum, unit) => sum + (unit.words || []).length, 0),
  0,
);
console.log(`Wrote server/content-seed.json with ${books.length} books and ${wordCount} words`);
