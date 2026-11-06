import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Flame,
  Heart,
  Sparkles,
  Target,
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

type WeekRow = {
  key: string;
  label: string;
  dayNumber: number;
  isToday: boolean;
  newWords: number;
  reviews: number;
  total: number;
};

function ProgressRing({
  value,
  size = 126,
  label,
}: {
  value: number;
  size?: number;
  label: string;
}) {
  const stroke = 6;
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
      className="h-[92px] w-[92px] shrink-0 -rotate-90 sm:h-[126px] sm:w-[126px]"
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

function WeeklyBars({
  rows,
  max,
}: {
  rows: WeekRow[];
  max: number;
}) {
  const { t } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>();
  const progress = useAnimatedProgress(inView, 720);

  return (
    <div ref={ref} className="weekly-bar" role="img" aria-label={t('近 7 天学习柱状图')}>
      {rows.map((day) => (
        <div key={day.key} data-today={day.isToday}>
          <span className="h-4 text-[10px] tabular-nums text-foreground/48">
            {day.total > 0 ? <AnimatedNumber value={day.total} active={inView} duration={720} /> : ''}
          </span>
          <div className="weekly-bar-track">
            <div
              className="weekly-bar-fill"
              style={{ height: `${day.total > 0 ? Math.max(8, (day.total / max) * 100) * progress : 0}%` }}
            />
          </div>
          <span className={cn('weekly-bar-label', day.isToday && 'font-medium text-foreground/72')}>
            {day.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ForecastRail({ data }: { data: ForecastDay[] }) {
  const { t } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>();
  const progress = useAnimatedProgress(inView, 640);
  const max = Math.max(1, ...data.map((day) => day.count));

  if (data.every((day) => day.count === 0)) {
    return (
      <div className="flex min-h-[118px] flex-col items-center justify-center rounded-[16px] border border-dashed border-foreground/10 px-4 text-center">
        <CalendarDays className="h-4 w-4 text-primary/70" />
        <p className="mt-2 text-xs font-medium">{t('未来 7 天暂无到期复习')}</p>
        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
          {t('完成今天的新词后，这里会显示每天的复习压力。')}
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="forecast-rail mt-5" role="img" aria-label={t('未来七天到期词汇柱状图')}>
      {data.map((day) => (
        <div key={day.date}>
          <span className="text-[10px] tabular-nums text-foreground/46">
            {day.count > 0 ? <AnimatedNumber value={day.count} active={inView} duration={640} /> : '0'}
          </span>
          <div className="forecast-rail-track">
            <span
              style={{ height: `${day.count > 0 ? Math.max(8, (day.count / max) * 100) * progress : 2}%` }}
            />
          </div>
          <span className="text-[9px] text-foreground/46">{day.date}</span>
        </div>
      ))}
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
  const mastery = totalWords > 0 ? Math.round((memorySummary.masteredCount / totalWords) * 100) : 0;
  const wordStudyRoute = memorySummary.dueToday > 0 ? '/vocab?mode=review' : '/vocab?mode=new';
  const dateLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());
  const greeting = homeGreetingKey(new Date().getHours());
  const weekRows = useMemo<WeekRow[]>(() => {
    const weekdayLabel = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const activity = progress.dailyActivity[key] ?? { newWords: 0, reviews: 0 };
      return {
        key,
        label: weekdayLabel.format(date),
        dayNumber: date.getDate(),
        isToday: index === 6,
        ...activity,
        total: activity.newWords + activity.reviews,
      };
    });
  }, [locale, progress.dailyActivity]);
  const weekMax = Math.max(1, ...weekRows.map((day) => day.total));
  const weekTotal = weekRows.reduce((sum, day) => sum + day.total, 0);
  const weekNewWords = weekRows.reduce((sum, day) => sum + day.newWords, 0);
  const weekReviews = weekRows.reduce((sum, day) => sum + day.reviews, 0);
  const weekAverage = Math.round(weekTotal / 7);
  const todayTotal = weekRows[6]?.total ?? 0;
  const todayNewWords = weekRows[6]?.newWords ?? 0;
  const todayReviews = weekRows[6]?.reviews ?? 0;
  const forecastTotal = forecast.reduce((sum, day) => sum + day.count, 0);

  return (
    <div className="mx-auto w-full max-w-[1340px] pb-10 pt-3 md:pt-6">
      <header className="dashboard-header flex flex-col gap-5 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-foreground/46">{dateLabel}</p>
          <h1 className="dashboard-display-title mt-3 text-balance text-[28px] leading-[1.12] text-foreground sm:text-[35px] md:text-[40px]">
            {t(greeting)}
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-6 text-foreground/54 md:text-sm">
            {t('今天也从一个词开始，把记忆慢慢积累起来。')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/60 bg-card/62 px-3.5 text-xs font-medium text-foreground/68 shadow-sm">
            <Flame className="h-3.5 w-3.5 text-primary" />
            {t('连续 {n} 天', { n: streakCount })}
          </span>
          <span className={cn(
            'inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-medium',
            todayCheckedIn
              ? 'border-primary/16 bg-primary/8 text-primary'
              : 'border-foreground/8 bg-card/54 text-foreground/55',
          )}>
            <span className={cn('h-1.5 w-1.5 rounded-full', todayCheckedIn ? 'bg-primary' : 'bg-foreground/24')} />
            {todayCheckedIn ? t('今天已完成打卡') : t('今天还差一次学习')}
          </span>
        </div>
      </header>

      <section className="grid items-stretch gap-3 lg:grid-cols-12">
        <article className="app-glass app-glass-strong dashboard-focus relative overflow-hidden rounded-[22px] p-5 md:p-7 lg:col-span-8">
          <span className="dashboard-focus-orbit" aria-hidden="true" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground/58">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t('今日学习焦点')}
            </div>
            <Link
              to="/plan"
              className="dashboard-action-quiet"
            >
              {t('今日计划')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:mt-7 sm:gap-7">
            <div>
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="truncate">{selectedBook?.name ?? t('英语核心词汇')}</span>
              </div>
              <div className="mt-3 flex items-end gap-2.5">
                <strong className="text-[50px] font-medium leading-none tracking-[-0.065em] tabular-nums md:text-[58px]">
                  <AnimatedNumber value={memorySummary.dueToday} />
                </strong>
                <span className="pb-2 text-sm text-foreground/54">{t('个词待复习')}</span>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-foreground/55">
                {memorySummary.dueToday > 0
                  ? t('先从到期词开始，完成这一轮后再学习新词。')
                  : t('今天没有到期复习。先完成 {n} 个新词，给记忆曲线一个新的起点。', { n: settings.dailyTarget })}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-1">
                <Link to={wordStudyRoute} className="dashboard-action">
                  {t('开始学习单词')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/progress" className="dashboard-action-quiet">
                  {t('查看学习记录')}
                </Link>
              </div>
            </div>

            <div className="dashboard-ring relative grid shrink-0 place-items-center sm:mr-2">
              <ProgressRing value={mastery} label={t('词汇掌握进度 {n}%', { n: mastery })} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <strong className="text-[21px] font-medium tabular-nums tracking-[-0.045em] sm:text-[27px]">
                  <AnimatedNumber value={mastery} suffix="%" />
                </strong>
                <span className="mt-0.5 text-[9px] text-foreground/50 sm:text-[10px]">{t('词汇掌握')}</span>
              </div>
            </div>
          </div>

          <div className="relative mt-7 grid grid-cols-3 border-t border-foreground/8 pt-5">
            {[
              { label: t('已掌握'), value: memorySummary.masteredCount },
              { label: t('学习中'), value: memorySummary.learningCount },
              { label: t('词库目标'), value: totalWords },
            ].map((item, index) => (
              <div
                key={item.label}
                className={cn('px-1 text-center sm:text-left', index > 0 && 'border-l border-foreground/8 sm:pl-5')}
              >
                <p className="text-[10px] text-foreground/44">{item.label}</p>
                <p className="mt-1 text-lg font-medium tabular-nums tracking-[-0.03em]">
                  <AnimatedNumber value={item.value} />
                </p>
              </div>
            ))}
          </div>
        </article>

        <aside className="app-glass flex flex-col rounded-[18px] p-5 lg:col-span-4">
          <div className="clean-panel-head">
            <div>
              <h2 className="text-sm font-semibold">{t('今日概览')}</h2>
              <p className="mt-1 text-[11px] text-foreground/46">{t('真实学习数据')}</p>
            </div>
            <span className="rounded-full bg-primary/7 px-2.5 py-1 text-[10px] font-medium text-primary">
              {todayCheckedIn ? t('已完成') : t('进行中')}
            </span>
          </div>

          <div className="week-date-strip mt-4" aria-label={t('近 7 天学习')}>
            {weekRows.map((day) => (
              <div key={day.key} className="week-date-cell flex-col" data-today={day.isToday}>
                <span className="text-[8px] leading-none">{day.label}</span>
                <span className="mt-1 text-sm font-semibold leading-none tabular-nums">{day.dayNumber}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex-1">
            <div className="dashboard-list-row">
              <span className="dashboard-list-icon"><BookOpen className="h-3.5 w-3.5" /></span>
              <span className="min-w-0">
                <span className="block text-[10px] text-foreground/42">{t('当前词书')}</span>
                <span className="mt-0.5 block truncate text-xs font-medium">{selectedBook?.name ?? t('英语核心词汇')}</span>
              </span>
              <span className="dashboard-value text-xs font-semibold text-primary">{mastery}%</span>
            </div>
            <div className="dashboard-list-row">
              <span className="dashboard-list-icon"><Target className="h-3.5 w-3.5" /></span>
              <span className="min-w-0">
                <span className="block text-[10px] text-foreground/42">{t('待复习')}</span>
                <span className="mt-0.5 block text-xs font-medium">{t('今天优先完成')}</span>
              </span>
              <span className="dashboard-value text-sm font-semibold">{memorySummary.dueToday}</span>
            </div>
            <div className="dashboard-list-row">
              <span className="dashboard-list-icon"><CheckCircle2 className="h-3.5 w-3.5" /></span>
              <span className="min-w-0">
                <span className="block text-[10px] text-foreground/42">{t('今日完成')}</span>
                <span className="mt-0.5 block text-xs font-medium">{todayNewWords} {t('新词')} / {todayReviews} {t('复习')}</span>
              </span>
              <span className="dashboard-value text-sm font-semibold">{todayTotal}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-foreground/7 pt-3 text-[10px] text-foreground/46">
            <span className="flex items-center gap-1.5">
              <Heart className="h-3 w-3 text-primary/70" />
              {t('收藏的难词')} {progress.favoriteWords.length}
            </span>
            <span>{t('每日目标')} {settings.dailyTarget}</span>
          </div>
        </aside>
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <article className="dashboard-kpi">
          <p className="dashboard-kpi-label">{t('近 7 天学习')}</p>
          <p className="dashboard-kpi-value"><AnimatedNumber value={weekTotal} /></p>
          <p className="dashboard-kpi-note">{t('本周合计 {n} 项', { n: weekTotal })}</p>
          <div className="dashboard-kpi-chart" aria-hidden="true">
            {weekRows.map((day) => (
              <span
                key={day.key}
                data-active={day.isToday}
                style={{ height: `${Math.max(8, (day.total / weekMax) * 100)}%` }}
              />
            ))}
          </div>
        </article>

        <article className="dashboard-kpi">
          <p className="dashboard-kpi-label">{t('今日完成')}</p>
          <p className="dashboard-kpi-value"><AnimatedNumber value={todayTotal} /></p>
          <p className="dashboard-kpi-note">{t('新词')} {todayNewWords} · {t('复习')} {todayReviews}</p>
          <div className="dashboard-kpi-chart" aria-hidden="true">
            {weekRows.slice(-3).flatMap((day) => [
              <span key={`${day.key}-new`} data-active={day.isToday} style={{ height: `${Math.max(8, (day.newWords / weekMax) * 100)}%` }} />,
              <span key={`${day.key}-review`} style={{ height: `${Math.max(8, (day.reviews / weekMax) * 100)}%`, background: 'color-mix(in srgb, var(--data-accent) 28%, transparent)' }} />,
            ])}
          </div>
        </article>

        <article className="dashboard-kpi">
          <p className="dashboard-kpi-label">{t('词汇掌握')}</p>
          <p className="dashboard-kpi-value"><AnimatedNumber value={mastery} suffix="%" /></p>
          <p className="dashboard-kpi-note">{t('已掌握')} {memorySummary.masteredCount} / {totalWords}</p>
          <div className="absolute inset-x-4 bottom-7 h-1 overflow-hidden rounded-full bg-foreground/7">
            <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.max(2, mastery)}%` }} />
          </div>
        </article>

        <article className="dashboard-kpi">
          <p className="dashboard-kpi-label">{t('本周日均')}</p>
          <p className="dashboard-kpi-value"><AnimatedNumber value={weekAverage} /></p>
          <p className="dashboard-kpi-note">{weekNewWords} {t('新词')} · {weekReviews} {t('复习')}</p>
          <div className="dashboard-kpi-chart" aria-hidden="true">
            {forecast.map((day, index) => (
              <span
                key={day.date}
                data-active={index === 0}
                style={{ height: `${Math.max(8, (day.count / Math.max(1, forecastTotal)) * 100)}%`, background: 'color-mix(in srgb, var(--data-accent) 22%, transparent)' }}
              />
            ))}
          </div>
        </article>
      </section>

      <section className="mt-3 grid gap-3 lg:grid-cols-12">
        <article className="app-glass rounded-[18px] p-5 md:p-6 lg:col-span-8">
          <div className="clean-panel-head">
            <div>
              <h2 className="text-sm font-semibold">{t('近 7 天学习节奏')}</h2>
              <p className="mt-1 text-[11px] text-foreground/46">{t('新词与复习的每日分布')}</p>
            </div>
            <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-[10px] tabular-nums text-foreground/52">
              {t('本周合计 {n} 项', { n: weekTotal })}
            </span>
          </div>
          <WeeklyBars rows={weekRows} max={weekMax} />
          <div className="mt-4 grid grid-cols-3 border-t border-foreground/7 pt-4">
            <div>
              <p className="text-[10px] text-foreground/42">{t('新词')}</p>
              <p className="mt-1 text-sm font-medium tabular-nums">{weekNewWords}</p>
            </div>
            <div className="border-l border-foreground/7 pl-4">
              <p className="text-[10px] text-foreground/42">{t('复习')}</p>
              <p className="mt-1 text-sm font-medium tabular-nums">{weekReviews}</p>
            </div>
            <div className="border-l border-foreground/7 pl-4">
              <p className="text-[10px] text-foreground/42">{t('日均')}</p>
              <p className="mt-1 text-sm font-medium tabular-nums">{weekAverage}</p>
            </div>
          </div>
        </article>

        <article className="app-glass rounded-[18px] p-5 md:p-6 lg:col-span-4">
          <div className="clean-panel-head">
            <div>
              <h2 className="text-sm font-semibold">{t('未来 7 天')}</h2>
              <p className="mt-1 text-[11px] text-foreground/46">{t('到期词预测')}</p>
            </div>
            <span className="dashboard-value text-lg font-medium text-primary">{forecastTotal}</span>
          </div>
          <ForecastRail data={forecast} />
          <p className="mt-4 border-t border-foreground/7 pt-3 text-[11px] leading-5 text-foreground/50">
            {t('每天需要消化的到期词量')}
          </p>
        </article>
      </section>
    </div>
  );
}
