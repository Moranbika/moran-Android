// EXPORTS: BookWordsPage
// 单词列表页（仿墨墨）：按单元展示所选词书单词，含未选/已选/全部统计、
// 圆形选择框、★核心标记、顺选/随机、今日待选。

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Star, Check, ListOrdered, ArrowDownAZ, Shuffle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContent } from '@/context/content-context';
import { useI18n } from '@/context/i18n-context';
import { bookWords } from '@/data/books';
import type { IVocabWord } from '@/data/words';

const LS_KEY = 'book-selected-words';
const LS_SORT_KEY = 'book-words-sort';

type SortMode = 'byUnit' | 'alpha' | 'shuffle';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BookWordsPage() {
  const { t } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
  const { content } = useContent();
  const book = content.books.find((b) => b.id === id);
  const words = useMemo(() => (book ? bookWords(book) : []), [book]);
  const units = useMemo(() => book?.units ?? [], [book]);
  const [query, setQuery] = useState('');

  const [sort, setSort] = useState<SortMode>(() => {
    try {
      const raw = localStorage.getItem(LS_SORT_KEY);
      if (raw === 'byUnit' || raw === 'alpha' || raw === 'shuffle') return raw;
    } catch { /* ignore */ }
    return 'byUnit';
  });
  useEffect(() => {
    try { localStorage.setItem(LS_SORT_KEY, sort); } catch { /* ignore */ }
  }, [sort]);

  const [selected, setSelected] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(`${LS_KEY}-${book?.id}`);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (book) localStorage.setItem(`${LS_KEY}-${book.id}`, JSON.stringify(selected));
  }, [selected, book]);

  // 按排序模式计算要渲染的"单元分组"列表
  const grouped: { id: string; title: string; words: IVocabWord[] }[] = useMemo(() => {
    if (!book) return [];
    if (sort === 'byUnit') {
      return units.map((u) => ({ id: u.id, title: u.title, words: u.words }));
    }
    if (sort === 'alpha') {
      const sorted = [...words].sort((a, b) => a.word.localeCompare(b.word));
      return [{ id: 'all-alpha', title: '按字母 A–Z', words: sorted }];
    }
    // shuffle
    return [{ id: 'all-shuffle', title: '随机顺序', words: shuffle(words) }];
  }, [book, sort, units, words]);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = useMemo(() => {
    if (!normalizedQuery) return grouped;
    return grouped
      .map((group) => ({
        ...group,
        words: group.words.filter((word) => (
          word.word.toLowerCase().includes(normalizedQuery)
          || (word.definition ?? '').toLowerCase().includes(normalizedQuery)
          || (word.pos ?? '').toLowerCase().includes(normalizedQuery)
        )),
      }))
      .filter((group) => group.words.length > 0);
  }, [grouped, normalizedQuery]);
  const visibleCount = visibleGroups.reduce((sum, group) => sum + group.words.length, 0);

  if (!book) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {t('词书不存在')}
      </div>
    );
  }

  const toggle = (wid: string) =>
    setSelected((s) => (s.includes(wid) ? s.filter((x) => x !== wid) : [...s, wid]));
  const selectAll = () => setSelected(words.map((w) => w.id));
  const selectRandom = () => {
    const n = Math.max(1, Math.floor(words.length / 2));
    setSelected(shuffle(words.map((w) => w.id)).slice(0, n));
  };

  const pct = words.length ? Math.round((selected.length / words.length) * 10000) / 100 : 0;

  const sortOptions: { key: SortMode; label: string; icon: typeof ListOrdered }[] = [
    { key: 'byUnit', label: '按单元', icon: ListOrdered },
    { key: 'alpha', label: 'A–Z', icon: ArrowDownAZ },
    { key: 'shuffle', label: '乱序', icon: Shuffle },
  ];

  return (
    <div>
      {/* 固定头部：全屏宽度纯色条带 */}
      <div className="app-glass app-glass-strong sticky top-0 z-20 rounded-[22px] px-4 pb-3 pt-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3">
        {/* 顶栏 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/books')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[20px] font-bold leading-tight tracking-[-0.03em]">{t(book.name)}</h1>
            <p className="text-xs text-muted-foreground">
              {t(book.stage)} · {t('{n} 个单元', { n: units.length })} · {t('{n} 词', { n: words.length })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('搜索本词书单词或释义')}
            aria-label={t('搜索本词书单词')}
            className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
            >
              {t('清空')}
            </button>
          )}
        </div>

        {/* 排序切换 */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5">
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            const active = sort === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className={cn(
                  'flex min-h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {t(opt.label)}
              </button>
            );
          })}
        </div>

        {/* 操作栏：左椭圆组（顺选|随机） + 右圆形去学习 */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* 椭圆 pill 组 */}
          <div className="grid grid-cols-2 items-center gap-1 rounded-full border border-white/65 bg-white/30 p-1">
            <button
              onClick={selectAll}
              className="min-h-10 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/42 hover:text-foreground"
            >
              {t('顺选')}
            </button>
            <button
              onClick={selectRandom}
              className="min-h-10 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/42 hover:text-foreground"
            >
              {t('随机')}
            </button>
          </div>
          {/* 右：今日待选 + 圆形去学习 */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {t('今日待选 {n}/{total}', { n: selected.length, total: words.length })}
            </span>
            <button
              onClick={() => navigate('/vocab')}
              className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 sm:size-12 sm:flex-none sm:px-0"
            >
              {t('去学习')}
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="mx-auto max-w-3xl">
      {/* 统计条 */}
      <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4">
        <div>
          <p className="text-2xl font-bold">{words.length - selected.length}</p>
          <p className="text-xs text-muted-foreground">{t('未选')}</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">{pct}%</p>
          <p className="text-xs text-muted-foreground">{t('已选')}</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{words.length}</p>
          <p className="text-xs text-muted-foreground">{t('全部')}</p>
        </div>
      </div>

      {/* 单词列表 */}
      <div className="space-y-4">
        {visibleGroups.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {normalizedQuery
              ? t('本词书没有匹配“{query}”的单词。', { query: query.trim() })
              : t('该书暂未内置词库，请选择内置词书查看单词。')}
          </div>
        )}
        {normalizedQuery && visibleGroups.length > 0 && (
          <p className="text-xs text-muted-foreground">{t('找到 {n} 个词', { n: visibleCount })}</p>
        )}
        {visibleGroups.map((u) => (
          <div key={u.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
              <p className="text-sm font-semibold">{t(u.title)}</p>
              <span className="rounded bg-muted px-1.5 py-0.5 text-xs tabular-nums text-muted-foreground">
                {u.words.length}
              </span>
            </div>
            <div className="divide-y divide-border">
              {u.words.map((w) => {
                const sel = selected.includes(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => toggle(w.id)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/34"
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                        sel ? 'border-teal-500 bg-teal-500' : 'border-muted-foreground/40',
                      )}
                    >
                      {sel && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{w.word}</span>
                        <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-500" />
                      </span>
                      <span className="mt-0.5 block truncate text-xs leading-5 text-muted-foreground">
                        {w.pos} {w.definition}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
