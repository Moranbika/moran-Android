import { describe, expect, it } from 'vitest';
import { buildDailyPlan, nextStudyTask, planCompletion } from '../study-plan';

describe('每日学习计划', () => {
  it('复习目标在作答过程中保持稳定', () => {
    const before = buildDailyPlan({
      dueToday: 20,
      dailyTarget: 15,
      reviewsToday: 0,
      newWordsToday: 0,
    });
    const after = buildDailyPlan({
      dueToday: 15,
      dailyTarget: 15,
      reviewsToday: 5,
      newWordsToday: 0,
    });

    expect(before[0].target).toBe(20);
    expect(after[0].target).toBe(20);
    expect(after[0].completed).toBe(5);
    expect(after[0].percent).toBe(25);
  });

  it('按真实完成量计算总进度与下一项', () => {
    const tasks = buildDailyPlan({
      dueToday: 0,
      dailyTarget: 15,
      reviewsToday: 0,
      newWordsToday: 15,
    });

    expect(tasks[0].done).toBe(true);
    expect(tasks[1].done).toBe(true);
    expect(planCompletion(tasks)).toBe(100);
    expect(nextStudyTask(tasks)).toBeUndefined();
  });
});
