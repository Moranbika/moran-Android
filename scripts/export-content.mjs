import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

const root = path.resolve(import.meta.dirname, '..');
const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const [books, words] = await Promise.all([
    vite.ssrLoadModule('/src/data/books.ts'),
    vite.ssrLoadModule('/src/data/words.ts'),
  ]);
  const content = {
    schemaVersion: 4,
    books: books.VOCAB_BOOKS.map((book) => ({
      ...book,
      units: book.units ?? [],
    })),
    coreWords: words.VOCAB_WORDS,
  };
  const json = `${JSON.stringify(content, null, 2)}\n`;
  mkdirSync(path.join(root, 'server'), { recursive: true });
  writeFileSync(path.join(root, 'server', 'content-seed.json'), json);
  console.log(`Content seed exported: ${Buffer.byteLength(json)} bytes`);
} finally {
  await vite.close();
}
