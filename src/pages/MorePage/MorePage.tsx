import { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Flame,
  Headphones,
  LayoutGrid,
  Library,
  Palette,
  PenLine,
  Settings2,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useProgress, getTodayStr } from '@/context/progress-context';
import { useSettings } from '@/context/settings-context';
import { useContent } from '@/context/content-context';
import { bookWords } from '@/data/books';
import type { VocabBook } from '@/data/books';
import type { IVocabWord } from '@/data/words';
import { summarizeMemory } from '@/lib/memory';
import { buildDailyPlan, nextStudyTask, planCompletion } from '@/lib/study-plan';
import { THEMES, WALLPAPERS } from '@/lib/appearance';
import { cn } from '@/lib/utils';
import {
  SilentBarList,
  SilentLineChart,
  SilentPanel,
} from '@/components/SilentCharts';

type SectionKey = '' | 'books' | 'listening' | 'progress' | 'appearance';
type Activity = {
  newWords: number;
  reviews: number;
  listening: number;
  questions: number;
};

const MORE_SECTIONS: Array<{ key: SectionKey; label: string; icon: LucideIcon; to: string }> = [
  { key: '', label: '总览', icon: LayoutGrid, to: '/more' },
  { key: 'books', label: '词书', icon: Library, to: '/more/books' },
  { key: 'listening', label: '听力', icon: Headphones, to: '/more/listening' },
  { key: 'progress', label: '记录', icon: BarChart3, to: '/more/progress' },
  { key: 'appearance', label: '外观', icon: Palette, to: '/more/appearance' },
];

const EMPTY_ACTIVITY: Activity = { newWords: 0, reviews: 0, listening: 0, questions: 0 };

function buildRecentDays(activity: Record<string, Activity>, count: number) {
  const formatter = new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric' });
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const day = activity[key] ?? EMPTY_ACTIVITY;
    return {
      key,
      label: formatter.format(date),
      short: `${date.getMonth() + 1}/${date.getDate()}`,
      isToday: index === count - 1,
      ...day,
      total: day.newWords + day.reviews + day.questions,
    };
  });
}

function MiniRail({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav
      className={mobile ? 'more-rail-mobile' : 'more-rail hidden lg:flex'}
      aria-label={mobile ? '更多分区快捷导航' : '更多分区导航'}
    >
      {MORE_SECTIONS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.key === ''}
            title={item.label}
            aria-label={item.label}
            className={({ isActive }) => cn('more-rail-link', isActive && 'is-active')}
          >
            <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function KpiStrip({
  items,
}: {
  items: Array<{ label: string; value: string | number; hint?: string }>;
}) {
  return (
    <div className="silent-kpi-strip">
      {items.map((item) => (
        <div key={item.label} className="silent-kpi">
          <p className="silent-kpi-label">{item.label}</p>
          <p className="silent-kpi-value">{item.value}</p>
          {item.hint && <p className="mt-1 text-[11px] text-muted-foreground">{item.hint}</p>}
        </div>
      ))}
    </div>
  );
}

function SectionHeading({
  title,
  description,
  to,
  actionLabel,
}: {
  title: string;
  description: string;
  to: string;
  actionLabel: string;
}) {
  return (
    <header className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="screen-title">{title}</h1>
        <p className="screen-lead mt-2">{description}</p>
      </div>
      <Link to={to} className="silent-link w-fit">
        {actionLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </header>
  );
}

function ModuleTable({
  rows,
}: {
  rows: Array<{
    label: string;
    detail: string;
    value: string;
    to: string;
    direct: string;
    icon: LucideIcon;
  }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="silent-table min-w-[620px]">
        <thead>
          <tr>
            <th>学习模块</th>
            <th className="num">当前</th>
            <th className="num">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <tr key={row.label}>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground/58">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{row.label}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{row.detail}</span>
                    </span>
                  </div>
                </td>
                <td className="num text-sm">{row.value}</td>
                <td className="num">
                  <Link to={row.to} className="silent-link">
                    查看
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MoreOverview({
  content,
  progress,
  currentWords,
  selectedBook,
  memorySummary,
  totalWordCount,
  recent7,
  recent14,
  plan,
  nextTask,
  completion,
  correctness,
  streakCount,
  todayCheckedIn,
  examDays,
}: {
  content: ReturnType<typeof useContent>['content'];
  progress: ReturnType<typeof useProgress>['progress'];
  currentWords: IVocabWord[];
  selectedBook: VocabBook | undefined;
  memorySummary: ReturnType<typeof summarizeMemory>;
  totalWordCount: number;
  recent7: ReturnType<typeof buildRecentDays>;
  recent14: ReturnType<typeof buildRecentDays>;
  plan: ReturnType<typeof buildDailyPlan>;
  nextTask: ReturnType<typeof nextStudyTask>;
  completion: number;
  correctness: number;
  streakCount: number;
  todayCheckedIn: boolean;
  examDays: number | null;
}) {
  const mastery = currentWords.length
    ? Math.round((memorySummary.masteredCount / currentWords.length) * 100)
    : 0;
  const listeningPercent = content.listeningSets.length
    ? Math.round((progress.listeningDone.length / content.listeningSets.length) * 100)
    : 0;
  const completedTasks = plan.filter((task) => task.done).length;
  const weekTotal = recent7.reduce((sum, day) => sum + day.total, 0);
  const weekMax = Math.max(1, ...recent7.map((day) => day.total));
  const moduleRows = [
    {
      label: '词书库',
      detail: `${content.books.length} 本 · ${totalWordCount.toLocaleString('zh-CN')} 词`,
      value: `${mastery}%`,
      to: '/more/books',
      direct: '/books',
      icon: Library,
    },
    {
      label: '听力真题',
      detail: `${progress.listeningDone.length} / ${content.listeningSets.length} 套已完成`,
      value: `${listeningPercent}%`,
      to: '/more/listening',
      direct: '/listening',
      icon: Headphones,
    },
    {
      label: '真题与刷题',
      detail: `${content.examSets.length} 套真题 · 累计作答`,
      value: `${correctness}%`,
      to: '/more/progress',
      direct: '/practice',
      icon: PenLine,
    },
    {
      label: '学习记录',
      detail: `${progress.reviewLog.length} 次复习记录`,
      value: `${streakCount} 天`,
      to: '/more/progress',
      direct: '/progress',
      icon: BarChart3,
    },
    {
      label: '外观与设置',
      detail: '主题、壁纸、玻璃透明度与账号设置',
      value: '设置',
      to: '/more/appearance',
      direct: '/settings',
      icon: Settings2,
    },
  ];

  return (
    <div className="space-y-4">
      <section className="silent-hero p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-end">
          <div>
            <h1 className="text-[32px] font-normal leading-[1.1] tracking-[-0.05em] text-white md:text-[38px]">
              更多
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-7 text-white/64">
              词书、听力、记录与外观都在这里。先看今天的节奏，再选一条继续。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/study" className="silent-primary">
                <Sparkles className="h-4 w-4" />
                继续今日学习
              </Link>
              <Link to="/plan" className="silent-ghost">
                <CalendarDays className="h-4 w-4" />
                查看今日计划
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/48">
              <span className="inline-flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" />
                连续 {streakCount} 天
              </span>
              <span>{todayCheckedIn ? '今天已完成打卡' : '今天还差一次学习'}</span>
              {examDays !== null && <span>距考试 {examDays} 天</span>}
              <span>当前词书：{selectedBook?.name ?? '六级核心词汇'}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-0 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4">
            {[
              ['词书', content.books.length],
              ['听力', content.listeningSets.length],
              ['真题', content.examSets.length],
            ].map(([label, value], index) => (
              <div key={label} className={index === 0 ? 'min-w-0' : 'silent-hero-metric'}>
                <p className="text-[11px] text-white/46">{label}</p>
                <p className="mt-1 text-[28px] font-normal leading-none tracking-[-0.04em] text-white tabular-nums">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KpiStrip
        items={[
          { label: '今日待复习', value: memorySummary.dueToday, hint: '到期词优先' },
          { label: '当前词书掌握', value: `${mastery}%`, hint: `${memorySummary.masteredCount} / ${currentWords.length || 0} 词` },
          { label: '练习正确率', value: `${correctness}%`, hint: '全部题型累计' },
          { label: '今日完成', value: `${completion}%`, hint: `${completedTasks} / ${plan.length} 项任务` },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
        <SilentPanel
          title="近 14 天学习曲线"
          description="新词、复习与题量合计，不含听力套数"
          action={<span className="text-xs text-muted-foreground">本周 {weekTotal} 项</span>}
        >
          <SilentLineChart
            points={recent14.map((day) => ({ label: day.short, value: day.total }))}
            height={220}
            ariaLabel="近十四天学习量折线图"
          />
          <div className="mt-3 flex items-center justify-between border-t border-foreground/7 pt-3 text-xs text-muted-foreground">
            <span>最高单日 {Math.max(...recent14.map((day) => day.total))} 项</span>
            <span>今天 {recent14[recent14.length - 1]?.total ?? 0} 项</span>
          </div>
        </SilentPanel>

        <SilentPanel title="模块完成度" description="四条线决定今天的学习节奏">
          <SilentBarList
            rows={[
              { label: '词汇掌握', value: mastery, detail: `${memorySummary.masteredCount} 个长期记忆` },
              { label: '听力完成', value: listeningPercent, detail: `${progress.listeningDone.length} / ${content.listeningSets.length} 套` },
              { label: '练习正确率', value: correctness, detail: '阅读、翻译与写作' },
              { label: '今日计划', value: completion, detail: `${completedTasks} / ${plan.length} 项` },
            ]}
            max={100}
            suffix="%"
          />
        </SilentPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <SilentPanel title="学习模块" description="从总览进入二级页面，或直接打开完整功能">
          <ModuleTable rows={moduleRows} />
        </SilentPanel>

        <SilentPanel
          title="今日重点"
          description={nextTask ? `下一项预计 ${nextTask.estimatedMinutes} 分钟` : '今天的任务已经完成'}
          action={
            <Link to="/study" className="silent-link">
              学习台
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="rounded-[20px] bg-foreground/[0.035] p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {nextTask ? <Target className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{nextTask?.title ?? '今天已完成'}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {nextTask?.description ?? '可以自由复习，或查看今天的学习记录。'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3 text-xs text-muted-foreground">
              <span>{nextTask ? `${nextTask.completed} / ${nextTask.target} ${nextTask.unit}` : '全部完成'}</span>
              <span className="inline-flex items-center gap-1">
                <Timer className="h-3.5 w-3.5" />
                {nextTask?.estimatedMinutes ?? 0} 分
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/8">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${nextTask?.percent ?? 100}%` }}
              />
            </div>
          </div>

          <div className="silent-day-strip mt-4">
            {recent7.map((day) => (
              <div key={day.key} className={cn('silent-day-cell', day.isToday && 'is-today')}>
                <p className="text-[10px] opacity-65">{day.isToday ? '今天' : day.short}</p>
                <p className="mt-1 text-sm font-medium tabular-nums">{day.total}</p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/8">
                  <div
                    className="h-full rounded-full bg-primary/65"
                    style={{ width: `${Math.max(day.total > 0 ? 8 : 0, (day.total / weekMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SilentPanel>
      </div>
    </div>
  );
}

function BooksSection({
  booksWithWords,
  selectedBook,
  masterSummary,
  currentWordCount,
}: {
  booksWithWords: Array<{ book: VocabBook; words: number; learned: number }>;
  selectedBook: VocabBook | undefined;
  masterSummary: ReturnType<typeof summarizeMemory>;
  currentWordCount: number;
}) {
  const { setSelectedBook } = useSettings();
  const navigate = useNavigate();
  const [stage, setStage] = useState('全部');
  const stages = ['全部', ...Array.from(new Set(booksWithWords.map((row) => row.book.stage)))];
  const filtered = booksWithWords.filter((row) => stage === '全部' || row.book.stage === stage);
  const topBooks = [...booksWithWords].sort((a, b) => b.words - a.words).slice(0, 6);
  const mastery = currentWordCount
    ? Math.round((masterSummary.masteredCount / currentWordCount) * 100)
    : 0;

  const openBook = (book: VocabBook) => {
    if (book.builtin && book.units?.length) {
      setSelectedBook(book);
      navigate(`/book/${book.id}`);
      return;
    }
    navigate('/books');
  };

  return (
    <div className="space-y-4">
      <SectionHeading
        title="词书库"
        description="按阶段查看词量、单元与真实学习进度。"
        to="/books"
        actionLabel="打开完整词书库"
      />
      <KpiStrip
        items={[
          { label: '词书总数', value: booksWithWords.length, hint: '覆盖小学到考研' },
          { label: '总词量', value: booksWithWords.reduce((sum, row) => sum + row.words, 0).toLocaleString('zh-CN'), hint: '按词书去重前合计' },
          { label: '当前词书', value: selectedBook?.name ?? '未选择', hint: `${currentWordCount} 词` },
          { label: '当前掌握', value: `${mastery}%`, hint: `${masterSummary.masteredCount} 词已长期记忆` },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <SilentPanel title="词量分布" description="词量最大的六本词书">
          <SilentBarList
            rows={topBooks.map((row) => ({
              label: row.book.name,
              value: row.words,
              detail: row.book.stage,
            }))}
            suffix=" 词"
          />
        </SilentPanel>

        <SilentPanel
          title="词书明细"
          description={`${filtered.length} 本符合当前筛选`}
          action={<span className="text-xs text-muted-foreground">点击行进入学习</span>}
        >
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {stages.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStage(item)}
                className={cn('silent-chip', stage === item && 'is-active')}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="silent-table min-w-[560px]">
              <thead>
                <tr>
                  <th>词书</th>
                  <th>阶段</th>
                  <th className="num">词量</th>
                  <th className="num">已学</th>
                  <th className="num">进度</th>
                  <th className="num">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 10).map((row) => {
                  const progressPercent = row.words > 0 ? Math.round((row.learned / row.words) * 100) : 0;
                  return (
                    <tr key={row.book.id} className="cursor-pointer" onClick={() => openBook(row.book)}>
                      <td>
                        <span className="block max-w-[180px] truncate font-medium">{row.book.name}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {row.book.builtin ? `${row.book.units?.length ?? 0} 个单元` : '词库'}
                        </span>
                      </td>
                      <td className="text-xs text-muted-foreground">{row.book.stage}</td>
                      <td className="num">{row.words}</td>
                      <td className="num">{row.learned}</td>
                      <td className="num">{progressPercent}%</td>
                      <td className="num">
                        <span className="silent-link">
                          进入
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">这个阶段还没有词书。</p>
          )}
        </SilentPanel>
      </div>
    </div>
  );
}

function ListeningSection({
  content,
  progress,
}: {
  content: ReturnType<typeof useContent>['content'];
  progress: ReturnType<typeof useProgress>['progress'];
}) {
  const setRows = content.listeningSets.map((set) => ({
    set,
    questions: set.sections.reduce((sum, section) => sum + section.questions.length, 0),
    done: progress.listeningDone.includes(set.id),
  }));
  const totalQuestions = setRows.reduce((sum, row) => sum + row.questions, 0);
  const doneCount = setRows.filter((row) => row.done).length;

  return (
    <div className="space-y-4">
      <SectionHeading
        title="听力"
        description="按套查看听力结构、题量与完成状态。"
        to="/listening"
        actionLabel="打开听力训练"
      />
      <KpiStrip
        items={[
          { label: '套题总数', value: setRows.length, hint: '六级听力真题' },
          { label: '已完成', value: doneCount, hint: `${setRows.length ? Math.round((doneCount / setRows.length) * 100) : 0}%` },
          { label: '总题量', value: totalQuestions, hint: 'Section A / B / C' },
          { label: '平均每套', value: setRows.length ? Math.round(totalQuestions / setRows.length) : 0, hint: '题' },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <SilentPanel title="题量分布" description="每套听力包含的题目数量">
          <SilentBarList
            rows={setRows.map((row) => ({
              label: row.set.title,
              value: row.questions,
              detail: `${row.set.sections.length} 个 Section`,
            }))}
            suffix=" 题"
          />
        </SilentPanel>

        <SilentPanel title="听力套题" description={`${doneCount} / ${setRows.length} 套已完成`}>
          <div className="overflow-x-auto">
            <table className="silent-table min-w-[540px]">
              <thead>
                <tr>
                  <th>套题</th>
                  <th>年份</th>
                  <th className="num">Section</th>
                  <th className="num">题量</th>
                  <th className="num">状态</th>
                </tr>
              </thead>
              <tbody>
                {setRows.map((row) => (
                  <tr key={row.set.id}>
                    <td>
                      <span className="block max-w-[220px] truncate font-medium">{row.set.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{row.set.session}</span>
                    </td>
                    <td className="text-xs text-muted-foreground">{row.set.year}</td>
                    <td className="num">{row.set.sections.length}</td>
                    <td className="num">{row.questions}</td>
                    <td className="num">
                      <span className={cn('silent-chip', row.done && 'is-active')}>
                        {row.done ? '已完成' : '未开始'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SilentPanel>
      </div>
    </div>
  );
}

function ProgressSection({
  recent7,
  recent14,
  memorySummary,
  weakWords,
  streakCount,
  correctness,
  todayMinutes,
}: {
  recent7: ReturnType<typeof buildRecentDays>;
  recent14: ReturnType<typeof buildRecentDays>;
  memorySummary: ReturnType<typeof summarizeMemory>;
  weakWords: Array<IVocabWord & { lapses: number }>;
  streakCount: number;
  correctness: number;
  todayMinutes: number;
}) {
  const weekTotal = recent7.reduce((sum, day) => sum + day.total, 0);
  return (
    <div className="space-y-4">
      <SectionHeading
        title="学习记录"
        description="把每天的复习、听力和题量收进一条可回看的线。"
        to="/progress"
        actionLabel="打开完整学习记录"
      />
      <KpiStrip
        items={[
          { label: '连续学习', value: `${streakCount} 天`, hint: '从今天向前计算' },
          { label: '长期记忆', value: memorySummary.masteredCount, hint: `学习中 ${memorySummary.learningCount}` },
          { label: '练习正确率', value: `${correctness}%`, hint: '全部题型累计' },
          { label: '今日学习', value: `${todayMinutes} 分`, hint: '本机记录' },
        ]}
      />

      <SilentPanel
        title="近 14 天学习量"
        description="新词 + 复习 + 题量"
        action={<span className="text-xs text-muted-foreground">本周 {weekTotal} 项</span>}
      >
        <SilentLineChart
          points={recent14.map((day) => ({ label: day.short, value: day.total }))}
          height={230}
          ariaLabel="近十四天学习量折线图"
        />
      </SilentPanel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <SilentPanel title="最近 7 天明细" description="每天的真实学习动作">
          <div className="overflow-x-auto">
            <table className="silent-table min-w-[560px]">
              <thead>
                <tr>
                  <th>日期</th>
                  <th className="num">新词</th>
                  <th className="num">复习</th>
                  <th className="num">听力</th>
                  <th className="num">题量</th>
                  <th className="num">合计</th>
                </tr>
              </thead>
              <tbody>
                {recent7.map((day) => (
                  <tr key={day.key}>
                    <td className={day.isToday ? 'font-medium text-primary' : ''}>
                      {day.isToday ? '今天' : day.label}
                    </td>
                    <td className="num">{day.newWords}</td>
                    <td className="num">{day.reviews}</td>
                    <td className="num">{day.listening}</td>
                    <td className="num">{day.questions}</td>
                    <td className="num font-medium">{day.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SilentPanel>

        <SilentPanel title="薄弱词" description="按遗忘次数排序">
          {weakWords.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">还没有明显薄弱的词。</p>
          ) : (
            <div className="space-y-3">
              {weakWords.slice(0, 6).map((word) => (
                <div key={word.id} className="flex items-start justify-between gap-3 border-b border-foreground/7 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-medium">{word.word}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {word.phonetic} · {word.definition}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-destructive">遗忘 {word.lapses} 次</span>
                </div>
              ))}
            </div>
          )}
        </SilentPanel>
      </div>
    </div>
  );
}

function AppearanceSection() {
  const { settings, setTheme, setWallpaper, setGlassOpacity } = useSettings();
  const currentTheme = THEMES.find((theme) => theme.id === settings.theme) ?? THEMES[0];
  const currentWallpaper = WALLPAPERS.find((wallpaper) => wallpaper.id === settings.wallpaper) ?? WALLPAPERS[0];

  return (
    <div className="space-y-4">
      <SectionHeading
        title="外观"
        description="深青底、柔光层与低饱和数据色，跟随你的学习场景切换。"
        to="/settings"
        actionLabel="打开完整设置"
      />
      <KpiStrip
        items={[
          { label: '当前主题', value: currentTheme.name, hint: currentTheme.description },
          { label: '当前壁纸', value: currentWallpaper.name, hint: currentWallpaper.description },
          { label: '玻璃透明度', value: `${settings.glassOpacity}%`, hint: '影响内容面板的透光' },
          { label: '本机保存', value: '已同步', hint: '修改会立即生效' },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SilentPanel title="界面风格" description="颜色与数据强调色会随风格变化">
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setTheme(theme.id)}
                aria-pressed={settings.theme === theme.id}
                className={cn('silent-wallpaper-card', settings.theme === theme.id && 'is-active')}
              >
                <span className={cn('theme-swatch', `theme-swatch-${theme.id}`)} />
                <span>
                  <span className="block text-sm font-medium">{theme.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{theme.description}</span>
                </span>
              </button>
            ))}
          </div>
        </SilentPanel>

        <SilentPanel title="壁纸" description="十二套场景，保持文字与数据的清晰度">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {WALLPAPERS.map((wallpaper) => (
              <button
                key={wallpaper.id}
                type="button"
                onClick={() => setWallpaper(wallpaper.id)}
                aria-pressed={settings.wallpaper === wallpaper.id}
                className={cn('silent-wallpaper-card', settings.wallpaper === wallpaper.id && 'is-active')}
              >
                <span
                  className="wallpaper-preview h-16 rounded-xl border border-white/55"
                  data-wallpaper={wallpaper.id}
                  aria-hidden="true"
                />
                <span className="block truncate text-xs font-medium">{wallpaper.name}</span>
              </button>
            ))}
          </div>
        </SilentPanel>
      </div>

      <SilentPanel title="玻璃透明度" description="透明度越高，内容面板越清晰">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center">
          <input
            type="range"
            min="20"
            max="90"
            step="1"
            value={settings.glassOpacity}
            onChange={(event) => setGlassOpacity(Number(event.target.value))}
            aria-label="玻璃透明度"
            className="glass-opacity-range w-full"
          />
          <div className="silent-hero flex items-center justify-between rounded-[20px] px-4 py-3">
            <span className="text-xs text-white/64">当前预览</span>
            <span className="text-sm font-medium tabular-nums text-white">{settings.glassOpacity}%</span>
          </div>
        </div>
      </SilentPanel>
    </div>
  );
}

export default function MorePage() {
  const { section } = useParams<{ section?: string }>();
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
  const booksWithWords = useMemo(
    () => content.books.map((book) => {
      const ids = bookWords(book).map((word) => word.id);
      const learned = ids.filter((id) => progress.memory[id] && progress.memory[id].status !== 'new').length;
      return { book, words: Math.max(book.wordCount, ids.length), learned };
    }),
    [content.books, progress.memory],
  );
  const totalWordCount = booksWithWords.reduce((sum, row) => sum + row.words, 0);
  const today = getTodayStr();
  const todayActivity = progress.dailyActivity[today] ?? EMPTY_ACTIVITY;
  const recent14 = useMemo(() => buildRecentDays(progress.dailyActivity, 14), [progress.dailyActivity]);
  const recent7 = recent14.slice(-7);
  const dailyPlan = useMemo(
    () => buildDailyPlan({
      dueToday: memorySummary.dueToday,
      dailyTarget: settings.dailyTarget,
      reviewsToday: todayActivity.reviews,
      newWordsToday: todayActivity.newWords,
      listeningToday: todayActivity.listening,
      questionsToday: todayActivity.questions,
      intensity: settings.planIntensity,
    }),
    [memorySummary.dueToday, settings.dailyTarget, settings.planIntensity, todayActivity],
  );
  const nextTask = nextStudyTask(dailyPlan);
  const completion = planCompletion(dailyPlan);

  let correct = 0;
  let wrong = 0;
  Object.values(progress.questionResults).forEach((result) => {
    if (result) correct += 1;
    else wrong += 1;
  });
  Object.values(progress.wordStats).forEach((stats) => {
    correct += stats.correct;
    wrong += stats.wrong;
  });
  const correctness = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  const allWordsMap = useMemo(() => {
    const map: Record<string, IVocabWord> = {};
    for (const book of content.books) {
      for (const word of bookWords(book)) map[word.id] = word;
    }
    for (const word of content.coreWords) map[word.id] = word;
    return map;
  }, [content.books, content.coreWords]);
  const weakWords = memorySummary.weakIds
    .map((id) => {
      const word = allWordsMap[id];
      if (!word) return null;
      return { ...word, lapses: progress.memory[id]?.lapses ?? 0 };
    })
    .filter((word): word is IVocabWord & { lapses: number } => word !== null)
    .sort((a, b) => b.lapses - a.lapses);

  const examDays = (() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(settings.examDate)) return null;
    const target = new Date(`${settings.examDate}T00:00:00`);
    if (Number.isNaN(target.getTime())) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
  })();
  const todayMinutes = Math.round((progress.studyLog[today] ?? 0) / 60);

  const contentBySection: Record<string, React.ReactNode> = {
    books: (
      <BooksSection
        booksWithWords={booksWithWords}
        selectedBook={selectedBook}
        masterSummary={memorySummary}
        currentWordCount={currentWords.length}
      />
    ),
    listening: <ListeningSection content={content} progress={progress} />,
    progress: (
      <ProgressSection
        recent7={recent7}
        recent14={recent14}
        memorySummary={memorySummary}
        weakWords={weakWords}
        streakCount={streakCount}
        correctness={correctness}
        todayMinutes={todayMinutes}
      />
    ),
    appearance: <AppearanceSection />,
  };

  return (
    <div className="more-shell">
      <MiniRail />
      <MiniRail mobile />
      <div className="min-w-0">
        {section && contentBySection[section] ? contentBySection[section] : (
          <MoreOverview
            content={content}
            progress={progress}
            currentWords={currentWords}
            selectedBook={selectedBook}
            memorySummary={memorySummary}
            totalWordCount={totalWordCount}
            recent7={recent7}
            recent14={recent14}
            plan={dailyPlan}
            nextTask={nextTask}
            completion={completion}
            correctness={correctness}
            streakCount={streakCount}
            todayCheckedIn={todayCheckedIn}
            examDays={examDays}
          />
        )}
      </div>
    </div>
  );
}
