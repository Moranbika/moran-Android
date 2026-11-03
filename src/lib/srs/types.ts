// srs/types.ts — 间隔重复算法核心类型
// 独立纯 TS 模块，不依赖 React / Electron / Drift。
// 后续可平滑替换成 FSRS，只需实现同一个 SrsScheduler 接口。

/** 四档评分：忘记 / 模糊 / 记得 / 简单 */
export type Rating = 0 | 1 | 2 | 3;

export const RatingAgain: Rating = 0;
export const RatingHard: Rating = 1;
export const RatingGood: Rating = 2;
export const RatingEasy: Rating = 3;

/** 词的学习阶段 */
export type WordStatus = 'new' | 'learning' | 'review' | 'relearning';

/** 单个词在用户脑中的记忆状态（与 DB 表一一对应） */
export interface SrsState {
  wordId: string;
  status: WordStatus;
  /** 总复习次数 */
  reps: number;
  /** 遗忘次数 */
  lapses: number;
  /** 当前间隔（天，浮点）。learning 阶段可能是分钟级。 */
  intervalDays: number;
  /** SM-2 难度系数（1.3 ~ 2.5+） */
  easeFactor: number;
  /** FSRS 预留：记忆稳定性（天） */
  stability: number;
  /** FSRS 预留：难度（1~10） */
  difficulty: number;
  /** 下次到期时间 */
  dueAt: Date;
  /** 上次复习时间 */
  lastReviewAt: Date | null;
  /** 首次学习时间 */
  learnedAt: Date | null;
}

/** 一次复习产生的日志（只追加，永不更新） */
export interface ReviewLog {
  wordId: string;
  reviewedAt: Date;
  rating: Rating;
  /** 反应时长（毫秒） */
  reactionMs: number;
  /** 本次复习前计划的间隔（天） */
  scheduledIntervalDays: number;
  /** 实际经过的间隔（天） */
  elapsedDays: number;
  /** 复习前的可提取性 0~1（FSRS 用，SM-2 阶段先存 null） */
  retrievabilityBefore: number | null;
  /** 算法版本 */
  algorithmVersion: string;
}

/** 时钟抽象，便于测试跨天 */
export interface Clock {
  now(): Date;
}

/** 固定北京时间时钟 */
export class BeijingClock implements Clock {
  now(): Date {
    return new Date();
  }
}

/** 可注入的测试时钟 */
export class FakeClock implements Clock {
  private _now: Date;
  constructor(initial: Date) {
    this._now = initial;
  }
  now(): Date {
    return this._now;
  }
  set(d: Date) {
    this._now = d;
  }
  advance(ms: number) {
    this._now = new Date(this._now.getTime() + ms);
  }
}

/** 调度结果：新状态 + 日志 */
export interface SrsResult {
  newState: SrsState;
  log: ReviewLog;
}

/** 算法调度器接口。SM-2 和 FSRS 都实现这个。 */
export interface SrsScheduler {
  readonly version: string;
  /** 新词首次学习 */
  learnNew(wordId: string, rating: Rating, reactionMs: number, clock: Clock): SrsResult;
  /** 复习已有词 */
  review(current: SrsState, rating: Rating, reactionMs: number, clock: Clock): SrsResult;
  /** 预测未来 N 天每天到期数（首页仪表盘用） */
  predictDue(states: SrsState[], days: number): Map<string, number>;
}
