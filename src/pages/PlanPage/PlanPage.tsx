import { memo, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  RotateCcw,
} from 'lucide-react';
import { useProgress, getTodayStr } from '@/context/progress-context';
import { useSettings } from '@/context/settings-context';
import { useI18n } from '@/context/i18n-context';
import { useContent } from '@/context/content-context';
import { bookWords } from '@/data/books';
import { summarizeMemory } from '@/lib/memory';
import {
  buildDailyPlan,
  nextStudyTask,
  planCompletion,
  type StudyTask,
} from '@/lib/study-plan';
import { cn } from '@/lib/utils';
import AnimatedNumber from '@/components/AnimatedNumber';

const TASK_ICONS = {
  review: RotateCcw,
  'new-words': BookOpen,
};

type ActivityMap = Record<string, { newWords: number; reviews: number }>;

function PlanRing({ value }: { value: number }) {
  const { t } = useI18n();
  const size = 164;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={t('今日计划完成 {n}%', { n: value })}
        className="col-start-1 row-start-1 -rotate-90"
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
          strokeDashoffset={circumference - (value / 100) * circumference}
        />
      </svg>
      <div className="pointer-events-none col-start-1 row-start-1 flex flex-col items-center justify-center">
        <strong className="text-[36px] font-normal tabular-nums tracking-[-0.05em]">
          <AnimatedNumber value={value} suffix="%" />
        </strong>
        <span className="text-xs text-foreground/55">{t('今日完成')}</span>
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: StudyTask }) {
  const { t } = useI18n();
  const Icon = TASK_ICONS[task.id];

  return (
    <Link
      to={task.route}
      className="grid gap-4 rounded-[22px] bg-white/24 p-4 transition-colors hover:bg-white/36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 sm:grid-cols-[auto_minmax(0,1fr)_minmax(150px,0.4fr)_auto] sm:items-center"
    >
      <Icon className={cn('h-5 w-5', task.done ? 'text-primary' : 'text-foreground/55')} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium">{t(task.title)}</h2>
          {task.done && (
            <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[11px] text-primary">{t('已完成')}</span>
          )}
        </div>
        <p className="mt-1 text-xs leading-5 text-foreground/55">{t(task.description)}</p>
      </div>
      <div>
        <div className="flex items-end justify-between gap-3 text-xs">
          <span className="text-foreground/55">
            {task.target === 0 ? t('无需安排') : `${task.completed} / ${task.target} ${t(task.unit)}`}
          </span>
          <span className="flex items-center gap-1 text-foreground/45">
            <Clock3 className="h-3 w-3" />
            {t('{n} 分', { n: task.estimatedMinutes })}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/8">
          <div className="h-full rounded-full bg-primary" style={{ width: `${task.percent}%` }} />
        </div>
      </div>
      {task.done ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-primary" aria-label={t('已完成')}>
          <Check className="h-4 w-4" />
        </span>
      ) : (
        <span className="inline-flex min-h-10 items-center justify-center rounded-full bg-foreground/7 px-4 text-xs font-medium text-muted-foreground">
          {t('待完成')}
        </span>
      )}
    </Link>
  );
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const CalendarDay = memo(function CalendarDay({
  day,
  dateValue,
  hasActivity,
  selected,
  isToday,
  onSelect,
}: {
  day: number;
  dateValue: string;
  hasActivity: boolean;
  selected: boolean;
  isToday: boolean;
  onSelect: (key: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(dateValue)}
      aria-pressed={selected}
      className={cn(
        'relative flex h-7 w-full touch-manipulation items-center justify-center rounded-lg border text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 active:scale-[0.97]',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : isToday
            ? 'border-primary/40 bg-white/45 text-foreground'
            : hasActivity
              ? 'border-transparent bg-primary/7 text-foreground hover:bg-primary/12'
              : 'border-transparent text-foreground/65 hover:bg-white/40',
      )}
    >
      {day}
      {hasActivity && !selected && <span className="absolute bottom-0.5 h-0.5 w-0.5 rounded-full bg-primary" />}
    </button>
  );
});

function StudyCalendar({ dailyActivity }: { dailyActivity: ActivityMap }) {
  const { t, locale } = useI18n();
  const todayKey = getTodayStr();
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const initialDate = new Date(`${todayKey}T00:00:00`);
  const [viewDate, setViewDate] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }),
    [locale],
  );
  const selectedFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }),
    [locale],
  );
  const monthLabel = useMemo(() => monthFormatter.format(viewDate), [monthFormatter, viewDate]);
  const cells = useMemo(() => {
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const next: Array<number | null> = [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
    while (next.length % 7 !== 0) next.push(null);
    return next;
  }, [month, year]);
  const selectedLabel = useMemo(
    () => selectedFormatter.format(new Date(`${selectedKey}T00:00:00`)),
    [selectedFormatter, selectedKey],
  );
  const selectedActivity = dailyActivity[selectedKey] ?? { newWords: 0, reviews: 0 };

  const moveMonth = (delta: number) => {
    setViewDate(new Date(year, month + delta, 1));
  };

  const goToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedKey(todayKey);
  };
  const selectDay = useCallback((key: string) => setSelectedKey(key), []);

  return (
    <section className="app-glass rounded-[28px] p-3.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold">
          <CalendarDays className="h-4 w-4 text-primary" /> {t('学习日历')}
        </h2>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            aria-label={t('上个月')}
            className="grid h-7 w-7 place-items-center rounded-full text-foreground/55 hover:bg-white/50 hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[90px] text-center text-[11px] font-medium">{monthLabel}</span>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            aria-label={t('下个月')}
            className="grid h-7 w-7 place-items-center rounded-full text-foreground/55 hover:bg-white/50 hover:text-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-0.5 text-center text-[9px] font-medium text-muted-foreground">
        {['一', '二', '三', '四', '五', '六', '日'].map((day) => <span key={day} className="py-0.5">{t(day)}</span>)}
      </div>
      <div className="mt-0.5 grid grid-cols-7 gap-0.5">
        {cells.map((day, index) => {
          if (day == null) return <span key={`blank-${index}`} />;
          const key = dateKey(year, month, day);
          const activity = dailyActivity[key];
          const hasActivity = Boolean(activity && activity.newWords + activity.reviews > 0);
          return (
            <CalendarDay
              key={key}
              day={day}
              dateValue={key}
              hasActivity={hasActivity}
              selected={key === selectedKey}
              isToday={key === todayKey}
              onSelect={selectDay}
            />
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <button type="button" onClick={goToday} className="rounded-full bg-white/35 px-2 py-1 hover:bg-white/55 hover:text-foreground">
          {t('回到今天')}
        </button>
        <span className="truncate tabular-nums">
          {t('新词')} {selectedActivity.newWords} · {t('复习')} {selectedActivity.reviews}
        </span>
      </div>
      <p className="mt-1.5 min-w-0 truncate text-[10px] text-foreground/62">{selectedLabel}</p>
    </section>
  );
}

export default function PlanPage() {
  const { t, locale } = useI18n();
  const { progress, streakCount } = useProgress();
  const { settings } = useSettings();
  const { content } = useContent();
  const today = getTodayStr();
  const activity = useMemo(
    () => progress.dailyActivity[today] ?? { newWords: 0, reviews: 0 },
    [progress.dailyActivity, today],
  );
  const selectedBook = content.books.find((book) => book.id === settings.selectedBookId) ?? content.books[0];
  const currentWords = useMemo(
    () => selectedBook?.builtin && selectedBook.units?.length ? bookWords(selectedBook) : content.coreWords,
    [content.coreWords, selectedBook],
  );
  const memory = useMemo(
    () => summarizeMemory(progress.memory, currentWords.map((word) => word.id)),
    [progress.memory, currentWords],
  );
  const tasks = useMemo(
    () => buildDailyPlan({
      dueToday: memory.dueToday,
      dailyTarget: settings.dailyTarget,
      reviewsToday: activity.reviews,
      newWordsToday: activity.newWords,
    }),
    [memory.dueToday, settings.dailyTarget, activity],
  );
  const completion = planCompletion(tasks);
  const next = nextStudyTask(tasks);
  const minutes = Math.round((progress.studyLog[today] ?? 0) / 60);
  const dateLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());

  return (
    <div className="mx-auto w-full max-w-[1100px] pb-8 pt-6 md:pt-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="screen-title">{t('今日学习计划')}</h1>
          <p className="screen-lead mt-2">
            {dateLabel} · {t('按顺序完成，进度会随真实学习自动更新。')}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:flex sm:flex-wrap sm:items-center">
          <span className="rounded-full bg-white/24 px-3 py-1.5">{t('连续 {n} 天', { n: streakCount })}</span>
          <span className="rounded-full bg-white/24 px-3 py-1.5">{t('已学习 {n} 分钟', { n: minutes })}</span>
        </div>
      </header>

      <section className="mt-8 grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(270px,0.58fr)]">
        <div className="app-glass app-glass-strong rounded-[28px] p-6 md:p-7">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <PlanRing value={completion} />
            <div>
              <p className="text-sm text-foreground/55">{t('下一项')}</p>
              <h2 className="mt-2 text-2xl font-normal tracking-[-0.03em]">
                {next ? t(next.title) : t('今天的任务已经完成')}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/58">
                {next
                  ? t('{description}，预计 {n} 分钟。', { description: t(next.description), n: next.estimatedMinutes })
                  : t('可以继续自由复习，或查看今天的学习记录。')}
              </p>
              <Link
                to={next ? next.route : '/progress'}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary/10 px-4 text-xs font-semibold text-primary transition-colors hover:bg-primary/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
              >
                <Clock3 className="h-3.5 w-3.5" />
                {next ? t('继续学习') : t('查看学习记录')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
        <StudyCalendar dailyActivity={progress.dailyActivity} />
      </section>

      <section className="app-glass mt-4 rounded-[28px] p-4 md:p-6">
        <div className="mb-4 flex items-end justify-between gap-4 px-1">
          <div>
            <h2 className="text-base font-medium">{t('今天做什么')}</h2>
            <p className="mt-1 text-sm text-foreground/55">
              {t('{done} / {total} 项已完成', { done: tasks.filter((task) => task.done).length, total: tasks.length })}
            </p>
          </div>
          <span className="hidden text-xs text-foreground/45 sm:block">{t('完成量来自真实学习动作')}</span>
        </div>
        <div className="space-y-2">
          {tasks.map((task) => <TaskRow key={task.id} task={task} />)}
        </div>
      </section>
    </div>
  );
}
