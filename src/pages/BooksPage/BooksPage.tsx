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
    <div className="mx-auto max-w-3xl space-y-6 pt-8 animate-page-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h1 className="screen-title">{t('选词 · 词书库')}</h1>
          <p className="screen-lead mt-2">
            {t('按阶段划分词书，覆盖小学到考研、英专、新概念')}
          </p>
        </div>
        <div className="flex w-fit items-baseline gap-2 rounded-full bg-white/36 px-4 py-2 text-sm text-muted-foreground">
          <span className="text-xs">{t('每日学习量')}</span>
          <span className="text-xl font-semibold leading-none tabular-nums text-primary">{settings.dailyTarget}</span>
          <span className="text-xs">{t('词/天')}</span>
        </div>
      </div>

      <div className="glass flex flex-col gap-2 rounded-2xl p-3 sm:flex-row sm:items-center sm:gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/28 px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('搜索词书或阶段')}
            aria-label={t('搜索词书')}
            className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
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

      <div className="apple-segmented stage-filter-row overflow-x-auto" role="tablist" aria-label={t('按学习阶段筛选词书')}>
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

      <div className="glass grid grid-cols-2 gap-x-5 gap-y-2 rounded-2xl px-5 py-3 text-sm sm:flex sm:items-center sm:gap-6">
        <span className="whitespace-nowrap text-muted-foreground">
          {t('待复习 {n}', { n: summary.dueToday })}
          <span className="mx-0.5 text-muted-foreground">/</span>
          {currentWords.length || (currentBook?.wordCount ?? 0)}
        </span>
        <span className="whitespace-nowrap text-muted-foreground">
          {t('待新学 {n}', { n: summary.newCount })}
        </span>
        {currentBook && (
          <span className="col-span-2 truncate text-xs text-muted-foreground sm:ml-auto sm:col-span-1">
            {t('当前：{name}', { name: t(currentBook.name) })}
          </span>
        )}
      </div>

      <div>
        <p className="flex items-center gap-2 text-base font-semibold">
          <Layers className="h-4 w-4 text-primary" /> {t('词书目录')}
        </p>

        <div className="mt-4 space-y-6">
          {filteredGroups.length === 0 && (
            <p className="rounded-2xl border border-white/60 bg-white/30 px-5 py-8 text-center text-sm text-muted-foreground">
              {t('没有匹配的词书，换个关键词或阶段试试。')}
            </p>
          )}
          {filteredGroups.map((g) => {
            const stageTotal = g.books.reduce((s, b) => s + bookTotal(b), 0);
            return (
              <div key={g.stage}>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  {t(g.stage)}
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">{t('{n} 词', { n: stageTotal })}</span>
                </p>
                <div className="space-y-1.5">
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
                          'relative flex w-full items-center gap-3 overflow-hidden rounded-xl border bg-white/34 px-3 py-3 text-left transition-colors duration-200',
                          active
                            ? 'border-primary/55 bg-primary/8'
                            : 'border-white/70 hover:border-primary/35 hover:bg-white/54',
                        )}
                      >
                        {/* 进度渐变背景：从左到右填充 */}
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/15 to-primary/5 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                          <BookOpen className={cn('h-4 w-4', active ? 'text-primary' : 'text-muted-foreground')} />
                        </span>
                        <div className="relative min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{t(b.name)}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {b.desc
                              ? (language === 'en' && t(b.desc) === b.desc ? t('内置教材词表') : t(b.desc))
                              : (b.builtin ? t('已内置 {n} 词', { n: total }) : t('{n} 词', { n: total }))}
                          </p>
                        </div>
                        <div className="relative shrink-0 text-right">
                          <p className="text-xs tabular-nums text-muted-foreground">
                            {learned}/{total}
                          </p>
                          <p className="text-xs font-semibold tabular-nums text-primary">{pct}%</p>
                        </div>
                        <ChevronRight className="relative h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {t('当前内置 32 本词书。点击词书可查看按单元划分的单词列表。')}
      </p>
    </div>
  );
}
