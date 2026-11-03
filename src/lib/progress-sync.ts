import type {
  DailyActivity,
  IProgress,
  MockExamAttempt,
  ReviewLog,
} from '@/context/progress-context';
import { INITIAL_PROGRESS } from '@/context/progress-context';
import type { WordMemory } from '@/lib/memory';

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0))];
}

function asRecord<T>(value: unknown): Record<string, T> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, T>
    : {};
}

function normalizeDailyActivity(value: unknown): Record<string, DailyActivity> {
  const source = asRecord<Partial<DailyActivity>>(value);
  return Object.fromEntries(Object.entries(source).map(([day, item]) => [
    day,
    {
      newWords: Number(item?.newWords || 0),
      reviews: Number(item?.reviews || 0),
      listening: Number(item?.listening || 0),
      questions: Number(item?.questions || 0),
    },
  ]));
}

export function normalizeProgress(value: unknown): IProgress {
  const source = value && typeof value === 'object'
    ? value as Partial<IProgress>
    : {};
  return {
    ...INITIAL_PROGRESS,
    learnedWords: uniqueStrings(source.learnedWords),
    favoriteWords: uniqueStrings(source.favoriteWords),
    wordStats: asRecord<{ correct: number; wrong: number }>(source.wordStats),
    memory: asRecord<WordMemory>(source.memory),
    listeningDone: uniqueStrings(source.listeningDone),
    questionResults: asRecord<boolean>(source.questionResults),
    streakDates: uniqueStrings(source.streakDates),
    reviewLog: Array.isArray(source.reviewLog) ? source.reviewLog.filter(
      (item): item is ReviewLog => Boolean(item && Number.isFinite(item.ts)),
    ) : [],
    studyLog: asRecord<number>(source.studyLog),
    dailyActivity: normalizeDailyActivity(source.dailyActivity),
    mockExamAttempts: Array.isArray(source.mockExamAttempts)
      ? source.mockExamAttempts.filter((item): item is MockExamAttempt => Boolean(item && item.id))
      : [],
  };
}

function mergeMemory(left?: WordMemory, right?: WordMemory): WordMemory {
  if (!left) return right as WordMemory;
  if (!right) return left;
  if (left.reps !== right.reps) return left.reps > right.reps ? left : right;
  if (left.due !== right.due) return left.due > right.due ? left : right;
  return left.learnedAt >= right.learnedAt ? left : right;
}

function mergeMockExams(left: MockExamAttempt[], right: MockExamAttempt[]): MockExamAttempt[] {
  const merged = new Map<string, MockExamAttempt>();
  for (const attempt of [...left, ...right]) {
    const key = attempt.id || `${attempt.examSetId}:${attempt.completedAt}`;
    const current = merged.get(key);
    if (!current || Number(attempt.completedAt || 0) >= Number(current.completedAt || 0)) {
      merged.set(key, attempt);
    }
  }
  return [...merged.values()].sort((a, b) => Number(a.completedAt || 0) - Number(b.completedAt || 0));
}

function mergeReviewLogs(left: ReviewLog[], right: ReviewLog[]): ReviewLog[] {
  const merged = new Map<string, ReviewLog>();
  for (const item of [...left, ...right]) {
    merged.set(`${item.wordId}:${item.ts}:${item.rating}`, item);
  }
  return [...merged.values()].sort((a, b) => a.ts - b.ts);
}

/**
 * Merges two progress snapshots without discarding completed work.
 * Counters use max rather than sum so repeated syncs do not inflate activity.
 */
export function mergeProgressSnapshots(localValue: unknown, remoteValue: unknown): IProgress {
  const local = normalizeProgress(localValue);
  const remote = normalizeProgress(remoteValue);

  const memory: Record<string, WordMemory> = {};
  for (const id of new Set([...Object.keys(local.memory), ...Object.keys(remote.memory)])) {
    const item = mergeMemory(local.memory[id], remote.memory[id]);
    if (item) memory[id] = item;
  }

  const wordStats: Record<string, { correct: number; wrong: number }> = {};
  for (const id of new Set([...Object.keys(local.wordStats), ...Object.keys(remote.wordStats)])) {
    const left = local.wordStats[id];
    const right = remote.wordStats[id];
    wordStats[id] = {
      correct: Math.max(Number(left?.correct || 0), Number(right?.correct || 0)),
      wrong: Math.max(Number(left?.wrong || 0), Number(right?.wrong || 0)),
    };
  }

  const studyLog: Record<string, number> = {};
  for (const day of new Set([...Object.keys(local.studyLog), ...Object.keys(remote.studyLog)])) {
    studyLog[day] = Math.max(Number(local.studyLog[day] || 0), Number(remote.studyLog[day] || 0));
  }

  const dailyActivity: Record<string, DailyActivity> = {};
  for (const day of new Set([...Object.keys(local.dailyActivity), ...Object.keys(remote.dailyActivity)])) {
    const left = local.dailyActivity[day];
    const right = remote.dailyActivity[day];
    dailyActivity[day] = {
      newWords: Math.max(Number(left?.newWords || 0), Number(right?.newWords || 0)),
      reviews: Math.max(Number(left?.reviews || 0), Number(right?.reviews || 0)),
      listening: Math.max(Number(left?.listening || 0), Number(right?.listening || 0)),
      questions: Math.max(Number(left?.questions || 0), Number(right?.questions || 0)),
    };
  }

  return {
    learnedWords: uniqueStrings([...local.learnedWords, ...remote.learnedWords]),
    favoriteWords: uniqueStrings([...local.favoriteWords, ...remote.favoriteWords]),
    wordStats,
    memory,
    listeningDone: uniqueStrings([...local.listeningDone, ...remote.listeningDone]),
    questionResults: { ...remote.questionResults, ...local.questionResults },
    streakDates: uniqueStrings([...local.streakDates, ...remote.streakDates]).sort(),
    reviewLog: mergeReviewLogs(local.reviewLog, remote.reviewLog),
    studyLog,
    dailyActivity,
    mockExamAttempts: mergeMockExams(local.mockExamAttempts, remote.mockExamAttempts),
  };
}

export function progressSnapshotsEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(normalizeProgress(left)) === JSON.stringify(normalizeProgress(right));
}

export function hasProgressData(value: unknown): boolean {
  const progress = normalizeProgress(value);
  return progress.learnedWords.length > 0
    || progress.reviewLog.length > 0
    || progress.mockExamAttempts.length > 0
    || Object.keys(progress.memory).length > 0
    || Object.keys(progress.studyLog).length > 0
    || Object.keys(progress.dailyActivity).length > 0;
}
