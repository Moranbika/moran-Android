import { describe, expect, it } from 'vitest';
import { formatClock, scoreObjectiveQuestions, type ObjectiveExamQuestion } from '../mock-exam';

const questions: ObjectiveExamQuestion[] = [
  {
    id: 'l1', no: 1, section: 'listening', prompt: '', options: [], answer: 0, analysis: '',
  },
  {
    id: 'l2', no: 2, section: 'listening', prompt: '', options: [], answer: 1, analysis: '',
  },
  {
    id: 'r1', no: 46, section: 'reading', prompt: '', options: [], answer: 2, analysis: '',
  },
];

describe('限时模考', () => {
  it('按听力与阅读分组计分', () => {
    const result = scoreObjectiveQuestions(questions, { l1: 0, l2: 0, r1: 2 });
    expect(result.listening).toEqual({ correct: 1, total: 2 });
    expect(result.reading).toEqual({ correct: 1, total: 1 });
    expect(result.correct).toBe(2);
    expect(result.answered).toBe(3);
  });

  it('格式化考试倒计时', () => {
    expect(formatClock(7800)).toBe('02:10:00');
    expect(formatClock(-1)).toBe('00:00:00');
  });
});
