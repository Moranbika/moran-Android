// EXPORTS: ProgressPage
// 学习记录（仿墨墨三标签）：遗忘曲线 / 学习情况 / 记忆持久度。
// 保留错题回顾、收藏单词、重置进度。

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Heart,
  Brain,
  AlertTriangle,
  Trophy,
  Activity,
  BarChart3,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { format, startOfWeek, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { cloudAccountsEnabled } from '@/lib/cloud-sync';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import MemoryCurve from '@/components/MemoryCurve';
import StudyChart from '@/components/StudyChart';
import PersistenceChart from '@/components/PersistenceChart';
import AnimatedNumber from '@/components/AnimatedNumber';
import { useInView } from '@/hooks/use-in-view';
import { useAnimatedProgress } from '@/hooks/use-animated-progress';
import type { ChartSeries } from '@/components/StudyChart';
import { useProgress, getTodayStr } from '@/context/progress-context';
import { useContent } from '@/context/content-context';
import { useI18n } from '@/context/i18n-context';
import type { IVocabWord } from '@/data/words';
import { bookWords } from '@/data/books';
import type { IQuestion } from '@/data/listening';
import { summarizeMemory, getForgettingCurve, buildStudyQueue } from '@/lib/memory';
import type { WordMemory, Rating } from '@/lib/memory';
import type { ReviewLog, MockExamAttempt } from '@/context/progress-context';

type Tab = 'curve' | 'study' | 'persist' | 'mock';
type StudyMode = 'cognition' | 'review';
type Granularity = 'day' | 'week' | 'month';

interface IMappedQuestion extends IQuestion {
  source: string;
}

function buildQuestionIndex(
  listeningSets: ReturnType<typeof useContent>['content']['listeningSets'],
  examSets: ReturnType<typeof useContent>['content']['examSets'],
): Record<string, IMappedQuestion> {
  const index: Record<string, IMappedQuestion> = {};
  listeningSets.forEach((s) =>
    s.sections.forEach((sec) =>
      sec.questions.forEach((q) => {
        const key = q.id ?? `l-${s.id}-q${q.no}`;
        index[key] = { ...q, id: key, source: `听力 · ${s.title}` };
      }),
    ),
  );
  examSets.forEach((s) =>
    s.passages.forEach((p) =>
      p.questions.forEach((q) => {
        index[q.id] = { ...q, source: `阅读 · ${s.title}` };
      }),
    ),
  );
  return index;
}

// 全局词表索引：所有词书的词合并，供记忆分析/薄弱词/收藏词反查详情
function buildAllWordsMap(
  books: ReturnType<typeof useContent>['content']['books'],
  coreWords: IVocabWord[],
): Record<string, IVocabWord> {
  const map: Record<string, IVocabWord> = {};
  for (const book of books) {
    if (!book.units?.length) continue;
    for (const w of bookWords(book)) map[w.id] = w;
  }
  for (const w of coreWords) map[w.id] = w;
  return map;
}

const RATING_META: Array<{ label: string; rating: Rating; color: string }> = [
  { label: '熟悉', rating: 3, color: 'var(--chart-2)' },
  { label: '认识', rating: 2, color: 'var(--chart-1)' },
  { label: '模糊', rating: 1, color: 'var(--chart-3)' },
  { label: '忘记', rating: 0, color: 'var(--chart-5)' },
];

// ---- 日期分组 helper ----
const DAY_FMT = 'yyyy-MM-dd';
function dayKey(ts: number): string {
  return format(new Date(ts), DAY_FMT);
}
function weekKey(ts: number): string {
  return format(startOfWeek(new Date(ts)), DAY_FMT);
}
function monthKey(ts: number): string {
  return format(new Date(ts), 'yyyy-MM');
}

// ---- 记忆持久度 ----
function buildPersistence(memory: Record<string, WordMemory>, allIds: string[]) {
  let total = 0;
  const buckets = { d10: 0, d30: 0, d60: 0, d90: 0 };
  for (const id of allIds) {
    const m = memory[id];
    if (!m || m.status === 'new') continue;
    total += 1;
    if (m.interval >= 10) buckets.d10 += 1;
    if (m.interval >= 30) buckets.d30 += 1;
    if (m.interval >= 60) buckets.d60 += 1;
    if (m.interval >= 90) buckets.d90 += 1;
  }
  return { total, ...buckets };
}

// ---- 学习情况柱状图 ----
function buildStudyChart(
  reviewLog: ReviewLog[],
  memory: Record<string, WordMemory>,
  mode: StudyMode,
  gran: Granularity,
  todayPlanned: number,
): { categories: string[]; series: ChartSeries[] } {
  let categories: string[];
  let keys: string[];
  let todayIdx = -1;

  if (gran === 'day') {
    categories = ['5天前', '4天前', '3天前', '前天', '昨天', '今天', '明天', '后天', '3天后', '4天后'];
    keys = [];
    for (let i = -5; i <= 4; i += 1) keys.push(dayKey(new Date().getTime() + i * 86400000));
    todayIdx = 5;
  } else if (gran === 'week') {
    categories = ['3周前', '2周前', '上周', '本周'];
    keys = [];
    for (let i = -3; i <= 0; i += 1)
      keys.push(weekKey(new Date().getTime() + i * 7 * 86400000));
    todayIdx = 3;
  } else {
    categories = ['3个月前', '2个月前', '上个月', '本月'];
    keys = [];
    for (let i = -3; i <= 0; i += 1)
      keys.push(monthKey(addMonths(new Date(), i).getTime()));
    todayIdx = 3;
  }

  const n = categories.length;
  const keyOf = gran === 'day' ? dayKey : gran === 'week' ? weekKey : monthKey;

  if (mode === 'cognition') {
    // 各认知档（堆叠）：忘记在最底部，熟悉在最顶部
    const series: ChartSeries[] = [...RATING_META].reverse().map((r) => {
      const data = new Array<number>(n).fill(0);
      reviewLog.forEach((l) => {
        if (l.rating !== r.rating) return;
        const idx = keys.indexOf(keyOf(l.ts));
        if (idx >= 0) data[idx] += 1;
      });
      return { name: r.label, color: r.color, data };
    });
    // 今日待学（灰色，独立柱）
    if (todayIdx >= 0) {
      const todo = new Array<number>(n).fill(0);
      todo[todayIdx] = todayPlanned;
      series.push({ name: '今日待学', color: 'var(--muted-foreground)', data: todo });
    }
    return { categories, series };
  }

  // 复习 / 新学
  const reviewData = new Array<number>(n).fill(0);
  reviewLog.forEach((l) => {
    const idx = keys.indexOf(keyOf(l.ts));
    if (idx >= 0) reviewData[idx] += 1;
  });
  const newData = new Array<number>(n).fill(0);
  Object.values(memory).forEach((m) => {
    if (!m.learnedAt) return;
    const idx = keys.indexOf(keyOf(m.learnedAt));
    if (idx >= 0) newData[idx] += 1;
  });
  return {
    categories,
    series: [
      { name: '复习', color: 'var(--chart-1)', data: reviewData },
      { name: '新学', color: 'var(--chart-2)', data: newData },
    ],
  };
}

function formatDuration(secs: number): string {
  if (secs >= 60) return `${Math.floor(secs / 60)}m ${secs % 60}s`;
  return `${secs}s`;
}

function attemptScore(attempt: MockExamAttempt): number {
  const total = attempt.listeningTotal + attempt.readingTotal;
  return total > 0
    ? Math.round(((attempt.listeningCorrect + attempt.readingCorrect) / total) * 100)
    : 0;
}

function MockTrendBars({ attempts }: { attempts: MockExamAttempt[] }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const progress = useAnimatedProgress(inView, 700);

  return (
    <div ref={ref} className="flex h-48 items-end gap-2">
      {attempts.map((attempt) => {
        const score = attemptScore(attempt);
        return (
          <div key={attempt.id} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[11px] tabular-nums text-muted-foreground">
              <AnimatedNumber value={score} suffix="%" active={inView} duration={700} />
            </span>
            <div className="flex h-32 w-full items-end">
              <div
                className="w-full rounded-t-[6px] bg-primary/70"
                style={{ height: `${score * progress}%` }}
              />
            </div>
            <span className="truncate text-[10px] text-muted-foreground">
              {format(new Date(attempt.completedAt), 'M/d')}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ProgressPage() {
  const { t, locale } = useI18n();
  const { progress, resetProgress } = useProgress();
  const { content } = useContent();
  const [tab, setTab] = useState<Tab>('curve');
  const [mode, setMode] = useState<StudyMode>('cognition');
  const [gran, setGran] = useState<Granularity>('day');
  const [cloudSession, setCloudSession] = useState(
    () => cloudAccountsEnabled && Boolean(localStorage.getItem('moran_token')),
  );
  useEffect(() => {
    const sync = () => {
      setCloudSession(cloudAccountsEnabled && Boolean(localStorage.getItem('moran_token')));
    };
    sync();
    window.addEventListener('moran:auth-changed', sync);
    return () => window.removeEventListener('moran:auth-changed', sync);
  }, []);
  const questionIndex = useMemo(
    () => buildQuestionIndex(content.listeningSets, content.examSets),
    [content.examSets, content.listeningSets],
  );
  const allWordsMap = useMemo(
    () => buildAllWordsMap(content.books, content.coreWords),
    [content.books, content.coreWords],
  );

  const ids = useMemo(() => Object.keys(progress.memory), [progress.memory]);
  const todayStr = getTodayStr();

  const curve = useMemo(
    () => getForgettingCurve(progress.memory, ids),
    [progress.memory, ids],
  );
  const memorySummary = useMemo(
    () => summarizeMemory(progress.memory, ids),
    [progress.memory, ids],
  );
  const queue = useMemo(() => buildStudyQueue(progress.memory, ids), [progress.memory, ids]);
  const todayPlanned = queue.dueCount + queue.newCount;

  const todayLog = useMemo(
    () => progress.reviewLog.filter((l) => dayKey(l.ts) === todayStr),
    [progress.reviewLog, todayStr],
  );
  const todayRating = useMemo(() => {
    const c = [0, 0, 0, 0];
    todayLog.forEach((l) => {
      c[l.rating] += 1;
    });
    return c; // [忘记, 模糊, 认识, 熟悉]
  }, [todayLog]);
  const todaySeconds = progress.studyLog[todayStr] ?? 0;

  const persist = useMemo(() => buildPersistence(progress.memory, ids), [progress.memory, ids]);
  const studyChart = useMemo(
    () => buildStudyChart(progress.reviewLog, progress.memory, mode, gran, todayPlanned),
    [progress.reviewLog, progress.memory, mode, gran, todayPlanned],
  );
  const mockAttempts = useMemo(
    () => [...progress.mockExamAttempts].sort((a, b) => a.completedAt - b.completedAt),
    [progress.mockExamAttempts],
  );
  const mockScores = mockAttempts.map(attemptScore);
  const mockRecent = mockAttempts.slice(-8);
  const latestMockScore = mockScores.length ? mockScores[mockScores.length - 1] : 0;
  const bestMockScore = mockScores.length ? Math.max(...mockScores) : 0;
  const averageMockScore = mockScores.length
    ? Math.round(mockScores.reduce((sum, score) => sum + score, 0) / mockScores.length)
    : 0;
  const mockDelta = mockScores.length > 1
    ? mockScores[mockScores.length - 1] - mockScores[mockScores.length - 2]
    : null;

  const weakWords = memorySummary.weakIds
    .map((id) => {
      const w = allWordsMap[id];
      return w ? { ...w, lapses: progress.memory[id].lapses } : null;
    })
    .filter((x): x is (IVocabWord & { lapses: number }) => x !== null)
    .sort((a, b) => b.lapses - a.lapses);
  const strongWords = memorySummary.strongIds
      .map((id) => allWordsMap[id])
    .filter((w): w is IVocabWord => w !== undefined);

  const wrongQuestions = useMemo(
    () =>
      Object.entries(progress.questionResults)
        .filter(([, v]) => !v)
        .map(([qid]) => questionIndex[qid])
        .filter((q) => q !== undefined),
    [progress.questionResults, questionIndex],
  );

  const favorites = useMemo(
    () =>
      progress.favoriteWords
        .map((id) => allWordsMap[id])
        .filter((w): w is IVocabWord => w !== undefined),
    [allWordsMap, progress.favoriteWords],
  );

  const persistRows = [
    { label: t('已加入记忆规划的全部单词'), value: persist.total, pct: null as number | null },
    { label: t('记忆持久度≥10天的词汇量'), value: persist.d10, pct: persist.total ? Math.round((persist.d10 / persist.total) * 10000) / 100 : 0 },
    { label: t('记忆持久度≥30天的词汇量'), value: persist.d30, pct: persist.total ? Math.round((persist.d30 / persist.total) * 10000) / 100 : 0 },
    { label: t('记忆持久度≥60天的词汇量'), value: persist.d60, pct: persist.total ? Math.round((persist.d60 / persist.total) * 10000) / 100 : 0 },
    { label: t('记忆持久度≥90天的词汇量'), value: persist.d90, pct: persist.total ? Math.round((persist.d90 / persist.total) * 10000) / 100 : 0 },
  ];

  const todayStats = [
    { label: t('今日熟知'), value: todayRating[3], color: 'text-success' },
    { label: t('今日认识'), value: todayRating[2], color: 'text-primary' },
    { label: t('今日模糊'), value: todayRating[1], color: 'text-warning' },
    { label: t('今日忘记'), value: todayRating[0], color: 'text-destructive' },
    { label: t('今日待学'), value: todayPlanned, color: 'text-muted-foreground' },
    { label: t('今日时长'), value: formatDuration(todaySeconds), color: 'text-accent' },
  ];

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: 'curve', label: t('遗忘曲线') },
    { key: 'study', label: t('学习情况') },
    { key: 'persist', label: t('记忆持久度') },
    { key: 'mock', label: t('模考趋势') },
  ];

  return (
    <div className="space-y-8 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="screen-title">{t('学习记录')}</h1>
          <p className="screen-lead mt-2">
            {t(cloudSession
              ? '按艾宾浩斯遗忘曲线追踪记忆 · 数据同步到莫兰云端'
              : '按艾宾浩斯遗忘曲线追踪记忆 · 数据保存在当前设备')}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <Trash2 className="h-4 w-4" /> {t('重置进度')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('确定要清空全部学习进度吗？')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('这将删除已学词汇、错题、打卡、学习记录与统计，且无法恢复。')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('取消')}</AlertDialogCancel>
              <AlertDialogAction onClick={resetProgress}>{t('确认清空')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* ===== 三标签（仿墨墨） ===== */}
      <div className="apple-segmented grid grid-cols-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-active={tab === t.key}
            className="apple-segment flex-1 px-1"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== 遗忘曲线 ===== */}
      {tab === 'curve' && (
        <>
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

          {/* 记忆分布 */}
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t('记得牢固')}</p>
                <p className="mt-1 text-2xl font-bold text-success">{memorySummary.masteredCount}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3.5 w-3.5" /> {t('长期记忆')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t('学习中')}</p>
                <p className="mt-1 text-2xl font-bold text-primary">{memorySummary.learningCount}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Brain className="h-3.5 w-3.5" /> {t('按曲线复习')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t('记得不好')}</p>
                <p className="mt-1 text-2xl font-bold text-destructive">{weakWords.length}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3.5 w-3.5" /> {t('反复遗忘')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t('待学习')}</p>
                <p className="mt-1 text-2xl font-bold">{memorySummary.newCount}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <BarChart3 className="h-3.5 w-3.5" /> {t('还没开始')}
                </p>
              </CardContent>
            </Card>
          </section>

          {weakWords.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" /> {t('记得不太好，建议重点复习')}
                </p>
                <div className="space-y-2.5">
                  {weakWords.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-start justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold">{w.word}</p>
                        <p className="text-xs text-muted-foreground">
                          {w.phonetic} · {w.pos} · {w.definition}
                        </p>
                      </div>
                      <span className="shrink-0 rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                        {t('遗忘 {n} 次', { n: w.lapses })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {strongWords.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-success">
                  <Trophy className="h-4 w-4" /> {t('记得牢固，进入低频复习')}
                </p>
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

      {/* ===== 学习情况 ===== */}
      {tab === 'study' && (
        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-primary" /> {t('学习情况')}
            </CardTitle>
            <div className="flex items-center gap-3">
              {/* 认知情况 / 复习新学 */}
              <div className="flex rounded-lg border border-border p-0.5">
                {(
                  [
                    ['cognition', t('认知情况')],
                    ['review', t('复习新学')],
                  ] as [StudyMode, string][]
                ).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setMode(k)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                      mode === k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {/* 日 / 周 / 月 */}
              <div className="flex rounded-lg border border-border p-0.5">
                {(
                  [
                    ['day', t('按日')],
                    ['week', t('按周')],
                    ['month', t('按月')],
                  ] as [Granularity, string][]
                ).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setGran(k)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                      gran === k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <StudyChart categories={studyChart.categories} series={studyChart.series} stack height={300} />

            {/* 今日统计（仿墨墨） */}
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 sm:grid-cols-6">
              {todayStats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className={cn('text-lg font-bold', s.color)}>{s.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== 记忆持久度 ===== */}
      {tab === 'persist' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" /> {t('记忆持久度')}
            </CardTitle>
            <CardDescription>{t('记录你已记住多长时间的词汇，越久越牢固')}</CardDescription>
          </CardHeader>
          <CardContent>
            <PersistenceChart
              categories={[]}
              data={[persist.total, persist.d10, persist.d30, persist.d60, persist.d90]}
            />
            <div className="mt-4 space-y-2.5 border-t border-border pt-4">
              {persistRows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5 text-sm"
                >
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-semibold">
                    {r.value}
                    {r.pct !== null && <span className="ml-1 text-xs text-muted-foreground">| {r.pct}%</span>}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== 模考趋势 ===== */}
      {tab === 'mock' && (
        <div className="space-y-4">
          {mockAttempts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="mx-auto h-8 w-8 text-primary/60" />
                <p className="mt-3 text-sm font-medium">{t('还没有模考记录')}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('完成一次限时模考后，这里会显示成绩趋势和最近作答。')}
                </p>
                <Link
                  to="/mock-exam"
                  className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
                >
                  {t('去模考')}
                  <TrendingUp className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: t('最近得分'), value: `${latestMockScore}%` },
                  { label: t('最高得分'), value: `${bestMockScore}%` },
                  { label: t('平均得分'), value: `${averageMockScore}%` },
                  {
                    label: t('较上次'),
                    value: mockDelta === null ? t('首次') : `${mockDelta >= 0 ? '+' : ''}${mockDelta}%`,
                  },
                ].map((item) => (
                  <Card key={item.label}>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-2xl font-semibold tabular-nums">{item.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </section>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-primary" /> {t('最近 {n} 次模考', { n: mockRecent.length })}
                  </CardTitle>
                  <CardDescription>{t('满分 100%，按听力与阅读客观题合计')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <MockTrendBars attempts={mockRecent} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('最近模考')}</CardTitle>
                  <CardDescription>{t('共 {n} 次记录', { n: mockAttempts.length })}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockAttempts.slice(-5).reverse().map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/40 px-3 py-2.5 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {content.examSets.find((exam) => exam.id === attempt.examSetId)?.title ?? attempt.examSetId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(attempt.completedAt))} · {formatDuration(attempt.durationSeconds)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs tabular-nums">
                        <span>{t('听力 {correct}/{total}', { correct: attempt.listeningCorrect, total: attempt.listeningTotal })}</span>
                        <span>{t('阅读 {correct}/{total}', { correct: attempt.readingCorrect, total: attempt.readingTotal })}</span>
                        <strong className="text-sm text-primary">{attemptScore(attempt)}%</strong>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* ===== 错题回顾 ===== */}
      <section>
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">{t('错题回顾')}</CardTitle>
          <CardDescription>{t('共 {n} 道错题，答错的题目会出现在这里', { n: wrongQuestions.length })}</CardDescription>
        </CardHeader>
        {wrongQuestions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              {t('还没有错题，继续保持。')}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {wrongQuestions.map((q) => (
              <Card key={q.id}>
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t(q.source)}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold">{q.prompt}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium text-success">{t('正确答案：')}</span>
                    {String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{q.analysis}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 收藏单词 */}
      <section>
        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-4 w-4 text-accent" /> {t('收藏的难词')}
          </CardTitle>
          <CardDescription>{t('共 {n} 个，收藏便于重点复习', { n: favorites.length })}</CardDescription>
        </CardHeader>
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              {t('还没有收藏单词，在词汇页点爱心即可收藏。')}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((w) => (
              <Card key={w.id} className="p-0">
                <CardContent className="p-4">
                  <p className="font-bold tracking-tight">{w.word}</p>
                  <p className="text-xs text-muted-foreground">
                    {w.phonetic} · {w.pos}
                  </p>
                  <p className="mt-2 text-sm font-medium text-primary">{w.definition}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
