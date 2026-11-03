import { describe, expect, it } from 'vitest';
import { buildDailyPlan, daysUntilExam, nextStudyTask, planCompletion } from '../study-plan';

describe('每日学习计划', () => {
  it('复习目标在作答过程中保持稳定', () => {
    const before = buildDailyPlan({
      dueToday: 20,
      dailyTarget: 15,
      reviewsToday: 0,
      newWordsToday: 0,
      listeningToday: 0,
      questionsToday: 0,
    });
    const after = buildDailyPlan({
      dueToday: 15,
      dailyTarget: 15,
      reviewsToday: 5,
      newWordsToday: 0,
      listeningToday: 0,
      questionsToday: 0,
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
      listeningToday: 0,
      questionsToday: 4,
    });

    expect(tasks[0].done).toBe(true);
    expect(tasks[1].done).toBe(true);
    expect(planCompletion(tasks)).toBe(60);
    expect(nextStudyTask(tasks)?.id).toBe('listening');
  });

  it('计划强度调整新词、听力和题型目标', () => {
    const common = {
      dueToday: 0,
      dailyTarget: 15,
      reviewsToday: 0,
      newWordsToday: 0,
      listeningToday: 0,
      questionsToday: 0,
    };
    const light = buildDailyPlan({ ...common, intensity: 'light' });
    const sprint = buildDailyPlan({ ...common, intensity: 'sprint' });

    expect(light[1].target).toBe(8);
    expect(light[2].target).toBe(1);
    expect(light[3].target).toBe(5);
    expect(sprint[2].target).toBe(2);
    expect(sprint[3].target).toBe(20);
  });

  it('考试倒计时按本地日期计算', () => {
    const now = new Date(2026, 9, 25, 18, 0, 0);
    expect(daysUntilExam('2026-11-04', now)).toBe(10);
    expect(daysUntilExam('2026-10-20', now)).toBe(0);
    expect(daysUntilExam('', now)).toBeNull();
  });
});
