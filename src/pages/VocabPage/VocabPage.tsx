// EXPORTS: VocabPage
// 词汇学习（墨墨式）：回忆 → 显示释义 → 自评（忘记/模糊/认识/熟悉）→
// 按艾宾浩斯曲线安排复习；遗忘的词在本会话内反复出现，直到记住。

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import {
  Eye,
  Brain,
  Flame,
  RotateCcw,
  ChevronLeft,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Activity,
  Volume2,
  Undo2,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import MemoryCurve from '@/components/MemoryCurve';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useProgress, getTodayStr } from '@/context/progress-context';
import type { IProgress } from '@/context/progress-context';
import { useSettings } from '@/context/settings-context';
import { useI18n } from '@/context/i18n-context';
import { useContent } from '@/context/content-context';
import { bookWords } from '@/data/books';
import type { IVocabWord } from '@/data/words';
import { buildStudyQueue, summarizeMemory, getForgettingCurve } from '@/lib/memory';
import { sortByForgetting } from '@/lib/srs/adapter';
import type { Rating } from '@/lib/memory';

type Phase = 'overview' | 'study' | 'done';

type UndoSnapshot = {
  progress: IProgress;
  queue: string[];
  doneCount: number;
  lapsedToday: number;
  revealed: boolean;
};

// 一次学习（待复习+新学）达到该值即视为"过多"，开始前需二次确认
const OVERLOAD_THRESHOLD = 30;

function elapsedSecondsSince(startedAt: number): number {
  return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
}

// 例句渲染：当前学习的单词用红色波浪线标记
function ExampleSentence({ word, text, zh }: { word: string; text?: string; zh?: string }) {
  if (!text) return null;
  const esc = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${esc})`, 'i'));
  return (
    <div className="mt-2 space-y-1.5">
      <p className="text-base font-medium leading-relaxed text-foreground">
        {parts.map((p, i) =>
          p.toLowerCase() === word.toLowerCase() ? (
            <span
              key={i}
              style={{
                textDecoration: 'underline wavy #ef4444',
                textDecorationThickness: '2px',
                textUnderlineOffset: '3px',
                fontWeight: 700,
              }}
            >
              {p}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </p>
      {zh && <p className="text-sm text-muted-foreground">{zh}</p>}
    </div>
  );
}

export default function VocabPage() {
  const { settings } = useSettings();
  return <VocabSession key={settings.selectedBookId} />;
}

function VocabSession() {
  const { t } = useI18n();
  const {
    progress,
    reviewWord: commitReview,
    toggleFavorite,
    addStudySeconds,
    restoreProgress,
  } = useProgress();
  const { settings } = useSettings();
  const { content } = useContent();
  const [searchParams] = useSearchParams();
  const focusMode = searchParams.get('mode');
  const currentBook = content.books.find((b) => b.id === settings.selectedBookId) ?? content.books[0];
  // 学习的词：内置词书用该书词汇，否则回退到内置核心词库
  const currentWords = useMemo(
    () => (currentBook?.builtin && currentBook.units?.length ? bookWords(currentBook) : content.coreWords),
    [content.coreWords, currentBook],
  );
  const [phase, setPhase] = useState<Phase>('overview');
  const [revealed, setRevealed] = useState(false);
  // 会话队列（id），遗忘的词会重新加回队列末尾
  const [queue, setQueue] = useState<string[]>([]);
  const [doneCount, setDoneCount] = useState(0);
  const [lapsedToday, setLapsedToday] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const undoSnapshotRef = useRef<UndoSnapshot | null>(null);
  const startedRef = useRef(false);

  const wordById = useMemo(() => {
    const m: Record<string, IVocabWord> = {};
    currentWords.forEach((w) => (m[w.id] = w));
    return m;
  }, [currentWords]);

  const summary = useMemo(
    () => summarizeMemory(progress.memory, currentWords.map((w) => w.id)),
    [progress.memory, currentWords],
  );
  // 今天已经新学了多少个词（learnedAt 在今天零点之后）
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);
  const todayNewLearned = useMemo(() => {
    let n = 0;
    for (const id of currentWords.map((w) => w.id)) {
      const m = progress.memory[id];
      if (m && m.learnedAt >= todayStart && m.learnedAt > 0) n++;
    }
    return n;
  }, [progress.memory, currentWords, todayStart]);
  const dailyNewLimit = Math.max(0, settings.dailyTarget - todayNewLearned);
  const study = useMemo(() => buildStudyQueue(progress.memory, currentWords.map((w) => w.id), dailyNewLimit), [
    progress.memory,
    currentWords,
    dailyNewLimit,
  ]);
  const curve = useMemo(
    () => getForgettingCurve(progress.memory, currentWords.map((w) => w.id)),
    [progress.memory, currentWords],
  );

  const weakWords = summary.weakIds.map((id) => wordById[id]).filter(Boolean);
  const strongWords = summary.strongIds.map((id) => wordById[id]).filter(Boolean);

  const currentId = queue[0];
  const current = currentId ? wordById[currentId] : undefined;
  const currentMem = currentId ? progress.memory[currentId] : undefined;
  const currentFavorited = currentId ? progress.favoriteWords.includes(currentId) : false;

  // 记录当前词开始显示的时间，用于统计学习时长
  const wordStartRef = useRef(0);
  useEffect(() => {
    wordStartRef.current = Date.now();
  }, [currentId]);

  const beginStudy = () => {
    const q = buildStudyQueue(progress.memory, currentWords.map((w) => w.id), dailyNewLimit);
    // 到期词按记忆衰减排序（最容易忘的先复习），新旧穿插
    const dueSorted = sortByForgetting(
      q.dueWords.map((id) => ({ id })),
      progress.memory,
    ).map((x) => x.id);
    const ids: string[] = [];
    const due = focusMode === 'new' ? [] : [...dueSorted];
    const nw = focusMode === 'review' ? [] : [...q.newWords];
    // 交替穿插：1个复习 + 1个新词，直到一边用完
    while (due.length || nw.length) {
      if (due.length) ids.push(due.shift()!);
      if (nw.length) ids.push(nw.shift()!);
    }
    if (ids.length === 0) return;
    startedRef.current = true;
    undoSnapshotRef.current = null;
    setCanUndo(false);
    setQueue(ids);
    setRevealed(false);
    setDoneCount(0);
    setLapsedToday(0);
    setPhase('study');
  };

  const startSession = () => {
    if (totalPlanned >= OVERLOAD_THRESHOLD) {
      setConfirmOpen(true); // 学习量过多，二次确认
      return;
    }
    beginStudy();
  };

  useEffect(() => {
    if (startedRef.current) return;
    if (focusMode === 'review' || focusMode === 'new') {
      if (study.dueWords.length === 0 && study.newWords.length === 0) return;
      beginStudy();
      return;
    }
    if (study.dueWords.length > 0 || study.newWords.length > 0) {
      beginStudy();
    }
  }, [focusMode, study.dueWords.length, study.newWords.length]);

  const rate = (rating: Rating) => {
    if (!currentId) return;
    undoSnapshotRef.current = { progress, queue, doneCount, lapsedToday, revealed };
    setCanUndo(true);
    const elapsed = elapsedSecondsSince(wordStartRef.current);
    addStudySeconds(getTodayStr(), elapsed);
    commitReview(currentId, rating);
    // 遗忘的词回到队列末尾，本次会话内反复出现；其余移出
    if (rating === 0) {
      setLapsedToday((n) => n + 1);
      setQueue((q) => {
        const rest = q.slice(1);
        return [...rest, currentId];
      });
      // 记忆仍未稳定，继续学习同一词：重新隐藏释义
      setRevealed(false);
      setDoneCount((n) => n + 1);
    } else {
      setQueue((q) => q.slice(1));
      setDoneCount((n) => n + 1);
      setRevealed(false);
    }
  };

  // 朗读单词（有道词典发音：美音 type=2 / 英音 type=1）
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speak = useCallback(
    (text: string) => {
      const type = settings.accent === 'uk' ? 1 : 2;
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=${type}`;
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      const a = new Audio(url);
      audioRef.current = a;
      a.play().catch(() => {});
    },
    [settings.accent],
  );

  // 开始学习单词时自动播放读音
  useEffect(() => {
    if (phase === 'study' && current && !revealed) speak(current.word);
  }, [current, currentId, phase, revealed, speak]);

  // 显示释义时再读一遍
  useEffect(() => {
    if (phase === 'study' && current && revealed) speak(current.word);
  }, [revealed, phase, current, speak]);

  const exit = () => {
    undoSnapshotRef.current = null;
    setCanUndo(false);
    setPhase('overview');
    setQueue([]);
    setRevealed(false);
  };

  const undo = useCallback(() => {
    const snapshot = undoSnapshotRef.current;
    if (!snapshot) return;
    restoreProgress(snapshot.progress);
    setQueue(snapshot.queue);
    setDoneCount(snapshot.doneCount);
    setLapsedToday(snapshot.lapsedToday);
    setRevealed(snapshot.revealed);
    undoSnapshotRef.current = null;
    setCanUndo(false);
  }, [restoreProgress]);

  const rateRef = useRef(rate);
  rateRef.current = rate;
  const undoRef = useRef(undo);
  undoRef.current = undo;

  useEffect(() => {
    if (phase !== 'study') return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target
        && (target.tagName === 'INPUT'
          || target.tagName === 'TEXTAREA'
          || target.tagName === 'SELECT'
          || target.isContentEditable)
      ) {
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undoRef.current();
        return;
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        undoRef.current();
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        if (!revealed) {
          event.preventDefault();
          setRevealed(true);
        }
        return;
      }
      if (revealed && ['1', '2', '3', '4'].includes(event.key)) {
        event.preventDefault();
        rateRef.current((Number(event.key) - 1) as Rating);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, revealed]);

  const totalPlanned = study.dueCount + study.newCount;
  const newWordShortage = focusMode !== 'review' && study.newCount < dailyNewLimit;
  const allDone = phase === 'study' && queue.length === 0;

  return (
    <div className="min-h-full space-y-6 pb-24 pt-8 animate-page-in" onClick={phase === 'study' && !revealed ? () => setRevealed(true) : undefined}>
      {/* ===== 概览：记忆分布 + 今日任务 ===== */}
      {phase === 'overview' && (
        <>
          {/* 今日任务 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('今日任务')}</CardTitle>
              <CardDescription>{t('到期复习 + 新学，跟着曲线走')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RefreshCw className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xl font-bold">{study.dueCount}</p>
                  <p className="text-xs text-muted-foreground">{t('到期需复习')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <Brain className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xl font-bold">{study.newCount}</p>
                  <p className="text-xs text-muted-foreground">{t('今日新学单词')}</p>
                </div>
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-primary/8 px-3 py-2 text-xs text-muted-foreground">
                <span>
                  {t('今日新词目标 {target} · 已学 {done} · 本次可学 {remaining}', {
                    target: settings.dailyTarget,
                    done: todayNewLearned,
                    remaining: study.newCount,
                  })}
                </span>
                {newWordShortage && (
                  <span className="text-warning">
                    {t('当前词书仅剩 {n} 个新词', { n: study.newCount })}
                  </span>
                )}
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <Button
                size="lg"
                className="w-full"
                onClick={startSession}
                disabled={totalPlanned === 0}
              >
                <Eye className="h-5 w-5" />
                {totalPlanned === 0 ? t('今日已完成') : t('开始学习 · {n} 个词', { n: totalPlanned })}
              </Button>
            </CardContent>
          </Card>

          {/* 遗忘曲线 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-primary" /> {t('我的遗忘曲线')}
              </CardTitle>
              <CardDescription>{t('虚线是理论平均，实线是你实际记忆，点线是未来预测')}</CardDescription>
            </CardHeader>
            <CardContent>
              <MemoryCurve curve={curve} />
            </CardContent>
          </Card>

          {/* 记忆分析 */}
          <section className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t('已掌握（牢固）')}</p>
                <p className="mt-1 text-2xl font-bold text-success">{summary.masteredCount}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3.5 w-3.5" /> {t('记得牢固')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t('学习中')}</p>
                <p className="mt-1 text-2xl font-bold text-primary">{summary.learningCount}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <RefreshCw className="h-3.5 w-3.5" /> {t('仍在复习')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t('待学习')}</p>
                <p className="mt-1 text-2xl font-bold">{summary.newCount}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Brain className="h-3.5 w-3.5" /> {t('还没开始')}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 薄弱词 */}
          {weakWords.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> {t('记得不太好，重点复习')}
                </CardTitle>
                <CardDescription>{t('这些词反复忘记，会优先安排复习')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {weakWords.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => toggleFavorite(w.id)}
                      className="rounded-full border border-destructive/30 bg-destructive/5 px-3 py-1 text-sm text-destructive"
                      title={t('点击收藏')}
                    >
                      {w.word}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 牢固词 */}
          {strongWords.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="h-4 w-4 text-success" /> {t('记得牢固')}
                </CardTitle>
                <CardDescription>{t('已进入长期记忆，进入低频复习')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {strongWords.map((w) => (
                    <span
                      key={w.id}
                      className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ===== 学习会话 ===== */}
      {phase === 'study' && (
        <div className="w-full cursor-pointer" onClick={!revealed ? () => setRevealed(true) : undefined}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span>
              {focusMode === 'review'
                ? t('本次复习 {n} 个到期词', { n: queue.length + doneCount })
                : t('今日新词目标 {target} · 已学 {done} · 本次可学 {remaining}', {
                  target: settings.dailyTarget,
                  done: todayNewLearned,
                  remaining: study.newCount,
                })}
            </span>
            {newWordShortage && (
              <span className="text-warning">{t('当前词书仅剩 {n} 个新词', { n: study.newCount })}</span>
            )}
          </div>
          {/* 顶部进度条 */}
          {!allDone && (
            <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, (doneCount / Math.max(1, doneCount + queue.length)) * 100)}%` }}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); exit(); }}>
                <ChevronLeft className="h-4 w-4" /> {t('退出学习')}
              </Button>
              {canUndo && (
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); undo(); }}>
                  <Undo2 className="h-4 w-4" /> {t('撤销')}
                </Button>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {t('本轮已处理 {n} 个', { n: doneCount })}{allDone ? t(' · 完成') : ''}
              {lapsedToday > 0 && <span className="ml-2 text-destructive">{t('遗忘 {n}', { n: lapsedToday })}</span>}
            </span>
          </div>

          {!allDone && current ? (
            <div key={currentId} className="w-full space-y-4 cursor-pointer animate-card-in" onClick={!revealed ? () => setRevealed(true) : undefined}>
              {/* 记忆卡片：点击整个学习背景均显示释义并进入自评 */}
              <Card className="mx-auto max-w-4xl overflow-hidden rounded-[22px]">
                <div className="p-6 pb-4 text-center">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {currentMem?.status === 'mastered'
                        ? t('已掌握 · 复习')
                        : currentMem?.reps && currentMem.reps > 0
                          ? t('复习第 {n} 次', { n: currentMem.reps })
                          : t('新词')}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(current.id); }}
                      aria-label={t(currentFavorited ? '取消收藏' : '收藏单词')}
                      title={t(currentFavorited ? '取消收藏' : '收藏单词')}
                      className={cn(
                        'grid size-11 place-items-center rounded-full transition-colors',
                        currentFavorited
                          ? 'bg-destructive/10 text-destructive'
                          : 'text-muted-foreground hover:bg-white/50 hover:text-foreground',
                      )}
                    >
                      <Heart className="h-[18px] w-[18px]" fill={currentFavorited ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="mx-auto mt-6 flex max-w-full flex-col items-center justify-center gap-2 sm:flex-row">
                    <p className="max-w-full break-words text-center text-[clamp(2rem,8vw,3rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
                      {current.word}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(current.word);
                      }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary hover:bg-primary/12"
                      title={t('播放读音')}
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>
                  </div>
                  {(current.phonetic || current.pos) && (
                    <p className="mt-2 text-lg text-muted-foreground">
                      {[current.phonetic, current.pos].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>

                {!revealed ? (
                  <div className="p-6 pt-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t('先在脑子里回想它的意思，然后点击卡片任意位置查看释义并自评。')}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t('已自动播放读音，可点词右侧喇叭重听')}
                    </p>
                  </div>
                ) : (
                  <div key={revealed ? 'revealed' : 'hidden'} className="p-6 pt-2 animate-reveal-in">
                    {/* 左右两栏 */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* 左栏：释义 + 短语 */}
                      <div className="space-y-4">
                        <div className="rounded-xl border border-border bg-muted/40 p-5 shadow-sm">
                          <p className="text-lg font-semibold text-primary">{current.definition}</p>
                          {current.senses && current.senses.length > 0 && (
                            <div className="mt-3 space-y-1 border-t border-border/60 pt-3">
                              {current.senses.map((s, i) => (
                                <div key={i} className="flex flex-wrap items-baseline gap-2 text-sm">
                                  <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">{s.pos}</span>
                                  <span className="text-foreground">{s.zh}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <span className="mt-3 inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {current.category}
                          </span>
                        </div>

                        {current.forms && current.forms.length > 0 && (
                          <div>
            <p className="text-xs font-semibold text-muted-foreground">
                              {t('词形变化')}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {current.forms.map((f, i) => (
                                <span key={i} className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs">
                                  <span className="text-muted-foreground">{f.label} </span>
                                  <span className="font-medium text-foreground">{f.value}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {current.phrases && current.phrases.length > 0 && (
                          <div>
            <p className="text-xs font-semibold text-muted-foreground">
                              {t('常用短语')}
                            </p>
                            <div className="mt-2 space-y-1.5">
                              {current.phrases.map((ph, i) => (
                                <div key={i} className="flex flex-wrap items-baseline gap-2 rounded-lg border border-border bg-card px-3 py-2">
                                  <span className="text-base font-medium text-foreground">{ph.en}</span>
                                  <span className="text-sm text-muted-foreground">{ph.zh}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {current.mnemonic && (
                          <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4">
                            <p className="text-xs font-semibold text-amber-800">
                              {t('巧记口诀')}
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-amber-900">
                              {current.mnemonic}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 右栏：例句 */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">
                            {t('例句')}
                          </p>
                          <ExampleSentence word={current.word} text={current.example} zh={current.exampleZh} />
                        </div>

                        {current.extraExamples && current.extraExamples.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground">
                              {t('更多例句')}
                            </p>
                            <div className="mt-2 space-y-3">
                              {current.extraExamples.map((ex, i) => (
                                <ExampleSentence key={i} word={current.word} text={ex.en} zh={ex.zh} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </Card>

              {revealed && typeof document !== 'undefined' &&
                createPortal(
                  <div className="vocab-rating-dock">
                    <div className="mx-auto max-w-4xl rounded-[20px] border border-white/80 bg-white/96 p-3 shadow-[0_10px_30px_rgba(23,61,55,0.14)]">
                  <p className="text-center text-sm text-muted-foreground">{t('刚才你记住了吗？')}</p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {(
                      [
                        [0, '忘记', 'text-destructive', 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20 hover:shadow-lg hover:shadow-destructive/20 hover:-translate-y-0.5'],
                        [1, '模糊', 'text-muted-foreground', 'bg-muted/60 border-border hover:bg-muted hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-0.5'],
                        [2, '认识', 'text-primary', 'bg-primary/10 border-primary/30 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5'],
                        [3, '熟悉', 'text-success', 'bg-success/10 border-success/30 hover:bg-success/20 hover:shadow-lg hover:shadow-success/20 hover:-translate-y-0.5'],
                      ] as [Rating, string, string, string][]
                    ).map(([r, label, color, cls]) => (
                      <button
                        key={r}
                        onClick={() => rate(r)}
                        className={cn(
                          'rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95',
                          cls,
                          color,
                        )}
                      >
                        {t(label)}
                      </button>
                    ))}
                  </div>
                  {currentMem?.lastRating === 0 && (
                    <p className="mt-2 text-center text-xs text-destructive">
                      {t('这个词你之前忘了，这次请再试一次')}
                    </p>
                  )}
                  <p className="mt-2 hidden flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-muted-foreground lg:flex">
                    <span><kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-sans">{t('空格')}</kbd> {t('看释义')}</span>
                    <span><kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-sans">1–4</kbd> {t('自评')}</span>
                    <span><kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-sans">Ctrl+Z</kbd> {t('撤销')}</span>
                  </p>
                
                    </div>
                  </div>,
                  document.body,
                )}

<p className="text-center text-xs text-muted-foreground">
                {t('遗忘的词会在本轮学习中反复出现，直到真正记住。')}
              </p>
              {revealed && <div className="h-24" aria-hidden="true" />}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
                <p className="mt-3 text-lg font-semibold">{t('本轮学习完成')}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('已处理 {n} 个词，遗忘 {m} 个（已重新巩固）', { n: doneCount, m: lapsedToday })}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('明天到期复习：{n} 个', { n: buildStudyQueue(progress.memory, currentWords.map((w) => w.id)).dueCount })}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button onClick={startSession}>
                    <RotateCcw className="h-4 w-4" /> {t('再学一轮')}
                  </Button>
                  <Button variant="outline" onClick={exit}>
                    {t('返回概览')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 学习提示 */}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Flame className="h-3.5 w-3.5 text-destructive" />
        {t('按艾宾浩斯遗忘曲线安排复习：先密后疏，忘了的会反复出现，记得牢固的逐步减少打扰。')}
      </p>

      <ConfirmDialog
        open={confirmOpen}
        title={t('学习量过多')}
        message={t('今天待复习 {due} 个 + 新学 {new} 个，共 {total} 个，一次学太多容易记不牢、容易疲劳，确定要学这么多吗？', { due: study.dueCount, new: study.newCount, total: totalPlanned })}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          beginStudy();
        }}
      />
    </div>
  );
}
