// EXPORTS: ProgressProvider (default)
// 学习进度 Provider：初始化从 localStorage 读取，变更后持久化，并暴露各学习动作。

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ProgressContext,
  INITIAL_PROGRESS,
  getTodayStr,
  calcStreakCount,
} from '@/context/progress-context';
import type { IProgress, MockExamAttempt } from '@/context/progress-context';
import { srsReview as applyReview } from '@/lib/srs/adapter';
import { INITIAL_MEMORY } from '@/lib/memory';
import type { Rating, WordMemory } from '@/lib/memory';
import { store } from '@/lib/store';
import {
  cloudAccountsEnabled,
  cloudPullProgress,
  cloudPushProgress,
} from '@/lib/cloud-sync';
import {
  hasProgressData,
  mergeProgressSnapshots,
  normalizeProgress,
  progressSnapshotsEqual,
} from '@/lib/progress-sync';
import { VOCAB_WORDS } from '@/data/words';

const CLOUD_SYNC_INTERVAL_MS = 30_000;

function withCheckIn(p: IProgress): IProgress {
  const today = getTodayStr();
  if (p.streakDates.includes(today)) return p;
  return { ...p, streakDates: [...p.streakDates, today] };
}

function addDailyActivity(
  p: IProgress,
  field: keyof IProgress['dailyActivity'][string],
  amount = 1,
): IProgress {
  const today = getTodayStr();
  const current = p.dailyActivity[today] ?? { newWords: 0, reviews: 0, listening: 0, questions: 0 };
  return {
    ...p,
    dailyActivity: {
      ...p.dailyActivity,
      [today]: { ...current, [field]: current[field] + amount },
    },
  };
}

// ===== 测试用 mock 数据：注入一次后写标记，不再重复注入 =====
const MOCK_FLAG = 'moran_mocked_v3';

function buildMockProgress(): IProgress {
  const now = Date.now();
  const DAY = 86400000;

  // 过去 10 天日期（含今天）
  const streakDates: string[] = [];
  for (let i = 9; i >= 0; i--) {
    const d = new Date(now - i * DAY);
    streakDates.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    );
  }

  // 每天学习时长：25~50 分钟
  const studyLog: Record<string, number> = {};
  streakDates.forEach((day, i) => {
    studyLog[day] = 1500 + ((i * 733) % 1500);
  });

  const allIds = VOCAB_WORDS.slice(0, 98).map((word) => word.id);

  // 分配：68% mastered（记的很准）、10% 模糊、22% 忘记
  const masteredCount = Math.round(allIds.length * 0.68); // 67
  const fuzzyCount = Math.round(allIds.length * 0.1); // 10

  const memory: Record<string, WordMemory> = {};
  const reviewLog: Array<{ wordId: string; rating: Rating; ts: number }> = [];

  allIds.forEach((id, idx) => {
    // 学习时间分散在过去 1~10 天
    const learnedAt = now - (1 + (idx % 9)) * DAY - (idx * 3600000) % DAY;
    let mem: WordMemory;
    let rating: Rating;
    if (idx < masteredCount) {
      // 记的很准：mastered，ease 高，间隔长
      mem = {
        status: 'mastered',
        ease: 2.6 + (idx % 4) * 0.1,
        interval: 30 + (idx % 4) * 30,
        due: now + (5 + (idx % 20)) * DAY,
        reps: 4 + (idx % 3),
        lapses: 0,
        lastRating: 3,
        learnedAt,
      };
      rating = 3;
    } else if (idx < masteredCount + fuzzyCount) {
      // 模糊：learning，ease 中等，间隔短
      mem = {
        status: 'learning',
        ease: 1.7 + (idx % 3) * 0.1,
        interval: 1 + (idx % 2),
        due: now - (idx % 2) * 3600000,
        reps: 2 + (idx % 2),
        lapses: 1,
        lastRating: 1,
        learnedAt,
      };
      rating = 1;
    } else {
      // 忘记：learning，ease 低，lapses 多，due 已过期
      mem = {
        status: 'learning',
        ease: 1.3 + (idx % 3) * 0.1,
        interval: 0,
        due: now - (1 + (idx % 3)) * DAY,
        reps: 3 + (idx % 3),
        lapses: 2 + (idx % 2),
        lastRating: 0,
        learnedAt,
      };
      rating = 0;
    }
    memory[id] = mem;
    // 每条词造 2~4 条复习记录
    const nReviews = 2 + (idx % 3);
    for (let r = 0; r < nReviews; r++) {
      reviewLog.push({
        wordId: id,
        rating: r === nReviews - 1 ? rating : (rating >= 2 ? 2 : rating),
        ts: learnedAt + r * DAY * 0.8,
      });
    }
  });

  // wordStats：根据 rating 分布
  const wordStats: Record<string, { correct: number; wrong: number }> = {};
  allIds.forEach((id, idx) => {
    if (idx < masteredCount) wordStats[id] = { correct: 3 + (idx % 2), wrong: 0 };
    else if (idx < masteredCount + fuzzyCount) wordStats[id] = { correct: 2, wrong: 1 };
    else wordStats[id] = { correct: 1, wrong: 2 };
  });

  return {
    learnedWords: allIds,
    favoriteWords: [],
    wordStats,
    memory,
    listeningDone: [],
    questionResults: {},
    streakDates,
    reviewLog: reviewLog.sort((a, b) => a.ts - b.ts),
    studyLog,
    dailyActivity: {},
    mockExamAttempts: [],
  };
}

export default function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<IProgress>(() => {
    // 首次注入测试 mock 数据（只注入一次）
    if (import.meta.env.DEV && !store.get(MOCK_FLAG, false)) {
      const mock = buildMockProgress();
      store.set('progress', mock);
      store.set(MOCK_FLAG, true);
      return mock;
    }
    const loaded = store.get('progress', INITIAL_PROGRESS);
    // 兼容旧数据：补齐 memory 字段
    return {
      ...INITIAL_PROGRESS,
      ...loaded,
      memory: loaded.memory ?? {},
      dailyActivity: loaded.dailyActivity ?? {},
      mockExamAttempts: loaded.mockExamAttempts ?? [],
    };
  });
  const progressRef = useRef(progress);
  const cloudStateRef = useRef({
    revision: 0,
    hydrated: false,
    dirty: false,
    syncing: false,
  });
  const skipNextAutosaveRef = useRef(false);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const applyCloudProgress = useCallback((data: unknown) => {
    const next = normalizeProgress(data);
    skipNextAutosaveRef.current = true;
    progressRef.current = next;
    setProgress(next);
  }, []);

  const pushProgress = useCallback(async () => {
    if (!cloudAccountsEnabled || cloudStateRef.current.syncing) return;
    if (!localStorage.getItem('moran_token')) return;
    cloudStateRef.current.syncing = true;
    try {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const snapshot = progressRef.current;
        const pushed = JSON.stringify(normalizeProgress(snapshot));
        const result = await cloudPushProgress(snapshot, cloudStateRef.current.revision);
        if (result.unauthorized) {
          cloudStateRef.current.dirty = false;
          return;
        }
        if (result.conflict && result.data) {
          cloudStateRef.current.revision = Number(result.revision || 0);
          const merged = mergeProgressSnapshots(snapshot, result.data);
          if (!progressSnapshotsEqual(merged, snapshot)) applyCloudProgress(merged);
          continue;
        }
        if (result.ok) {
          cloudStateRef.current.revision = Number(result.revision || cloudStateRef.current.revision);
          if (JSON.stringify(normalizeProgress(progressRef.current)) === pushed) {
            cloudStateRef.current.dirty = false;
          }
          return;
        }
        return;
      }
    } finally {
      cloudStateRef.current.syncing = false;
    }
  }, [applyCloudProgress]);

  const pullProgress = useCallback(async (mergeLocal: boolean) => {
    if (!cloudAccountsEnabled || cloudStateRef.current.syncing) return;
    cloudStateRef.current.syncing = true;
    try {
      const snapshot = await cloudPullProgress();
      if (!snapshot?.data) return;
      const remoteRevision = Number(snapshot.revision || 0);
      if (!mergeLocal && remoteRevision <= cloudStateRef.current.revision) return;
      const local = progressRef.current;
      const next = mergeLocal
        ? mergeProgressSnapshots(local, snapshot.data)
        : normalizeProgress(snapshot.data);
      cloudStateRef.current.revision = remoteRevision;
      if (!progressSnapshotsEqual(next, local)) applyCloudProgress(next);
      if (mergeLocal && !progressSnapshotsEqual(next, snapshot.data)) {
        cloudStateRef.current.dirty = true;
      }
    } finally {
      cloudStateRef.current.syncing = false;
    }
  }, [applyCloudProgress]);

  useEffect(() => {
    store.set('progress', progress);
    if (!cloudAccountsEnabled || !cloudStateRef.current.hydrated) return;
    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }
    cloudStateRef.current.dirty = true;
    const timer = window.setTimeout(() => {
      void pushProgress();
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [progress, pushProgress]);

  useEffect(() => {
    if (!cloudAccountsEnabled) return;
    let active = true;
    const hydrateFromCloud = async () => {
      if (!localStorage.getItem('moran_token')) {
        cloudStateRef.current.hydrated = true;
        return;
      }
      cloudStateRef.current.hydrated = false;
      await pullProgress(true);
      if (!active) return;
      if (cloudStateRef.current.dirty || (!cloudStateRef.current.revision && hasProgressData(progressRef.current))) {
        await pushProgress();
      }
      cloudStateRef.current.hydrated = true;
    };

    void hydrateFromCloud();

    const syncNow = async () => {
      if (document.hidden || !localStorage.getItem('moran_token')) return;
      if (cloudStateRef.current.dirty) {
        await pushProgress();
      } else {
        await pullProgress(false);
      }
    };

    const handler = () => {
      cloudStateRef.current.revision = 0;
      cloudStateRef.current.dirty = false;
      void hydrateFromCloud();
    };
    window.addEventListener('moran:auth-changed', handler);
    window.addEventListener('focus', syncNow);
    const handleVisibility = () => {
      if (!document.hidden) void syncNow();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    const timer = window.setInterval(() => {
      void syncNow();
    }, CLOUD_SYNC_INTERVAL_MS);
    return () => {
      active = false;
      window.removeEventListener('moran:auth-changed', handler);
      window.removeEventListener('focus', syncNow);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearInterval(timer);
    };
  }, [pullProgress, pushProgress]);

  const markWordLearned = useCallback((id: string) => {
    setProgress((p) => {
      const checked = withCheckIn(p);
      if (checked.learnedWords.includes(id)) return checked;
      return addDailyActivity(
        { ...checked, learnedWords: [...checked.learnedWords, id] },
        'newWords',
      );
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setProgress((p) => {
      const checked = withCheckIn(p);
      const has = checked.favoriteWords.includes(id);
      return {
        ...checked,
        favoriteWords: has
          ? checked.favoriteWords.filter((w) => w !== id)
          : [...checked.favoriteWords, id],
      };
    });
  }, []);

  const recordWordResult = useCallback((id: string, correct: boolean) => {
    setProgress((p) => {
      const checked = withCheckIn(p);
      const prev = checked.wordStats[id] ?? { correct: 0, wrong: 0 };
      return addDailyActivity({
        ...checked,
        wordStats: {
          ...checked.wordStats,
          [id]: correct
            ? { correct: prev.correct + 1, wrong: prev.wrong }
            : { correct: prev.correct, wrong: prev.wrong + 1 },
        },
      }, 'questions');
    });
  }, []);

  const reviewWord = useCallback((id: string, rating: Rating) => {
    setProgress((p) => {
      const checked = withCheckIn(p);
      const isNewWord = !checked.memory[id];
      const prev = checked.memory[id] ?? INITIAL_MEMORY;
      return addDailyActivity(
        {
          ...checked,
          learnedWords: isNewWord ? [...checked.learnedWords, id] : checked.learnedWords,
          memory: { ...checked.memory, [id]: applyReview(id, prev, rating) },
          reviewLog: [...checked.reviewLog, { wordId: id, rating, ts: Date.now() }],
        },
        isNewWord ? 'newWords' : 'reviews',
      );
    });
  }, []);

  const addStudySeconds = useCallback((day: string, secs: number) => {
    if (!(secs > 0)) return;
    setProgress((p) => {
      const checked = withCheckIn(p);
      return {
        ...checked,
        studyLog: { ...checked.studyLog, [day]: (checked.studyLog[day] ?? 0) + secs },
      };
    });
  }, []);

  const markListeningDone = useCallback((id: string) => {
    setProgress((p) => {
      const checked = withCheckIn(p);
      if (checked.listeningDone.includes(id)) return checked;
      return addDailyActivity(
        { ...checked, listeningDone: [...checked.listeningDone, id] },
        'listening',
      );
    });
  }, []);

  const recordQuestion = useCallback((qid: string, correct: boolean) => {
    setProgress((p) => {
      const checked = withCheckIn(p);
      return addDailyActivity(
        { ...checked, questionResults: { ...checked.questionResults, [qid]: correct } },
        'questions',
      );
    });
  }, []);

  const recordMockExamAttempt = useCallback((attempt: MockExamAttempt) => {
    setProgress((p) => {
      const checked = withCheckIn(p);
      return {
        ...addDailyActivity(checked, 'questions', Object.keys(attempt.answers).length),
        mockExamAttempts: [...checked.mockExamAttempts, attempt],
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ ...INITIAL_PROGRESS });
  }, []);

  const restoreProgress = useCallback((snapshot: IProgress) => {
    setProgress(snapshot);
  }, []);

  const todayCheckedIn = useMemo(() => {
    const today = getTodayStr();
    return progress.streakDates.includes(today);
  }, [progress.streakDates]);

  const streakCount = useMemo(
    () => calcStreakCount(progress.streakDates),
    [progress.streakDates],
  );

  const value = useMemo(
    () => ({
      progress,
      markWordLearned,
      toggleFavorite,
      recordWordResult,
      reviewWord,
      addStudySeconds,
      markListeningDone,
      recordQuestion,
      recordMockExamAttempt,
      resetProgress,
      restoreProgress,
      todayCheckedIn,
      streakCount,
    }),
    [
      progress,
      markWordLearned,
      toggleFavorite,
      recordWordResult,
      reviewWord,
      addStudySeconds,
      markListeningDone,
      recordQuestion,
      recordMockExamAttempt,
      resetProgress,
      restoreProgress,
      todayCheckedIn,
      streakCount,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
