// srs/sm2.ts — SM-2 间隔重复算法实现（SuperMemo 2 公开算法）
// 参考：https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
// 不复制墨墨专有算法，基于公开 SM-2 并适配四档评分。

import {
  type Clock, type Rating, type ReviewLog, type SrsResult, type SrsState,
  RatingAgain, RatingHard, RatingGood, RatingEasy,
} from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_MS = 60 * 1000;

/** EF 下限（SM-2 标准） */
const MIN_EF = 1.3;
/** 默认初始 EF */
const INITIAL_EF = 2.5;

/**
 * 四档评分 → SM-2 原始质量分 q（0~5）
 * again=0 → q=1（完全没记住）
 * hard=1  → q=3（困难但想起来了）
 * good=2  → q=4（顺利想起来）
 * easy=3  → q=5（非常容易）
 */
function ratingToQ(r: Rating): number {
  switch (r) {
    case RatingAgain: return 1;
    case RatingHard: return 3;
    case RatingGood: return 4;
    case RatingEasy: return 5;
  }
}

/**
 * 新词首次学习的初始间隔（分钟）。
 * 学习阶段（learning）用分钟级间隔，当天多次出现直到稳定。
 */
function initialIntervalMinutes(rating: Rating): number {
  // reps=0：第一次见
  if (rating === RatingAgain) return 1;       // 忘了 → 1 分钟后重学
  if (rating === RatingHard) return 5;        // 模糊 → 5 分钟
  if (rating === RatingGood) return 10;       // 记得 → 10 分钟
  return 60;                                  // 简单 → 1 小时后进入正式排期
}

export class Sm2Scheduler {
  readonly version = 'sm2_v1';

  learnNew(wordId: string, rating: Rating, reactionMs: number, clock: Clock): SrsResult {
    const now = clock.now();
    const intervalMin = initialIntervalMinutes(rating);
    const dueAt = new Date(now.getTime() + intervalMin * MIN_MS);

    // 简单评分直接进入 review 阶段（1 天后），否则留在 learning
    const isReview = rating === RatingEasy;
    const state: SrsState = {
      wordId,
      status: isReview ? 'review' : 'learning',
      reps: 1,
      lapses: rating === RatingAgain ? 1 : 0,
      intervalDays: isReview ? 1 : intervalMin / (60 * 24),
      easeFactor: INITIAL_EF,
      stability: isReview ? 1 : 0.1,
      difficulty: rating === RatingAgain ? 5 : 3,
      dueAt,
      lastReviewAt: now,
      learnedAt: now,
    };

    const log: ReviewLog = {
      wordId,
      reviewedAt: now,
      rating,
      reactionMs,
      scheduledIntervalDays: 0,
      elapsedDays: 0,
      retrievabilityBefore: null,
      algorithmVersion: this.version,
    };

    return { newState: state, log };
  }

  review(current: SrsState, rating: Rating, reactionMs: number, clock: Clock): SrsResult {
    const now = clock.now();
    const q = ratingToQ(rating);

    // 更新 EF：SM-2 标准公式
    let ef = current.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (ef < MIN_EF) ef = MIN_EF;

    const prevInterval = current.intervalDays;
    const elapsedDays = current.lastReviewAt
      ? (now.getTime() - current.lastReviewAt.getTime()) / DAY_MS
      : 0;

    let newInterval: number;
    let newStatus = current.status;
    let lapses = current.lapses;
    const reps = current.reps + 1;

    if (rating === RatingAgain) {
      // 遗忘：打回 learning，短期重学
      lapses += 1;
      newStatus = 'relearning';
      newInterval = 0.0007; // 约 1 分钟
    } else if (current.status === 'learning' || current.status === 'relearning') {
      // 还在学习阶段：按分钟级推进，连对后进入 review
      if (rating === RatingHard) {
        newInterval = prevInterval + 0.003; // 多几分钟
      } else if (rating === RatingGood) {
        newInterval = 0.5; // 半天后
        newStatus = 'review';
      } else {
        // easy
        newInterval = 1; // 1 天后
        newStatus = 'review';
      }
    } else {
      // review 阶段：正式间隔 * EF
      if (reps === 1) {
        newInterval = 1;
      } else if (reps === 2) {
        newInterval = 3;
      } else {
        newInterval = prevInterval * ef;
      }
      if (rating === RatingHard) newInterval *= 0.8;
      else if (rating === RatingEasy) newInterval *= 1.3;
    }

    const dueAt = new Date(now.getTime() + newInterval * DAY_MS);

    // stability 更新（FSRS 预留字段）：EF 越高 stability 增长越快
    const stability = rating === RatingAgain
      ? 0.1
      : current.stability * (0.5 + ef / INITIAL_EF * 0.5);

    const difficulty = rating === RatingAgain
      ? Math.min(10, current.difficulty + 1)
      : Math.max(1, current.difficulty - 0.2);

    const newState: SrsState = {
      ...current,
      status: newStatus,
      reps,
      lapses,
      intervalDays: newInterval,
      easeFactor: ef,
      stability,
      difficulty,
      dueAt,
      lastReviewAt: now,
    };

    const log: ReviewLog = {
      wordId: current.wordId,
      reviewedAt: now,
      rating,
      reactionMs,
      scheduledIntervalDays: prevInterval,
      elapsedDays,
      retrievabilityBefore: null,
      algorithmVersion: this.version,
    };

    return { newState, log };
  }

  predictDue(states: SrsState[], days: number): Map<string, number> {
    const result = new Map<string, number>();
    const now = Date.now();
    for (let d = 0; d < days; d++) {
      const dayStart = now + d * DAY_MS;
      const dayEnd = dayStart + DAY_MS;
      const key = new Date(dayStart).toISOString().slice(0, 10);
      let count = 0;
      for (const s of states) {
        const t = s.dueAt.getTime();
        if (t >= dayStart && t < dayEnd) count++;
      }
      result.set(key, count);
    }
    return result;
  }
}
