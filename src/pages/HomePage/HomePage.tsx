import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Flame,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useProgress } from '@/context/progress-context';
import { useSettings } from '@/context/settings-context';
import { useI18n } from '@/context/i18n-context';
import { useContent } from '@/context/content-context';
import { bookWords } from '@/data/books';
import { homeGreetingKey } from '@/lib/home-greeting';
import { summarizeMemory } from '@/lib/memory';
import { predictDueNextDays } from '@/lib/srs/predict';
import { cn } from '@/lib/utils';
import AnimatedNumber from '@/components/AnimatedNumber';
import { useInView } from '@/hooks/use-in-view';
import { useAnimatedProgress } from '@/hooks/use-animated-progress';

type ForecastDay = {
  date: string;
  count: number;
};

function ProgressRing({
  value,
  size = 136,
  label,
  compact = false,
}: {
  value: number;
  size?: number;
  label: string;
  compact?: boolean;
}) {
  const stroke = compact ? 4 : 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      className="shrink-0 -rotate-90"
    >
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (progress / 100) * circumference}
        className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500"
      />
    </svg>
  );
}

function ForecastChart({ data }: { data: ForecastDay[] }) {
  const { t } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>();
  const progress = useAnimatedProgress(inView, 720);
  const max = Math.max(1, ...data.map((day) => day.count));
  const total = data.reduce((sum, day) => sum + day.count, 0);

  if (total === 0) {
    return (
      <div className="mt-6 flex min-h-40 flex-1 flex-col items-center justify-center rounded-[22px] border border-dashed border-border/70 bg-card/35 px-6 py-8 text-center">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
          <CalendarDays className="h-5 w-5" />
        </span>
        <p className="mt-3 text-sm font-medium">{t('未来 7 天暂无到期复习')}</p>
        <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
          {t('完成今天的新词后，这里会按记忆曲线显示每天的复习压力。')}
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="mt-6 grid h-44 grid-cols-7 items-end gap-2" role="img" aria-label={t('未来七天到期词汇柱状图')}>
      {data.map((day, index) => {
        const height = day.count > 0 ? Math.max(16, (day.count / max) * 100) : 3;
        return (
          <div key={day.date} className="flex min-w-0 flex-col items-center gap-2">
            <span className="h-4 text-xs tabular-nums text-foreground/58">
              {day.count > 0 ? <AnimatedNumber value={day.count} active={inView} duration={720} /> : ''}
            </span>
            <div className="flex h-24 w-full items-end">
              <div
                className={cn('w-full rounded-t-[4px]', index === 0 ? 'bg-primary' : 'bg-primary/38')}
                style={{ height: `${height * progress}%` }}
              />
            </div>
            <span className={cn('text-xs tabular-nums', index === 0 ? 'text-foreground' : 'text-foreground/55')}>
              {day.date}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { t, locale } = useI18n();
  const { progress, streakCount, todayCheckedIn } = useProgress();
  const { settings } = useSettings();
  const { content } = useContent();
  const selectedBook = content.books.find((book) => book.id === settings.selectedBookId) ?? content.books[0];
  const currentWords = useMemo(
    () => selectedBook?.builtin && selectedBook.units?.length ? bookWords(selectedBook) : content.coreWords,
    [content.coreWords, selectedBook],
  );
  const memorySummary = useMemo(
    () => summarizeMemory(progress.memory, currentWords.map((word) => word.id)),
    [progress.memory, currentWords],
  );
  const forecast = useMemo(() => predictDueNextDays(progress.memory, 7), [progress.memory]);
  const totalWords = currentWords.length;
  const mastered = memorySummary.masteredCount;
  const mastery = totalWords > 0 ? Math.round((mastered / totalWords) * 100) : 0;
  const wordStudyRoute = memorySummary.dueToday > 0 ? '/vocab?mode=review' : '/vocab?mode=new';
  const dateLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());
  const greeting = homeGreetingKey(new Date().getHours());
  const weekRows = useMemo(() => {
    const dayLabel = new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric' });
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const activity = progress.dailyActivity[key] ?? { newWords: 0, reviews: 0 };
      return {
        key,
        label: dayLabel.format(date),
        isToday: index === 6,
        ...activity,
        total: activity.newWords + activity.reviews,
      };
    });
  }, [locale, progress.dailyActivity]);
  const weekMax = Math.max(1, ...weekRows.map((day) => day.total));
  const weekTotal = weekRows.reduce((sum, day) => sum + day.total, 0);

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-8 pt-4 md:pt-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-display text-[27px] leading-[1.18] tracking-[-0.035em] text-foreground md:text-[32px]">
            {t(greeting)}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-7 text-foreground/62 md:text-base">
            {dateLabel} · {t('今天也从一个词开始，把记忆慢慢积累起来。')}
          </p>
        </div>
        <div className="app-glass app-glass-soft flex w-fit items-center gap-3 rounded-full px-4 py-2.5">
          <Flame className="h-4 w-4 text-primary" />
          <div className="pr-1">
            <p className="text-sm font-medium tabular-nums">{t('连续 {n} 天', { n: streakCount })}</p>
            <p className="text-xs text-foreground/55">
              {todayCheckedIn ? t('今天已完成打卡') : t('今天还差一次学习')}
            </p>
          </div>
        </div>
      </header>

      <section className="mt-5 grid items-stretch gap-4 lg:mt-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        <article className="app-glass app-glass-strong hero-glow h-full overflow-hidden rounded-[28px] p-5 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/72">
              <Sparkles className="h-4 w-4 text-primary" />
              {t('今日学习焦点')}
            </div>
            <Link
              to="/plan"
              className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm text-foreground/62 transition-colors hover:bg-primary/6 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
            >
              {t('今日计划')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid items-center gap-5 sm:grid-cols-[1fr_auto] sm:gap-7 lg:mt-8">
            <div>
              <p className="text-sm text-foreground/58">{selectedBook?.name ?? t('英语核心词汇')}</p>
              <div className="mt-2 flex items-end gap-3">
                <strong className="text-[40px] font-normal leading-none tracking-[-0.05em] tabular-nums">
                  <AnimatedNumber value={memorySummary.dueToday} />
                </strong>
                <span className="pb-1 text-base text-foreground/68">{t('个词待复习')}</span>
              </div>
              <p className="mt-4 max-w-lg text-[15px] leading-7 text-foreground/62">
                {memorySummary.dueToday > 0
                  ? t('先从到期词开始，完成这一轮后再学习新词。')
                  : t('今天没有到期复习。先完成 {n} 个新词，给记忆曲线一个新的起点。', { n: settings.dailyTarget })}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 lg:mt-6">
                <Link
                  to={wordStudyRoute}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:translate-y-0"
                >
                  {t('开始学习单词')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative mx-auto">
              <ProgressRing value={mastery} size={120} label={t('词汇掌握进度 {n}%', { n: mastery })} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <strong className="text-[27px] font-normal tabular-nums tracking-[-0.04em]">
                  <AnimatedNumber value={mastery} suffix="%" />
                </strong>
                <span className="text-xs text-foreground/55">{t('词汇掌握')}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 lg:mt-8">
            <div className="rounded-[16px] bg-white/28 px-3 py-3 text-center">
              <p className="text-xs text-foreground/55">{t('已掌握')}</p>
              <p className="mt-1 text-lg font-normal tabular-nums"><AnimatedNumber value={mastered} /></p>
            </div>
            <div className="rounded-[16px] bg-white/28 px-3 py-3 text-center">
              <p className="text-xs text-foreground/55">{t('学习中')}</p>
              <p className="mt-1 text-lg font-normal tabular-nums"><AnimatedNumber value={memorySummary.learningCount} /></p>
            </div>
            <div className="rounded-[16px] bg-white/28 px-3 py-3 text-center">
              <p className="text-xs text-foreground/55">{t('词库目标')}</p>
              <p className="mt-1 text-lg font-normal tabular-nums"><AnimatedNumber value={totalWords} /></p>
            </div>
          </div>
        </article>

        <article className="app-glass flex h-full flex-col rounded-[28px] p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-medium">{t('未来 7 天')}</h2>
              <p className="mt-1 text-sm text-foreground/55">{t('每天需要消化的到期词量')}</p>
            </div>
            <span className="rounded-full bg-white/38 px-3 py-1 text-xs tabular-nums text-foreground/62">
              {t('共 {n} 词', { n: forecast.reduce((sum, day) => sum + day.count, 0) })}
            </span>
          </div>
          <ForecastChart data={forecast} />
          <p className="mt-3 text-sm leading-6 text-foreground/58">
            {t('今天完成后，未来几天的复习压力会更均匀。')}
          </p>
        </article>

        <article className="app-glass h-full rounded-[28px] p-5 md:p-6">
          <h2 className="text-base font-medium">{t('学习状态')}</h2>
          <p className="mt-1 text-sm text-foreground/55">{t('今天的词汇学习概览')}</p>
          <div className="mt-5 space-y-2">
            <div className="flex min-h-[76px] items-center gap-4 rounded-[20px] bg-white/26 px-4 py-3">
              <BookOpen className="h-5 w-5 shrink-0 text-foreground/62" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{t('正在学习')}</span>
                <span className="mt-1 block truncate text-xs text-foreground/55">{selectedBook?.name ?? t('英语核心词汇')}</span>
              </span>
              <span className="text-sm tabular-nums text-primary">{mastery}%</span>
            </div>
            <div className="flex min-h-[76px] items-center gap-4 rounded-[20px] bg-white/26 px-4 py-3">
              <Heart className="h-5 w-5 shrink-0 text-foreground/62" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{t('收藏的难词')}</span>
                <span className="mt-1 block text-xs text-foreground/55">{t('集中复习还没有把握的词')}</span>
              </span>
              <span className="text-sm tabular-nums">{progress.favoriteWords.length}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="app-glass mt-4 rounded-[28px] p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-medium">{t('近 7 天学习明细')}</h2>
            <p className="mt-1 text-sm text-foreground/55">{t('新词与复习的每日分布')}</p>
          </div>
          <span className="rounded-full bg-white/38 px-3 py-1 text-xs tabular-nums text-foreground/62">
            {t('本周合计 {n} 项', { n: weekTotal })}
          </span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-y-1 text-left text-sm">
            <thead>
              <tr className="text-xs text-foreground/48">
                <th className="px-3 py-2 font-medium">{t('日期')}</th>
                <th className="px-3 py-2 text-right font-medium">{t('新词')}</th>
                <th className="px-3 py-2 text-right font-medium">{t('复习')}</th>
                <th className="px-3 py-2 font-medium">{t('学习量')}</th>
              </tr>
            </thead>
            <tbody>
              {weekRows.map((day) => (
                <tr key={day.key} className={day.isToday ? 'bg-primary/8' : 'bg-white/24'}>
                  <td className="px-3 py-2.5 font-medium">
                    {day.label}
                    {day.isToday && <span className="ml-2 rounded-full bg-primary/12 px-2 py-0.5 text-[10px] text-primary">{t('今天')}</span>}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{day.newWords}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{day.reviews}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 min-w-24 flex-1 overflow-hidden rounded-full bg-foreground/8">
                        <div
                          className="h-full rounded-full bg-primary/70"
                          style={{ width: `${Math.max(2, (day.total / weekMax) * 100)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs tabular-nums text-foreground/55">{day.total}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
