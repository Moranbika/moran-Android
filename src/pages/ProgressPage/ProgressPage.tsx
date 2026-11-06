import { useEffect, useMemo, useState } from 'react';
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
import type { ChartSeries } from '@/components/StudyChart';
import { useProgress, getTodayStr } from '@/context/progress-context';
import { useContent } from '@/context/content-context';
import { useI18n } from '@/context/i18n-context';
import type { IVocabWord } from '@/data/words';
import { bookWords } from '@/data/books';
import { summarizeMemory, getForgettingCurve, buildStudyQueue } from '@/lib/memory';
import type { WordMemory, Rating } from '@/lib/memory';
import type { ReviewLog } from '@/context/progress-context';

type Tab = 'curve' | 'study' | 'persist';
type StudyMode = 'cognition' | 'review';
type Granularity = 'day' | 'week' | 'month';

function buildAllWordsMap(
  books: ReturnType<typeof useContent>['content']['books'],
  coreWords: IVocabWord[],
): Record<string, IVocabWord> {
  const map: Record<string, IVocabWord> = {};
  for (const book of books) {
    if (!book.units?.length) continue;
    for (const word of bookWords(book)) map[word.id] = word;
  }
  for (const word of coreWords) map[word.id] = word;
  return map;
}

const RATING_META: Array<{ label: string; rating: Rating; color: string }> = [
  { label: '熟悉', rating: 3, color: 'var(--chart-2)' },
  { label: '认识', rating: 2, color: 'var(--chart-1)' },
  { label: '模糊', rating: 1, color: 'var(--chart-3)' },
  { label: '忘记', rating: 0, color: 'var(--chart-5)' },
];

const DAY_FMT = 'yyyy-MM-dd';
const dayKey = (ts: number) => format(new Date(ts), DAY_FMT);
const weekKey = (ts: number) => format(startOfWeek(new Date(ts)), DAY_FMT);
const monthKey = (ts: number) => format(new Date(ts), 'yyyy-MM');

function buildPersistence(memory: Record<string, WordMemory>, allIds: string[]) {
  let total = 0;
  const buckets = { d10: 0, d30: 0, d60: 0, d90: 0 };
  for (const id of allIds) {
    const item = memory[id];
    if (!item || item.status === 'new') continue;
    total += 1;
    if (item.interval >= 10) buckets.d10 += 1;
    if (item.interval >= 30) buckets.d30 += 1;
    if (item.interval >= 60) buckets.d60 += 1;
    if (item.interval >= 90) buckets.d90 += 1;
  }
  return { total, ...buckets };
}

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
    keys = Array.from({ length: 10 }, (_, index) => dayKey(Date.now() + (index - 5) * 86400000));
    todayIdx = 5;
  } else if (gran === 'week') {
    categories = ['3周前', '2周前', '上周', '本周'];
    keys = Array.from({ length: 4 }, (_, index) => weekKey(Date.now() + (index - 3) * 7 * 86400000));
    todayIdx = 3;
  } else {
    categories = ['3个月前', '2个月前', '上个月', '本月'];
    keys = Array.from({ length: 4 }, (_, index) => monthKey(addMonths(new Date(), index - 3).getTime()));
    todayIdx = 3;
  }

  const keyOf = gran === 'day' ? dayKey : gran === 'week' ? weekKey : monthKey;
  if (mode === 'cognition') {
    const series: ChartSeries[] = [...RATING_META].reverse().map((rating) => {
      const data = new Array<number>(categories.length).fill(0);
      reviewLog.forEach((log) => {
        if (log.rating !== rating.rating) return;
        const index = keys.indexOf(keyOf(log.ts));
        if (index >= 0) data[index] += 1;
      });
      return { name: rating.label, color: rating.color, data };
    });
    if (todayIdx >= 0) {
      const todo = new Array<number>(categories.length).fill(0);
      todo[todayIdx] = todayPlanned;
      series.push({ name: '今日待学', color: 'var(--muted-foreground)', data: todo });
    }
    return { categories, series };
  }

  const reviewData = new Array<number>(categories.length).fill(0);
  reviewLog.forEach((log) => {
    const index = keys.indexOf(keyOf(log.ts));
    if (index >= 0) reviewData[index] += 1;
  });
  const newData = new Array<number>(categories.length).fill(0);
  Object.values(memory).forEach((item) => {
    if (!item.learnedAt) return;
    const index = keys.indexOf(keyOf(item.learnedAt));
    if (index >= 0) newData[index] += 1;
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

export default function ProgressPage() {
  const { t } = useI18n();
  const { progress, resetProgress } = useProgress();
  const { content } = useContent();
  const [tab, setTab] = useState<Tab>('curve');
  const [mode, setMode] = useState<StudyMode>('cognition');
  const [gran, setGran] = useState<Granularity>('day');
  const [cloudSession, setCloudSession] = useState(
    () => cloudAccountsEnabled && Boolean(localStorage.getItem('moran_token')),
  );

  useEffect(() => {
    const sync = () => setCloudSession(
      cloudAccountsEnabled && Boolean(localStorage.getItem('moran_token')),
    );
    sync();
    window.addEventListener('moran:auth-changed', sync);
    return () => window.removeEventListener('moran:auth-changed', sync);
  }, []);

  const allWordsMap = useMemo(
    () => buildAllWordsMap(content.books, content.coreWords),
    [content.books, content.coreWords],
  );
  const ids = useMemo(() => Object.keys(progress.memory), [progress.memory]);
  const todayStr = getTodayStr();
  const curve = useMemo(() => getForgettingCurve(progress.memory, ids), [progress.memory, ids]);
  const memorySummary = useMemo(() => summarizeMemory(progress.memory, ids), [progress.memory, ids]);
  const queue = useMemo(() => buildStudyQueue(progress.memory, ids), [progress.memory, ids]);
  const todayPlanned = queue.dueCount + queue.newCount;
  const todayLog = useMemo(
    () => progress.reviewLog.filter((log) => dayKey(log.ts) === todayStr),
    [progress.reviewLog, todayStr],
  );
  const todayRating = useMemo(() => {
    const counts = [0, 0, 0, 0];
    todayLog.forEach((log) => {
      counts[log.rating] += 1;
    });
    return counts;
  }, [todayLog]);
  const todaySeconds = progress.studyLog[todayStr] ?? 0;
  const persist = useMemo(() => buildPersistence(progress.memory, ids), [progress.memory, ids]);
  const studyChart = useMemo(
    () => buildStudyChart(progress.reviewLog, progress.memory, mode, gran, todayPlanned),
    [gran, mode, progress.memory, progress.reviewLog, todayPlanned],
  );
  const weakWords = memorySummary.weakIds
    .map((id) => {
      const word = allWordsMap[id];
      return word ? { ...word, lapses: progress.memory[id].lapses } : null;
    })
    .filter((item): item is (IVocabWord & { lapses: number }) => item !== null)
    .sort((a, b) => b.lapses - a.lapses);
  const strongWords = memorySummary.strongIds
    .map((id) => allWordsMap[id])
    .filter((word): word is IVocabWord => word !== undefined);
  const favorites = progress.favoriteWords
    .map((id) => allWordsMap[id])
    .filter((word): word is IVocabWord => word !== undefined);

  const persistRows = [
    { label: t('已加入记忆规划的全部单词'), value: persist.total, pct: null },
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
                {t('这将删除已学词汇、收藏、打卡和学习记录，且无法恢复。')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('取消')}</AlertDialogCancel>
              <AlertDialogAction onClick={resetProgress}>{t('确认清空')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="apple-segmented grid grid-cols-3">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            data-active={tab === item.key}
            className="apple-segment flex-1 px-1"
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'curve' && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-primary" /> {t('我的遗忘曲线')}
              </CardTitle>
              <CardDescription>{t('虚线是理论平均，实线是你实际记忆，点线是未来预测')}</CardDescription>
            </CardHeader>
            <CardContent><MemoryCurve curve={curve} /></CardContent>
          </Card>

          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: t('记得牢固'), value: memorySummary.masteredCount, icon: TrendingUp, color: 'text-success' },
              { label: t('学习中'), value: memorySummary.learningCount, icon: Brain, color: 'text-primary' },
              { label: t('记得不好'), value: weakWords.length, icon: AlertTriangle, color: 'text-destructive' },
              { label: t('待学习'), value: memorySummary.newCount, icon: BarChart3, color: 'text-foreground' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label}>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className={cn('mt-1 text-2xl font-bold', item.color)}>{item.value}</p>
                    <Icon className="mt-1 h-3.5 w-3.5 text-muted-foreground" />
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {weakWords.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" /> {t('记得不太好，建议重点复习')}
                </p>
                <div className="space-y-2.5">
                  {weakWords.map((word) => (
                    <div key={word.id} className="flex items-start justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold">{word.word}</p>
                        <p className="text-xs text-muted-foreground">{word.phonetic} · {word.pos} · {word.definition}</p>
                      </div>
                      <span className="shrink-0 rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                        {t('遗忘 {n} 次', { n: word.lapses })}
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
                  {strongWords.map((word) => (
                    <span key={word.id} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{word.word}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {tab === 'study' && (
        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-primary" /> {t('学习情况')}
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-border p-0.5">
                {([['cognition', t('认知情况')], ['review', t('复习新学')]] as [StudyMode, string][]).map(([key, label]) => (
                  <button key={key} onClick={() => setMode(key)} className={cn('rounded-md px-2.5 py-1 text-xs font-medium', mode === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex rounded-lg border border-border p-0.5">
                {([['day', t('按日')], ['week', t('按周')], ['month', t('按月')]] as [Granularity, string][]).map(([key, label]) => (
                  <button key={key} onClick={() => setGran(key)} className={cn('rounded-md px-2.5 py-1 text-xs font-medium', gran === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <StudyChart categories={studyChart.categories} series={studyChart.series} stack height={300} />
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 sm:grid-cols-6">
              {todayStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={cn('text-lg font-bold', stat.color)}>{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              {persistRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold">
                    {row.value}
                    {row.pct !== null && <span className="ml-1 text-xs text-muted-foreground">| {row.pct}%</span>}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
            {favorites.map((word) => (
              <Card key={word.id} className="p-0">
                <CardContent className="p-4">
                  <p className="font-bold tracking-tight">{word.word}</p>
                  <p className="text-xs text-muted-foreground">{word.phonetic} · {word.pos}</p>
                  <p className="mt-2 text-sm font-medium text-primary">{word.definition}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
