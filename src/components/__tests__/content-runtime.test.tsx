import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ContentProvider from '@/components/ContentProvider';
import { isContentBundle, useContent } from '@/context/content-context';

function CountsProbe() {
  const { content, version, source } = useContent();
  return (
    <span>
      {content.books.length}:{content.coreWords.length}:{content.listeningSets.length}:
      {content.examSets.length}:{version}:{source}
    </span>
  );
}

describe('content runtime', () => {
  it('starts with the bundled content when no remote version is active', () => {
    const html = renderToStaticMarkup(
      <ContentProvider>
        <CountsProbe />
      </ContentProvider>,
    );
    expect(html).toContain('32:150:3:2:0:bundled');
  });

  it('rejects malformed remote content', () => {
    expect(isContentBundle(null)).toBe(false);
    expect(isContentBundle({ schemaVersion: 1, books: [] })).toBe(false);
  });
});

