import { describe, expect, it } from 'vitest';
import { buildEssayGradeReport, essayStats, gradeEssay, validateEssay } from '../grader';

describe('作文批改前置校验', () => {
  it('拒绝中文冒充英文作文', () => {
    const text = '时代法国红酒看来';
    const validation = validateEssay(text, 'cet6');
    const grade = gradeEssay(text, 'cet6');

    expect(validation.ok).toBe(false);
    expect(validation.reason).toContain('英文');
    expect(grade.score).toBe(0);
    expect(grade.summary).not.toContain('很棒');
  });

  it('对明显不足词数的英文作文强制限分', () => {
    const text = Array.from({ length: 30 }, (_, index) => `word${String.fromCharCode(97 + index)}`).join(' ');
    const stats = essayStats(text, 'cet6');
    const grade = gradeEssay(text, 'cet6');

    expect(stats.wordCount).toBe(30);
    expect(validateEssay(text, 'cet6').ok).toBe(true);
    expect(grade.score).toBeLessThanOrEqual(20);
    expect(grade.capReason).toContain('25%');
  });

  it('词数很少的英文作文也会批改并说明词汇或篇幅限制', () => {
    const text = 'I like reading books because they help me learn new ideas.';
    const stats = essayStats(text, 'cet6');
    const validation = validateEssay(text, 'cet6');
    const grade = gradeEssay(text, 'cet6');

    expect(validation.ok).toBe(true);
    expect(stats.wordCount).toBeGreaterThan(0);
    expect(grade.score).toBeGreaterThan(0);
    expect(grade.vocabularyNote).toBeTruthy();
    expect(grade.capReason).toContain('词');
  });

  it('本地回退评分不会冒充满分级结果', () => {
    const sentence = 'Lifelong learning helps people adapt to change and develop useful skills throughout their careers. ';
    const grade = gradeEssay(sentence.repeat(20), 'cet6');

    expect(grade.wordCount).toBeGreaterThanOrEqual(150);
    expect(grade.score).toBeLessThanOrEqual(75);
  });

  it('不把正常词误报为拼写错误，只标记明确错拼', () => {
    const clean = 'Lifelong learning encourages curiosity and helps people adapt to unfamiliar situations with confidence.';
    const misspelled = 'I recieve useful feedback from every writing task and apply it during the next practice session.';
    const cleanGrade = gradeEssay(clean, 'cet6');
    const misspelledGrade = gradeEssay(misspelled, 'cet6');

    expect(cleanGrade.issues.filter((issue) => issue.type === 'spelling')).toHaveLength(0);
    expect(misspelledGrade.issues.filter((issue) => issue.type === 'spelling')).toHaveLength(1);
    expect(misspelledGrade.issues.find((issue) => issue.type === 'spelling')?.fix).toContain('receive');
  });

  it('跨过空白识别连续重复词', () => {
    const grade = gradeEssay(
      'Education gives people useful knowledge. The the ability to learn independently matters.',
      'cet6',
    );
    expect(grade.issues.some((issue) => issue.message.includes('相邻重复词'))).toBe(true);
  });

  it('把分数拆成可读的能力报告', () => {
    const text = Array.from({ length: 160 }, (_, index) => `signal${String.fromCharCode(97 + (index % 26))}`).join(' ') + '.';
    const stats = essayStats(text, 'cet6');
    const grade = gradeEssay(text, 'cet6');
    const report = buildEssayGradeReport(grade, stats);

    expect(report.dimensions).toHaveLength(4);
    expect(report.dimensions.every((dimension) => dimension.value >= 0 && dimension.value <= 100)).toBe(true);
    expect(report.priority.length).toBeGreaterThan(0);
  });
});
