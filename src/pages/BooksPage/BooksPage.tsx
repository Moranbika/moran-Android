// EXPORTS: BooksPage
// 词书库（墨墨式）：按阶段分组，每本书显示学习进度百分比+进度条渐变。

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, ChevronRight, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgress } from '@/context/progress-context';
import { useSettings } from '@/context/settings-context';
import { useContent } from '@/context/content-context';
import { useI18n } from '@/context/i18n-context';
import { groupBooksByStage, bookWords } from '@/data/books';
import type { VocabBook } from '@/data/books';
import { summarizeMemory } from '@/lib/memory';

const MODE_LABELS = ['中英', '英中', '听音'];

const EMPTY_SUMMARY = {
  total: 0,
  newCount: 0,
  learningCount: 0,
  masteredCount: 0,
  dueToday: 0,
  weakIds: [] as string[],
  strongIds: [] as string[],
};

export default function BooksPage() {
  const { t, language } = useI18n();
  const { settings, setSelectedBook, setMemoryMode } = useSettings();
  const { progress } = useProgress();
  const { content } = useContent();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [stage, setStage] = useState('全部');
  const mode = settings.memoryMode;

  const groups = useMemo(() => groupBooksByStage(
    content.books,
    [...new Set(content.books.map((book) => book.stage))],
  ), [content.books]);

  const stages = useMemo(() => ['全部', ...groups.map((group) => group.stage)], [groups]);

  const filteredGroups = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return groups
      .filter((group) => stage === '全部' || group.stage === stage)
      .map((g) => ({ ...g, books: g.books.filter((b) => b.name.toLowerCase().includes(kw)) }))
      .filter((g) => g.books.length > 0);
  }, [groups, keyword, stage]);

  const currentBook = groups
    .flatMap((g) => g.books)
    .find((b) => b.id === settings.selectedBookId);
  const currentWords = useMemo(
    () => (currentBook ? bookWords(currentBook) : []),
    [currentBook],
  );
  const summary = useMemo(
    () =>
      currentWords.length
        ? summarizeMemory(progress.memory, currentWords.map((w) => w.id))
        : EMPTY_SUMMARY,
    [progress.memory, currentWords],
  );

  const bookTotal = (b: VocabBook) => bookWords(b).length || b.wordCount;
  const learnedIn = (b: VocabBook) => {
    const ids = bookWords(b).map((w) => w.id);
    if (!ids.length) return 0;
    let n = 0;
    ids.forEach((id) => {
      if (progress.memory[id] && progress.memory[id].status !== 'new') n += 1;
    });
    return n;
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 pt-4 pb-8 md:pt-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="screen-title">{t('选词 · 词书库')}</h1>
          <p className="screen-lead mt-2">
            {t('按阶段划分词书，覆盖小学到考研、英专、新概念')}
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-white/60 bg-card/58 px-4 py-2 text-xs text-foreground/50 shadow-sm">
          <span>{t('每日学习量')}</span>
          <span className="text-base font-semibold leading-none tabular-nums text-primary">{settings.dailyTarget}</span>
          <span>{t('词/天')}</span>
        </div>
      </header>

      <section className="app-glass rounded-[22px] p-4 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="moran-field flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[13px] border px-3.5">
            <Search className="moran-field-icon h-4 w-4 shrink-0 text-foreground/40" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t('搜索词书或阶段')}
              aria-label={t('搜索词书')}
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <div className="apple-segmented grid shrink-0 grid-cols-3 sm:flex">
            {MODE_LABELS.map((m, i) => (
              <button
                key={m}
                onClick={() => setMemoryMode(i)}
                data-active={mode === i}
                className="apple-segment flex-1"
              >
                {t(m)}
              </button>
            ))}
          </div>
        </div>

        <div className="apple-segmented stage-filter-row mt-3 overflow-x-auto" role="tablist" aria-label={t('按学习阶段筛选词书')}>
          {stages.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={stage === item}
              onClick={() => setStage(item)}
              className="apple-segment shrink-0"
            >
              {t(item)}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-foreground/7 pt-3 text-[11px] text-foreground/48">
          <span>{t('待复习 {n}', { n: summary.dueToday })} / {currentWords.length || (currentBook?.wordCount ?? 0)}</span>
          <span>{t('待新学 {n}', { n: summary.newCount })}</span>
          {currentBook && (
            <span className="truncate sm:ml-auto">
              {t('当前：{name}', { name: t(currentBook.name) })}
            </span>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between px-1">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Layers className="h-4 w-4 text-primary" /> {t('词书目录')}
          </h2>
          <span className="text-[11px] tabular-nums text-foreground/42">{stages.length - 1} {t('个阶段')}</span>
        </div>

        <div className="mt-3 space-y-5">
          {filteredGroups.length === 0 && (
            <p className="app-glass rounded-[18px] px-5 py-8 text-center text-sm text-muted-foreground">
              {t('没有匹配的词书，换个关键词或阶段试试。')}
            </p>
          )}
          {filteredGroups.map((g) => {
            const stageTotal = g.books.reduce((s, b) => s + bookTotal(b), 0);
            return (
              <div key={g.stage}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <p className="text-[11px] font-semibold text-foreground/54">
                    {t(g.stage)}
                  </p>
                  <span className="text-[10px] tabular-nums text-foreground/38">{t('{n} 词', { n: stageTotal })}</span>
                </div>
                <div className="app-glass overflow-hidden rounded-[18px]">
                  {g.books.map((b) => {
                    const active = b.id === settings.selectedBookId;
                    const total = bookTotal(b);
                    const learned = learnedIn(b);
                    const pct = total ? Math.round((learned / total) * 100) : 0;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBook(b);
                          navigate(`/book/${b.id}`);
                        }}
                        className={cn(
                          'relative flex w-full items-center gap-3 overflow-hidden border-b border-foreground/7 px-4 py-3.5 text-left transition-colors duration-200 last:border-b-0',
                          active
                            ? 'bg-primary/7'
                            : 'hover:bg-primary/4',
                        )}
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/4 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                        <span className={cn(
                          'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]',
                          active ? 'bg-primary/10 text-primary' : 'bg-foreground/4 text-foreground/45',
                        )}>
                          <BookOpen className="h-4 w-4" />
                        </span>
                        <div className="relative min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{t(b.name)}</p>
                          <p className="mt-0.5 truncate text-[11px] text-foreground/44">
                            {b.desc
                              ? (language === 'en' && t(b.desc) === b.desc ? t('内置教材词表') : t(b.desc))
                              : (b.builtin ? t('已内置 {n} 词', { n: total }) : t('{n} 词', { n: total }))}
                          </p>
                        </div>
                        <div className="relative w-20 shrink-0">
                          <div className="flex items-center justify-between text-[10px] tabular-nums text-foreground/42">
                            <span>{learned}/{total}</span>
                            <span className={cn('font-semibold', pct > 0 ? 'text-primary' : 'text-foreground/36')}>{pct}%</span>
                          </div>
                          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/7">
                            <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <ChevronRight className="relative h-3.5 w-3.5 shrink-0 text-foreground/28" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-center text-[11px] text-foreground/38">
        {t('当前内置 32 本词书。点击词书可查看按单元划分的单词列表。')}
      </p>
    </div>
  );
}
