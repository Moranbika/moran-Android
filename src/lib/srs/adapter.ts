// srs/adapter.ts — 适配层：把现有 WordMemory 接到 Sm2Scheduler
// 保持外部 WordMemory 接口不变，内部用 SM-2 真正算法调度。

import type { Rating, WordMemory, MemoryStatus } from '@/lib/memory';
import { Sm2Scheduler } from './sm2';
import { BeijingClock, type SrsState, Rating as SRating } from './types';

const scheduler = new Sm2Scheduler();
const clock = new BeijingClock();

/** WordMemory → SrsState */
function toSrsState(id: string, m: WordMemory): SrsState {
  const now = Date.now();
  return {
    wordId: id,
    status:
      m.status === 'new' ? 'new' :
      m.status === 'mastered' ? 'review' : 'learning',
    reps: m.reps,
    lapses: m.lapses,
    intervalDays: m.interval / 1, // 现有 interval 是天
    easeFactor: m.ease,
    stability: m.ease, // 复用 ease 作为 stability 近似
    difficulty: 5,
    dueAt: new Date(m.due || now),
    lastReviewAt: m.learnedAt ? new Date(m.learnedAt) : null,
    learnedAt: m.learnedAt ? new Date(m.learnedAt) : null,
  };
}

/** SrsState → WordMemory */
function fromSrsState(s: SrsState): WordMemory {
  const status: MemoryStatus =
    s.intervalDays >= 30 && s.reps >= 3 ? 'mastered' : 'learning';
  return {
    status,
    ease: s.easeFactor,
    interval: s.intervalDays,
    due: s.dueAt.getTime(),
    reps: s.reps,
    lapses: s.lapses,
    lastRating: s.lastReviewAt ? 2 : 2, // 由调用方覆盖
    learnedAt: s.learnedAt?.getTime() ?? 0,
  };
}

/** 真正的 SM-2 复习调度（替换 memory.ts 里的硬编码艾宾浩斯） */
export function srsReview(id: string, prev: WordMemory, rating: Rating, reactionMs = 500): WordMemory {
  const sr = toSrsState(id, prev);
  const r = sr.reps === 0 || prev.status === 'new'
    ? scheduler.learnNew(id, rating as SRating, reactionMs, clock)
    : scheduler.review(sr, rating as SRating, reactionMs, clock);
  const out = fromSrsState(r.newState);
  out.lastRating = rating;
  return out;
}

/** 按记忆衰减排序：stability 低（最容易忘）的排前面 */
export function sortByForgetting<T extends { id: string }>(
  items: T[],
  memory: Record<string, WordMemory>,
): T[] {
  return [...items].sort((a, b) => {
    const ma = memory[a.id];
    const mb = memory[b.id];
    // 都没学过的按原顺序
    if (!ma && !mb) return 0;
    if (!ma) return 1; // 新词排后
    if (!mb) return -1;
    // stability 低的先复习（最容易忘）
    const sa = ma.ease * (ma.interval || 0.01);
    const sb = mb.ease * (mb.interval || 0.01);
    return sa - sb;
  });
}
