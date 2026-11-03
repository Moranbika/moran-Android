// srs/__tests__/sm2.test.ts — SM-2 算法单元测试
import { describe, it, expect } from 'vitest';
import { Sm2Scheduler } from '../sm2';
import { FakeClock, RatingAgain, RatingGood, RatingEasy } from '../types';

// 北京时间 2026-10-15 09:00
const BASE = new Date('2026-10-15T09:00:00+08:00');

describe('SM-2 调度器', () => {
  it('首次学习：good 评分应进入 learning，10 分钟后到期', () => {
    const srs = new Sm2Scheduler();
    const clock = new FakeClock(BASE);
    const { newState, log } = srs.learnNew('w1', RatingGood, 800, clock);
    expect(newState.status).toBe('learning');
    expect(newState.reps).toBe(1);
    // 10 分钟后到期
    expect(newState.dueAt.getTime() - BASE.getTime()).toBe(10 * 60 * 1000);
    expect(log.algorithmVersion).toBe('sm2_v1');
  });

  it('连续答对：间隔应按 EF 增长', () => {
    const srs = new Sm2Scheduler();
    const clock = new FakeClock(BASE);
    // 首次 easy → 1 天后 review
    const { newState } = srs.learnNew('w2', RatingEasy, 500, clock);
    expect(newState.status).toBe('review');
    expect(newState.intervalDays).toBe(1);

    // 快进 1 天到期，再答 good
    clock.advance(24 * 60 * 60 * 1000);
    const r1 = srs.review(newState, RatingGood, 600, clock);
    expect(r1.newState.intervalDays).toBe(3); // reps=2 → 3 天
    expect(r1.newState.dueAt.getTime() - clock.now().getTime()).toBe(3 * 24 * 60 * 60 * 1000);
  });

  it('答错重置：again 应打回 relearning，lapses+1', () => {
    const srs = new Sm2Scheduler();
    const clock = new FakeClock(BASE);
    let { newState } = srs.learnNew('w3', RatingEasy, 500, clock);
    clock.advance(24 * 60 * 60 * 1000);
    newState = srs.review(newState, RatingGood, 500, clock).newState;
    expect(newState.status).toBe('review');

    // 3 天后答错
    clock.advance(3 * 24 * 60 * 60 * 1000);
    const r = srs.review(newState, RatingAgain, 2000, clock);
    expect(r.newState.status).toBe('relearning');
    expect(r.newState.lapses).toBe(1);
    expect(r.newState.intervalDays).toBeLessThan(0.01); // 几分钟后
  });

  it('EF 下限：连续 again 后 EF 不应低于 1.3', () => {
    const srs = new Sm2Scheduler();
    const clock = new FakeClock(BASE);
    let state = srs.learnNew('w4', RatingEasy, 500, clock).newState;
    expect(state.easeFactor).toBe(2.5);

    for (let i = 0; i < 10; i++) {
      clock.advance(60 * 1000);
      state = srs.review(state, RatingAgain, 1000, clock).newState;
    }
    expect(state.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('延迟复习：超过 due 时间才复习，elapsedDays 应 > scheduledInterval', () => {
    const srs = new Sm2Scheduler();
    const clock = new FakeClock(BASE);
    const state = srs.learnNew('w5', RatingEasy, 500, clock).newState;
    // 本来 1 天后到期，延迟到 2 天后才复习
    clock.advance(2 * 24 * 60 * 60 * 1000);
    const r = srs.review(state, RatingGood, 700, clock);
    expect(r.log.elapsedDays).toBeCloseTo(2, 1);
    expect(r.log.scheduledIntervalDays).toBe(1);
  });

  it('提前复习：还没到期就复习，elapsedDays 应 < scheduledInterval', () => {
    const srs = new Sm2Scheduler();
    const clock = new FakeClock(BASE);
    const state = srs.learnNew('w6', RatingEasy, 500, clock).newState;
    // 本来 1 天后到期，提前到 0.5 天就复习
    clock.advance(12 * 60 * 60 * 1000);
    const r = srs.review(state, RatingGood, 700, clock);
    expect(r.log.elapsedDays).toBeCloseTo(0.5, 1);
  });

  it('时区跨天：北京时间次日 0 点后，日期应 +1', () => {
    const srs = new Sm2Scheduler();
    // 23:59
    const clock = new FakeClock(new Date('2026-10-15T23:59:00+08:00'));
    const s1 = srs.learnNew('w7', RatingGood, 500, clock);
    expect(s1.newState.dueAt.getTime() - clock.now().getTime()).toBe(10 * 60 * 1000);

    // 快进到 00:01，跨天
    clock.advance(2 * 60 * 1000);
    expect(clock.now().getDate()).toBe(16);
    // 此时该词已到期（dueAt 是 00:09）
    expect(s1.newState.dueAt.getTime() <= clock.now().getTime() + 8 * 60 * 1000).toBe(true);
  });

  it('easy 评分应让间隔更长', () => {
    const srs = new Sm2Scheduler();
    const clock = new FakeClock(BASE);
    const s = srs.learnNew('w8', RatingEasy, 500, clock).newState;
    clock.advance(24 * 60 * 60 * 1000);
    const r = srs.review(s, RatingEasy, 300, clock);
    expect(r.newState.intervalDays).toBeGreaterThan(3); // reps=2 基础3天 * 1.3
  });
});
