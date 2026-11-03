import { describe, expect, it } from 'vitest';
import {
  hasProgressData,
  mergeProgressSnapshots,
  progressSnapshotsEqual,
} from '@/lib/progress-sync';
import type { IProgress } from '@/context/progress-context';
import { INITIAL_PROGRESS } from '@/context/progress-context';

const local: IProgress = {
  ...INITIAL_PROGRESS,
  learnedWords: ['apple', 'book'],
  favoriteWords: ['apple'],
  memory: {
    apple: {
      status: 'learning',
      ease: 2.5,
      interval: 1,
      due: 1000,
      reps: 1,
      lapses: 0,
      lastRating: 2,
      learnedAt: 100,
    },
  },
  reviewLog: [{ wordId: 'apple', rating: 2, ts: 100 }],
  dailyActivity: {
    '2026-11-03': { newWords: 2, reviews: 0, listening: 0, questions: 0 },
  },
};

const remote: IProgress = {
  ...INITIAL_PROGRESS,
  learnedWords: ['book', 'cloud'],
  favoriteWords: ['cloud'],
  memory: {
    apple: {
      status: 'mastered',
      ease: 2.7,
      interval: 30,
      due: 2000,
      reps: 3,
      lapses: 0,
      lastRating: 3,
      learnedAt: 100,
    },
  },
  reviewLog: [
    { wordId: 'apple', rating: 2, ts: 100 },
    { wordId: 'cloud', rating: 3, ts: 200 },
  ],
  dailyActivity: {
    '2026-11-03': { newWords: 1, reviews: 1, listening: 0, questions: 0 },
  },
};

describe('progress sync merge', () => {
  it('keeps learned work from both devices', () => {
    const merged = mergeProgressSnapshots(local, remote);
    expect(merged.learnedWords).toEqual(['apple', 'book', 'cloud']);
    expect(merged.favoriteWords).toEqual(['apple', 'cloud']);
    expect(merged.memory.apple.reps).toBe(3);
    expect(merged.reviewLog).toHaveLength(2);
    expect(merged.dailyActivity['2026-11-03']).toEqual({
      newWords: 2,
      reviews: 1,
      listening: 0,
      questions: 0,
    });
  });

  it('does not inflate counters when the same snapshot is merged repeatedly', () => {
    const once = mergeProgressSnapshots(local, remote);
    const twice = mergeProgressSnapshots(once, remote);
    expect(twice).toEqual(once);
    expect(progressSnapshotsEqual(once, twice)).toBe(true);
  });

  it('accepts the old partial progress document', () => {
    const merged = mergeProgressSnapshots({ learnedWords: ['apple'] }, remote);
    expect(merged.learnedWords).toContain('cloud');
    expect(hasProgressData(merged)).toBe(true);
    expect(hasProgressData(INITIAL_PROGRESS)).toBe(false);
  });
});
