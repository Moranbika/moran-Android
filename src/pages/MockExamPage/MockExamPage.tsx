import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Headphones,
  PenLine,
  RotateCcw,
  Send,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProgress } from '@/context/progress-context';
import { useContent } from '@/context/content-context';
import { useI18n } from '@/context/i18n-context';
import {
  buildObjectiveQuestions,
  formatClock,
  MOCK_EXAM_SECONDS,
  scoreObjectiveQuestions,
} from '@/lib/mock-exam';
import { cn } from '@/lib/utils';
import ConfirmDialog from '@/components/ConfirmDialog';

type Phase = 'setup' | 'running' | 'result';
type ExamPart = 'writing' | 'listening' | 'reading' | 'translation' | 'review';

const PARTS: Array<{ id: ExamPart; label: string; minutes: number }> = [
  { id: 'writing', label: '写作', minutes: 30 },
  { id: 'listening', label: '听力', minutes: 30 },
  { id: 'reading', label: '阅读', minutes: 40 },
  { id: 'translation', label: '翻译', minutes: 30 },
];

const MOCK_SESSION_KEY = 'cet6-practice:mock-exam-session';

type ExamSessionSnapshot = {
  level: 'cet4' | 'cet6';
  setId: string;
  answers: Record<string, number>;
  writing: string;
  translation: string;
  part: ExamPart;
  questionIndex: number;
  deadline: number;
  startedAt: number;
};

function loadExamSession(): ExamSessionSnapshot | null {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ExamSessionSnapshot>;
    if (!parsed || !parsed.setId || !Number.isFinite(Number(parsed.deadline))) return null;
    const part: ExamPart = ['writing', 'listening', 'reading', 'translation', 'review'].includes(String(parsed.part))
      ? (parsed.part as ExamPart)
      : 'writing';
    return {
      level: parsed.level === 'cet4' ? 'cet4' : 'cet6',
      setId: parsed.setId,
      answers: parsed.answers ?? {},
      writing: parsed.writing ?? '',
      translation: parsed.translation ?? '',
      part,
      questionIndex: Number.isFinite(Number(parsed.questionIndex)) ? Number(parsed.questionIndex) : 0,
      deadline: Number(parsed.deadline),
      startedAt: Number(parsed.startedAt) || Date.now(),
    };
  } catch {
    return null;
  }
}

function SectionButton({
  active,
  complete,
  label,
  minutes,
  onClick,
}: {
  active: boolean;
  complete: boolean;
  label: string;
  minutes: number;
  onClick: () => void;
}) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-11 items-center justify-between rounded-[14px] px-3 text-left text-sm transition-colors',
        active ? 'bg-white/58 text-foreground' : 'text-foreground/58 hover:bg-white/30 hover:text-foreground',
      )}
    >
      <span className="flex items-center gap-2">
        {complete ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <span className="h-4 w-4 rounded-full border border-foreground/18" />}
        {label}
      </span>
      <span className="text-xs text-foreground/42">{minutes > 0 ? t('{n} 分', { n: minutes }) : ''}</span>
    </button>
  );
}

export default function MockExamPage() {
  const { t } = useI18n();
  const { progress, recordMockExamAttempt } = useProgress();
  const { content } = useContent();
  const [initialSession] = useState(() => loadExamSession());
  const [phase, setPhase] = useState<Phase>(initialSession ? 'running' : 'setup');
  const [level, setLevel] = useState<'cet4' | 'cet6'>(initialSession?.level ?? 'cet6');
  const sets = useMemo(
    () => content.examSets.filter((item) => item.level === level),
    [content.examSets, level],
  );
  const [setId, setSetId] = useState(initialSession?.setId ?? sets[0]?.id ?? '');
  const exam = useMemo(() => sets.find((item) => item.id === setId) ?? sets[0], [sets, setId]);
  const listening = useMemo(
    () => content.listeningSets.find((item) => (
      item.level === exam?.level
      && item.year === exam?.year
      && item.session === exam?.session
    )),
    [content.listeningSets, exam],
  );
  const questions = useMemo(
    () => exam ? buildObjectiveQuestions(exam, listening) : [],
    [exam, listening],
  );
  const [answers, setAnswers] = useState<Record<string, number>>(initialSession?.answers ?? {});
  const [writing, setWriting] = useState(initialSession?.writing ?? '');
  const [translation, setTranslation] = useState(initialSession?.translation ?? '');
  const [part, setPart] = useState<ExamPart>(initialSession?.part ?? 'writing');
  const [questionIndex, setQuestionIndex] = useState(initialSession?.questionIndex ?? 0);
  const [remaining, setRemaining] = useState(() => initialSession
    ? Math.max(0, Math.ceil((initialSession.deadline - Date.now()) / 1000))
    : MOCK_EXAM_SECONDS);
  const [deadline, setDeadline] = useState(initialSession?.deadline ?? 0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const startedAtRef = useRef(initialSession?.startedAt ?? 0);
  const submittedRef = useRef(false);
  const [result, setResult] = useState<ReturnType<typeof scoreObjectiveQuestions> | null>(null);

  const currentQuestion = questions[questionIndex];
  const listeningQuestions = questions.filter((question) => question.section === 'listening');
  const readingQuestions = questions.filter((question) => question.section === 'reading');
  const partQuestions = part === 'listening' ? listeningQuestions : readingQuestions;
  const answeredCount = questions.filter((question) => answers[question.id] !== undefined).length;
  const currentPartPosition = currentQuestion
    ? partQuestions.findIndex((question) => question.id === currentQuestion.id)
    : -1;

  const finishExam = useCallback((automatic = false) => {
    if (submittedRef.current || !exam) return;
    submittedRef.current = true;
    const finalScore = scoreObjectiveQuestions(questions, answers);
    setResult(finalScore);
    const elapsed = Math.min(
      MOCK_EXAM_SECONDS,
      Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)),
    );
    recordMockExamAttempt({
      id: `${exam.id}-${Date.now()}`,
      examSetId: exam.id,
      completedAt: Date.now(),
      durationSeconds: elapsed,
      listeningCorrect: finalScore.listening.correct,
      listeningTotal: finalScore.listening.total,
      readingCorrect: finalScore.reading.correct,
      readingTotal: finalScore.reading.total,
      answers,
    });
    setRemaining(automatic ? 0 : Math.max(0, MOCK_EXAM_SECONDS - elapsed));
    setPhase('result');
    setConfirmSubmit(false);
    localStorage.removeItem(MOCK_SESSION_KEY);
    toast.success(automatic ? t('时间到，已自动交卷') : t('试卷已提交'));
    document.querySelector('.app-main-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers, exam, questions, recordMockExamAttempt]);

  const finishRef = useRef(finishExam);
  useEffect(() => {
    finishRef.current = finishExam;
  }, [finishExam]);

  useEffect(() => {
    if (phase !== 'running') return;
    const tick = () => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) finishRef.current(true);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [deadline, phase]);

  useEffect(() => {
    if (phase !== 'running') return;
    try {
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({
        level,
        setId,
        answers,
        writing,
        translation,
        part,
        questionIndex,
        deadline,
        startedAt: startedAtRef.current,
      } satisfies ExamSessionSnapshot));
    } catch {
      // localStorage may be unavailable; the exam still works in memory.
    }
  }, [phase, level, setId, answers, writing, translation, part, questionIndex, deadline]);

  const startExam = () => {
    localStorage.removeItem(MOCK_SESSION_KEY);
    setAnswers({});
    setWriting('');
    setTranslation('');
    setPart('writing');
    setQuestionIndex(0);
    setRemaining(MOCK_EXAM_SECONDS);
    startedAtRef.current = Date.now();
    setDeadline(Date.now() + MOCK_EXAM_SECONDS * 1000);
    submittedRef.current = false;
    setResult(null);
    setPhase('running');
  };

  const openObjectivePart = (nextPart: 'listening' | 'reading') => {
    const first = questions.findIndex((question) => question.section === nextPart);
    setQuestionIndex(first >= 0 ? first : 0);
    setPart(nextPart);
  };

  if (phase === 'setup') {
    return (
      <div className="mx-auto w-full max-w-[1080px] pb-8 pt-6 md:pt-10">
        <header>
          <h1 className="screen-title">{t('真题限时模考')}</h1>
          <p className="screen-lead mt-2">
            {t('130 分钟完整流程：写作 → 听力 → 阅读 → 翻译。交卷后客观题自动评分并显示解析。')}
          </p>
        </header>

        <section className="app-glass app-glass-strong mt-8 rounded-[28px] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-sm text-muted-foreground">{t('选择试卷')}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <div className="inline-flex rounded-full bg-white/34 p-1">
                  {(['cet4', 'cet6'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (item === level) return;
                        const nextSets = content.examSets.filter((set) => set.level === item);
                        setLevel(item);
                        setSetId(nextSets[0]?.id ?? '');
                      }}
                      className={cn(
                        'min-h-10 rounded-full px-4 text-sm transition-colors',
                        level === item ? 'bg-primary text-primary-foreground' : 'text-foreground/58',
                      )}
                    >
                      {item === 'cet4' ? t('四级') : t('六级')}
                    </button>
                  ))}
                </div>
                <select
                  value={setId}
                  onChange={(event) => setSetId(event.target.value)}
                  className="min-h-10 rounded-full border border-white/60 bg-white/42 px-4 text-sm"
                  aria-label={t('选择真题')}
                >
                  {sets.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{listening ? t('含完整听力 25 题') : t('该试卷暂无听力音频')}</p>
              <p className="mt-1">{t('客观题 {n} 题 · 历史模考 {m} 次', { n: questions.length, m: progress.mockExamAttempts.length })}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[18px] bg-white/24 p-4">
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              {t('开考后计时不会暂停。倒计时归零会自动交卷；写作与翻译提供参考提纲和译文，不做虚构分数。')}
            </p>
            <button
              type="button"
              onClick={startExam}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:w-auto"
            >
              <AlarmClock className="h-4 w-4" />
              {t('开始 130 分钟模考')}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {PARTS.map((item) => (
              <div key={item.id} className="rounded-[16px] bg-white/28 p-3.5">
                <p className="text-2xl font-normal tabular-nums">{item.minutes}</p>
                <p className="mt-1 text-sm font-medium">{t(item.label)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t('分钟参考')}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (phase === 'result' && result) {
    const mistakes = questions.filter((question) => answers[question.id] !== question.answer);
    return (
      <div className="mx-auto w-full max-w-[1100px] space-y-5 pb-8 pt-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="screen-title">{t('模考结果')}</h1>
            <p className="screen-lead mt-2">{exam?.title} · {t('客观题原始得分')}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPhase('setup');
              setResult(null);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm text-background"
          >
            <RotateCcw className="h-4 w-4" /> {t('再考一次')}
          </button>
        </header>

        <section className="app-glass app-glass-strong rounded-[28px] p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [t('客观题总分'), `${result.correct} / ${result.total}`],
              [t('听力'), `${result.listening.correct} / ${result.listening.total}`],
              [t('阅读'), `${result.reading.correct} / ${result.reading.total}`],
            ].map(([label, value], index) => (
              <div key={label} className="rounded-[20px] bg-white/30 p-5">
                <p className="text-sm text-foreground/55">{label}</p>
                <p className={cn('mt-2 font-normal tabular-nums', index === 0 ? 'text-4xl' : 'text-3xl')}>{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-foreground/55">
            {t('已作答 {done} / {total} 题。写作和翻译未自动评分，参考材料见下方。', { done: result.answered, total: questions.length })}
          </p>
        </section>

        <section className="app-glass rounded-[28px] p-5 md:p-6">
          <h2 className="text-base font-medium">{t('错题与解析')}</h2>
          {mistakes.length === 0 ? (
            <p className="mt-4 rounded-[18px] bg-white/26 p-5 text-sm text-foreground/58">{t('客观题全部答对。')}</p>
          ) : (
            <div className="mt-4 space-y-3">
              {mistakes.map((question) => (
                <details key={question.id} className="rounded-[18px] bg-white/26 p-4">
                  <summary className="cursor-pointer list-none text-sm font-medium">
                    <span className="mr-2 text-primary">{question.section === 'listening' ? t('听力') : t('阅读')} {question.no}</span>
                    {question.prompt}
                  </summary>
                  <p className="mt-3 text-sm">
                    {t('正确答案：')}{String.fromCharCode(65 + question.answer)}
                    {answers[question.id] !== undefined
                      ? ` · ${t('你的答案：')}${String.fromCharCode(65 + answers[question.id])}`
                      : ` · ${t('未作答')}`}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground/58">{question.analysis}</p>
                </details>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="app-glass rounded-[28px] p-5">
            <h2 className="text-base font-medium">{t('写作参考')}</h2>
            <p className="mt-3 text-sm leading-6">{exam?.writing.prompt}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/58">
              {exam?.writing.outline.map((item) => <li key={item}>{item}</li>)}
            </ul>
            {writing && <p className="mt-3 border-t border-foreground/8 pt-3 text-xs text-foreground/48">{t('已保存本次输入 {n} 词', { n: writing.trim().split(/\s+/).filter(Boolean).length })}</p>}
          </div>
          <div className="app-glass rounded-[28px] p-5">
            <h2 className="text-base font-medium">{t('翻译参考')}</h2>
            <p className="mt-3 text-sm leading-6 text-foreground/58">{exam?.translation.sentence}</p>
            <p className="mt-3 border-t border-foreground/8 pt-3 text-sm leading-6">{exam?.translation.reference}</p>
          </div>
        </section>
      </div>
    );
  }

  const warning = remaining <= 5 * 60;
  return (
    <>
      <div className="mx-auto w-full max-w-[1180px] pb-8 pt-4">
        <header className="app-glass app-glass-strong sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-[22px] px-4 py-3">
          <div>
            <p className="text-sm font-medium">{exam?.title}</p>
            <p className="mt-0.5 text-xs text-foreground/48">{t('已作答 {done} / {total} 道客观题 · 进度自动保存', { done: answeredCount, total: questions.length })}</p>
          </div>
          <div className={cn('flex items-center gap-2 rounded-full px-4 py-2 tabular-nums', warning ? 'bg-destructive/14 text-destructive' : 'bg-white/38 text-foreground')}>
            <Clock3 className="h-4 w-4" />
            <strong className="text-lg font-medium">{formatClock(remaining)}</strong>
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="app-glass h-fit rounded-[24px] p-3 lg:sticky lg:top-24">
            <p className="px-2 pb-2 text-xs text-foreground/45">{t('试卷结构')}</p>
            <div className="space-y-1">
              {PARTS.map((item) => (
                <SectionButton
                  key={item.id}
                  active={part === item.id}
                  complete={
                    item.id === 'writing' ? Boolean(writing.trim())
                      : item.id === 'translation' ? Boolean(translation.trim())
                        : false
                  }
                  label={t(item.label)}
                  minutes={item.minutes}
                  onClick={() => {
                    if (item.id === 'listening' || item.id === 'reading') openObjectivePart(item.id);
                    else setPart(item.id);
                  }}
                />
              ))}
              <SectionButton
                active={part === 'review'}
                complete={answeredCount === questions.length}
                label={t('检查交卷')}
                minutes={0}
                onClick={() => setPart('review')}
              />
            </div>
            {(part === 'listening' || part === 'reading') && (
              <div className="mt-4 border-t border-foreground/8 pt-4">
                <div className="grid grid-cols-5 gap-1.5">
                  {partQuestions.map((question) => {
                    const index = questions.findIndex((item) => item.id === question.id);
                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => setQuestionIndex(index)}
                        className={cn(
                          'flex h-8 items-center justify-center rounded-lg text-xs tabular-nums transition-colors',
                          currentQuestion?.id === question.id
                            ? 'bg-foreground text-background'
                            : answers[question.id] !== undefined
                              ? 'bg-primary/14 text-primary'
                              : 'bg-white/28 text-foreground/58',
                        )}
                      >
                        {question.no}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          <main className="app-glass min-h-[620px] rounded-[28px] p-5 md:p-8">
            {part === 'writing' && (
              <div className="mx-auto max-w-3xl">
                <div className="flex items-center gap-2">
                  <PenLine className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-semibold">Part I · Writing</h1>
                </div>
                <p className="mt-5 text-sm leading-7">{exam?.writing.prompt}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/58">
                  {exam?.writing.outline.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <textarea
                  value={writing}
                  onChange={(event) => setWriting(event.target.value)}
                  rows={16}
                  aria-label={t('作文')}
                  placeholder={t('在此输入作文……')}
                  className="mt-5 w-full rounded-[18px] border border-white/60 bg-white/34 p-4 text-sm leading-7 outline-none focus:border-primary"
                />
              </div>
            )}

            {(part === 'listening' || part === 'reading') && currentQuestion && (
              <div className="mx-auto w-full max-w-none">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h1 className="text-xl font-semibold">
                    {part === 'listening' ? 'Part II · Listening' : 'Part III · Reading'}
                  </h1>
                  <span className="text-xs text-foreground/45">
                    {partQuestions.findIndex((question) => question.id === currentQuestion.id) + 1} / {partQuestions.length}
                  </span>
                </div>

                {part === 'listening' && listening && (
                  <div className="mt-5 rounded-[18px] bg-white/30 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Headphones className="h-4 w-4 text-primary" />
                      {currentQuestion.contextTitle}
                    </div>
                    <audio controls src={listening.audio} className="mt-3 h-10 w-full" />
                    <p className="mt-2 text-xs text-foreground/45">{t('真题原声。正式考试中不可暂停，此处为练习模式保留播放控制。')}</p>
                  </div>
                )}

                {part === 'reading' && currentQuestion.contextText && (
                  <div className="mt-5 rounded-[18px] bg-white/30 p-4">
                    <p className="text-sm font-medium">{currentQuestion.contextTitle}</p>
                    <p className="mt-1 text-xs text-foreground/45">{currentQuestion.contextSource}</p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground/78">{currentQuestion.contextText}</p>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-base font-medium">{currentQuestion.no}. {currentQuestion.prompt}</p>
                  <div className="mt-4 space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: index }))}
                        className={cn(
                          'flex min-h-12 w-full items-center gap-3 rounded-[14px] px-4 text-left text-sm transition-colors',
                          answers[currentQuestion.id] === index
                            ? 'bg-primary/14 text-foreground'
                            : 'bg-white/24 text-foreground/72 hover:bg-white/42',
                        )}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-foreground/14 text-xs">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const target = partQuestions[currentPartPosition - 1];
                      if (target) setQuestionIndex(questions.findIndex((question) => question.id === target.id));
                    }}
                    disabled={currentPartPosition <= 0}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/32 px-4 text-sm disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" /> {t('上一题')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const target = partQuestions[currentPartPosition + 1];
                      if (target) setQuestionIndex(questions.findIndex((question) => question.id === target.id));
                    }}
                    disabled={currentPartPosition < 0 || currentPartPosition >= partQuestions.length - 1}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-4 text-sm text-background disabled:opacity-40"
                  >
                    {t('下一题')} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {part === 'translation' && (
              <div className="mx-auto max-w-3xl">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-semibold">Part IV · Translation</h1>
                </div>
                <p className="mt-5 rounded-[18px] bg-white/30 p-4 text-sm leading-7">{exam?.translation.sentence}</p>
                <textarea
                  value={translation}
                  onChange={(event) => setTranslation(event.target.value)}
                  rows={12}
                  aria-label={t('翻译')}
                  placeholder={t('在此输入英文译文……')}
                  className="mt-5 w-full rounded-[18px] border border-white/60 bg-white/34 p-4 text-sm leading-7 outline-none focus:border-primary"
                />
              </div>
            )}

            {part === 'review' && (
              <div className="mx-auto max-w-2xl">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-semibold">{t('交卷检查')}</h1>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    [t('写作'), Boolean(writing.trim()), t('已填写作文')],
                    [t('听力'), listeningQuestions.every((question) => answers[question.id] !== undefined), `${listeningQuestions.filter((question) => answers[question.id] !== undefined).length} / ${listeningQuestions.length}`],
                    [t('阅读'), readingQuestions.every((question) => answers[question.id] !== undefined), `${readingQuestions.filter((question) => answers[question.id] !== undefined).length} / ${readingQuestions.length}`],
                    [t('翻译'), Boolean(translation.trim()), t('已填写译文')],
                  ].map(([label, complete, detail]) => (
                    <div key={String(label)} className="flex min-h-12 items-center justify-between rounded-[16px] bg-white/28 px-4">
                      <span className="flex items-center gap-2 text-sm">
                        {complete ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <XCircle className="h-4 w-4 text-foreground/30" />}
                        {label}
                      </span>
                      <span className="text-xs text-foreground/48">{detail}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmSubmit(true)}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-white"
                >
                  <Send className="h-4 w-4" /> {t('提交试卷')}
                </button>
                <Link to="/practice" className="ml-3 inline-flex min-h-11 items-center text-sm text-foreground/50 hover:text-foreground">
                  {t('退出并返回练习')}
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>

      <ConfirmDialog
        open={confirmSubmit}
        title={t('确认交卷')}
        message={t('还有 {n} 道客观题未作答。交卷后将不能修改答案，并立即显示解析。', { n: questions.length - answeredCount })}
        onCancel={() => setConfirmSubmit(false)}
        onConfirm={() => finishExam(false)}
      />
    </>
  );
}
