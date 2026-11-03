// EXPORTS: PracticePage
// 真题考试风格：选套题 → 完整试卷 → Section C 提交按钮（最后一题右下角）→ 提交后出答案+解析。

import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { BookOpen, CheckCircle2, Languages, PenLine, Send, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useProgress } from '@/context/progress-context';
import { useContent } from '@/context/content-context';
import { useI18n } from '@/context/i18n-context';
import type { IExamSet, IReadingQ } from '@/data/practice';
import LanguageMirror from '@/components/LanguageMirror';
import {
  buildEssayGradeReport,
  essayStats,
  gradeEssay,
  translationsMatch,
  validateEssay,
} from '@/lib/grader';
import type { EssayGrade, EssayIssue } from '@/lib/grader';
import { analyzeEssayLanguage } from '@/lib/language-insight';
import type { LanguageInsight } from '@/lib/language-insight';

type PracticeType = 'reading' | 'translation' | 'writing';

const PRACTICE_TYPES: Array<{ id: PracticeType; label: string; hint: string; icon: LucideIcon }> = [
  { id: 'reading', label: '阅读理解', hint: '2 篇 · 10 题', icon: BookOpen },
  { id: 'translation', label: '翻译', hint: '1 段 · 参考答案', icon: Languages },
  { id: 'writing', label: '写作', hint: '1 篇 · 提纲作文', icon: PenLine },
];

export default function PracticePage() {
  const { t } = useI18n();
  const { content } = useContent();
  const examSets = content.examSets;
  const [level, setLevel] = useState<'cet4' | 'cet6'>('cet6');
  const sets = useMemo(() => examSets.filter((s) => s.level === level), [examSets, level]);
  const [setId, setSetId] = useState<string>(sets[0]?.id ?? '');
  const current = useMemo(() => sets.find((s) => s.id === setId) ?? sets[0], [sets, setId]);
  const [activeType, setActiveType] = useState<PracticeType>('reading');

  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="screen-title">{t('真题套卷')}</h1>
          <p className="screen-lead mt-2">
            {t('按题型专项练习：阅读理解、翻译、写作；每部分提交后才出答案。')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="apple-segmented inline-flex">
          {(['cet4', 'cet6'] as const).map((lv) => (
            <button
              key={lv}
              onClick={() => {
                if (lv === level) return;
                const nextSets = examSets.filter((item) => item.level === lv);
                setLevel(lv);
                setSetId(nextSets[0]?.id ?? '');
              }}
              data-active={level === lv}
              className="apple-segment px-4"
            >
              {lv === 'cet4' ? t('四级 CET-4') : t('六级 CET-6')}
            </button>
          ))}
        </div>
        <select
          value={setId}
          onChange={(e) => setSetId(e.target.value)}
          aria-label={t('选择练习真题')}
          className="max-w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          {sets.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {PRACTICE_TYPES.map(({ id, label, hint, icon: Icon }) => {
          const active = activeType === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveType(id)}
              aria-pressed={active}
              className={cn(
                'flex min-h-[72px] items-center gap-3 rounded-2xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                active
                  ? 'border-primary/40 bg-primary/10 shadow-sm'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-primary/5',
              )}
            >
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{t(label)}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{t(hint)}</span>
              </span>
            </button>
          );
        })}
      </div>

      {current && <ExamPaper key={current.id} set={current} activeType={activeType} />}
    </div>
  );
}

function ExamPaper({ set, activeType }: { set: IExamSet; activeType: PracticeType }) {
  return (
    <div className="space-y-6">
      <div className={activeType === 'reading' ? 'space-y-6' : 'hidden'} aria-hidden={activeType !== 'reading'}>
        <ReadingSection set={set} />
      </div>
      <div className={activeType === 'translation' ? 'space-y-6' : 'hidden'} aria-hidden={activeType !== 'translation'}>
        <TranslationSection set={set} />
      </div>
      <div className={activeType === 'writing' ? 'space-y-6' : 'hidden'} aria-hidden={activeType !== 'writing'}>
        <WritingSection set={set} />
      </div>
    </div>
  );
}

function ReadingSection({ set }: { set: IExamSet }) {
  const { t } = useI18n();
  const { recordQuestion } = useProgress();
  const allQ = useMemo(
    () => set.passages.flatMap((p) => p.questions),
    [set],
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const choose = (qid: string, i: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: i }));
  };

  const allAnswered = allQ.every((q) => answers[q.id] !== undefined);

  const doSubmit = () => {
    setSubmitted(true);
    allQ.forEach((q) => {
      recordQuestion(q.id, answers[q.id] === q.answer);
    });
  };

  return (
    <Card>
      <CardContent className="w-full max-w-none p-5 sm:p-6 space-y-8">
        <div>
          <h2 className="text-lg font-bold">Part III · Reading Comprehension</h2>
          <p className="text-sm text-muted-foreground">{t('Section C · Careful Reading（共 2 篇，每篇 5 题）')}</p>
        </div>

        {set.passages.map((p, pi) => (
          <div key={pi} className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-start">
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.source}</p>
              </div>
              <p className="reading-column whitespace-pre-line rounded-xl border border-border/80 bg-white/34 p-4 sm:p-5">
                {p.passage}
              </p>
            </div>
            <div className="space-y-4">
              {p.questions.map((q) => (
                <QuestionRow
                  key={q.id}
                  q={q}
                  chosen={answers[q.id]}
                  submitted={submitted}
                  onChoose={choose}
                />
              ))}
            </div>
          </div>
        ))}

        {/* 提交按钮：最后一题右下角 */}
        <div className="flex justify-end">
          {submitted ? (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">{t('已提交 · 见上方答案与解析')}</span>
            </div>
          ) : (
            <Button onClick={doSubmit} disabled={!allAnswered}>
              <Send className="mr-2 h-4 w-4" />
              {t('提交阅读答案（{done}/{total}）', { done: allQ.filter((q) => answers[q.id] !== undefined).length, total: allQ.length })}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionRow({
  q, chosen, submitted, onChoose,
}: {
  q: IReadingQ;
  chosen: number | undefined;
  submitted: boolean;
  onChoose: (qid: string, i: number) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2">
      <p className="text-[15px] font-medium leading-6">
        {q.no}. {q.prompt}
      </p>
      <div className="space-y-1.5">
        {q.options.map((opt, i) => {
          let c = 'border-border bg-card hover:border-primary cursor-pointer';
          if (submitted) {
            if (i === q.answer) c = 'border-success bg-success/10 text-success';
            else if (chosen === i) c = 'border-destructive bg-destructive/10 text-destructive';
            else c = 'border-border bg-card opacity-60 cursor-default';
          } else if (chosen === i) {
            c = 'border-primary bg-primary/5 cursor-pointer';
          }
          return (
            <button
              key={i}
              onClick={() => onChoose(q.id, i)}
              disabled={submitted}
              className={cn(
                'flex min-h-11 w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-[13px] leading-5 transition-colors sm:text-sm',
                c,
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {submitted && (
        <div
          className={cn(
            'mt-1 flex items-start gap-2 rounded-lg border p-3 text-sm',
            chosen === q.answer
              ? 'border-success/40 bg-success/5'
              : 'border-destructive/40 bg-destructive/5',
          )}
        >
          {chosen === q.answer ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          )}
          <div>
            <p className="font-medium">
              {chosen === q.answer
                ? t('回答正确')
                : `${t('正确答案：{answer}', { answer: String.fromCharCode(65 + q.answer) })}${chosen !== undefined && chosen !== q.answer ? t('（你选了 {answer}）', { answer: String.fromCharCode(65 + chosen) }) : ''}`}
            </p>
            <p className="mt-0.5 text-muted-foreground">{q.analysis}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EssayRadar({
  dimensions,
}: {
  dimensions: Array<{ label: string; value: number }>;
}) {
  const { t } = useI18n();
  const center = 92;
  const radius = 57;
  const angleFor = (index: number) => (-90 + index * 90) * (Math.PI / 180);
  const polygon = (scale: number) => dimensions.map((_, index) => {
    const angle = angleFor(index);
    return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
  }).join(' ');
  const dataPolygon = dimensions.map((dimension, index) => {
    const angle = angleFor(index);
    const value = Math.max(0, Math.min(100, dimension.value)) / 100;
    return `${center + Math.cos(angle) * radius * value},${center + Math.sin(angle) * radius * value}`;
  }).join(' ');

  return (
    <svg width="184" height="184" viewBox="0 0 184 184" role="img" aria-label={t('作文四项能力雷达图')}>
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon key={scale} points={polygon(scale)} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
      ))}
      {dimensions.map((dimension, index) => {
        const angle = angleFor(index);
        return (
          <g key={dimension.label}>
            <line
              x1={center}
              y1={center}
              x2={center + Math.cos(angle) * radius}
              y2={center + Math.sin(angle) * radius}
              stroke="rgba(255,255,255,.14)"
            />
            <text
              x={center + Math.cos(angle) * (radius + 20)}
              y={center + Math.sin(angle) * (radius + 20)}
              fill="rgba(255,255,255,.62)"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
            >
              {t(dimension.label)}
            </text>
          </g>
        );
      })}
      <polygon points={dataPolygon} fill="rgba(67,214,197,.24)" stroke="currentColor" strokeWidth="2" />
      {dimensions.map((dimension, index) => {
        const angle = angleFor(index);
        const value = Math.max(0, Math.min(100, dimension.value)) / 100;
        return (
          <circle
            key={dimension.label}
            cx={center + Math.cos(angle) * radius * value}
            cy={center + Math.sin(angle) * radius * value}
            r="3"
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}

function EssayBattleReport({
  grade,
  stats,
  insight,
  active,
  setActive,
}: {
  grade: EssayGrade;
  stats: ReturnType<typeof essayStats>;
  insight: LanguageInsight;
  active: { issue: EssayIssue; pinned: boolean } | null;
  setActive: Dispatch<SetStateAction<{ issue: EssayIssue; pinned: boolean } | null>>;
}) {
  const { t } = useI18n();
  const report = buildEssayGradeReport(grade, stats);
  const issueGroups = [
    { label: '拼写问题', value: report.issueCounts.spelling },
    { label: '语法句子', value: report.issueCounts.grammar },
    { label: '内容表达', value: report.issueCounts.style },
  ];

  return (
    <div className="space-y-3">
      <section className="overflow-hidden rounded-[24px] bg-primary p-5 text-primary-foreground md:p-6">
        <div className="grid items-center gap-6 md:grid-cols-[150px_minmax(0,1fr)_210px]">
          <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 144 144" aria-hidden="true">
              <circle cx="72" cy="72" r="61" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="7" />
              <circle
                cx="72"
                cy="72"
                r="61"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 61}
                strokeDashoffset={2 * Math.PI * 61 * (1 - grade.score / 100)}
              />
            </svg>
            <div className="text-center">
              <p className="text-xs text-primary-foreground/58">{t('本次评级')}</p>
              <strong className="mt-1 block font-display text-5xl font-normal leading-none">{report.rank}</strong>
              <p className="mt-1 text-sm tabular-nums text-primary-foreground/70">{grade.score} / 100</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-primary-foreground/58">{t('本局批改')}</p>
            <h3 className="mt-2 text-2xl leading-9 tracking-[-0.025em]">{t(report.headline)}</h3>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-primary-foreground/66">
              <span className="rounded-full bg-primary-foreground/8 px-3 py-1.5">{t('{n} 词', { n: stats.wordCount })}</span>
              <span className="rounded-full bg-primary-foreground/8 px-3 py-1.5">{t('{n} 句', { n: stats.sentenceCount })}</span>
              <span className="rounded-full bg-primary-foreground/8 px-3 py-1.5">{t('{n} 处批注', { n: grade.issues.length })}</span>
            </div>
          </div>

          <div className="mx-auto">
            <EssayRadar dimensions={report.dimensions} />
          </div>
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-3">
        {issueGroups.map((group) => (
          <div key={group.label} className="rounded-[16px] bg-white/30 px-4 py-3">
            <p className="text-xs text-foreground/45">{t(group.label)}</p>
            <p className="mt-1 text-xl font-normal tabular-nums">{group.value}<span className="ml-1 text-xs text-foreground/42">{t('处')}</span></p>
          </div>
        ))}
      </div>

      <div className="rounded-[18px] bg-white/34 px-4 py-4">
        <p className="text-xs font-medium text-primary">{t('本局最该改')}</p>
        <p className="mt-2 text-sm leading-6 text-foreground/72">{t(report.priority)}</p>
      </div>

      {grade.vocabularyNote && (
        <div className="rounded-[18px] border border-amber-300/60 bg-amber-50/80 px-4 py-3">
          <p className="text-xs font-medium text-amber-800">{t('词汇量提示')}</p>
          <p className="mt-1 text-sm leading-6 text-amber-900">{t(grade.vocabularyNote)}</p>
        </div>
      )}

      <LanguageMirror insight={insight} />

      <div className="rounded-[20px] bg-white/28 p-4">
        <p className="mb-3 text-xs font-medium text-foreground/48">{t('原文批注 · 指向标记查看修改建议')}</p>
        <p className="text-sm leading-8">
          {grade.tokens.map((token, index) => {
            if (token.skip) return <span key={index}>{token.text}</span>;
            const issue = token.issue !== undefined ? grade.issues[token.issue] : undefined;
            if (!issue) return <span key={index}>{token.text}</span>;
            return (
              <span
                key={index}
                onMouseEnter={() => setActive({ issue, pinned: false })}
                onMouseLeave={() => setActive((current) => (current && current.pinned ? current : null))}
                onClick={() =>
                  setActive((current) => (
                    current && current.issue === issue && current.pinned
                      ? null
                      : { issue, pinned: true }
                  ))
                }
                className="relative cursor-pointer rounded bg-destructive/10 text-destructive underline decoration-wavy underline-offset-2"
              >
                {token.text}
                {active && active.issue === issue && (
                  <span className="absolute bottom-full left-0 z-30 mb-2 w-64 rounded-xl border border-white/70 bg-white/92 p-3 text-xs leading-5 text-foreground shadow-lg backdrop-blur">
                    <span className="mb-1 block font-semibold text-destructive">{t(issue.message)}</span>
                    <span className="text-foreground/62">{t(issue.fix)}</span>
                  </span>
                )}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

function TranslationSection({ set }: { set: IExamSet }) {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [verdict, setVerdict] = useState<ReturnType<typeof translationsMatch> | undefined>();

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold">Part IV · Translation</h2>
          <p className="text-sm text-muted-foreground">{t('将下文翻译成英文，提交后按参考译文检查关键词覆盖')}</p>
        </div>
        <p className="reading-column whitespace-pre-line rounded-xl border border-border/80 bg-white/34 p-4 sm:p-5">
          {set.translation.sentence}
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder={t('在此输入你的英文译文……')}
          className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              if (!input.trim()) return;
              setVerdict(translationsMatch(input, set.translation.reference));
            }}
            disabled={!input.trim()}
          >
            {t('提交翻译')}
          </Button>
        </div>
        {verdict && (
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm space-y-2">
            <p className={verdict.match ? 'font-semibold text-success' : 'font-semibold text-destructive'}>
              {verdict.match ? t('✓ 译得不错') : t('✗ 与参考译文有差距')}
            </p>
            <p className="text-muted-foreground">{t('实义词覆盖率约 {n}%', { n: Math.round(verdict.score * 100) })}</p>
            {verdict.missing.length > 0 && (
              <p className="text-muted-foreground">{t('可能漏译：{words}', { words: verdict.missing.join(', ') })}</p>
            )}
            <div className="border-t border-border pt-2">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('参考译文')}</p>
              <p className="leading-relaxed">{set.translation.reference}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WritingSection({ set }: { set: IExamSet }) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [grade, setGrade] = useState<EssayGrade | null>(null);
  const [validationError, setValidationError] = useState('');
  const [active, setActive] = useState<{ issue: EssayIssue; pinned: boolean } | null>(null);
  const stats = essayStats(text, set.level);
  const insight = useMemo(
    () => (grade ? analyzeEssayLanguage(text) : null),
    [grade, text],
  );

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Part I · Writing</h2>
        </div>
        <p className="reading-column">{set.writing.prompt}</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          {set.writing.outline.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setGrade(null);
            setValidationError('');
          }}
          rows={8}
          placeholder={t('在此输入你的作文……')}
          className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground" aria-live="polite">
          <span>{t('英文词数：{n} / 要求 {min}-{max}', { n: stats.wordCount, min: stats.minWords, max: stats.maxWords })}</span>
          {stats.chineseChars > 0 && <span className="text-destructive">{t('检测到 {n} 个中文字符', { n: stats.chineseChars })}</span>}
        </div>
        {stats.wordCount > 0 && (stats.wordCount < 20 || stats.uniqueWords < 15) && (
          <p className="text-xs leading-5 text-amber-700">
            {t('词汇或篇幅偏少也会照常批改；得分和“表达丰富”会受限。')}
          </p>
        )}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              if (!text.trim()) return;
              const validation = validateEssay(text, set.level);
              if (!validation.ok) {
                setGrade(null);
                setValidationError(t(validation.reason ?? '当前内容无法评分。'));
                return;
              }
              setValidationError('');
              setGrade(gradeEssay(text, set.level));
            }}
          >
            {t('批改这篇作文')}
          </Button>
          <span className="text-xs text-muted-foreground">{t('本地规则批改，不上传作文')}</span>
        </div>
        {validationError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {validationError}
          </div>
        )}
        {grade && insight && (
          <EssayBattleReport
            grade={grade}
            stats={stats}
            insight={insight}
            active={active}
            setActive={setActive}
          />
        )}
      </CardContent>
    </Card>
  );
}
