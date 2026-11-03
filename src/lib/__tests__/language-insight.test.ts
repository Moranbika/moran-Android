import { describe, expect, it } from 'vitest';
import { analyzeEssayLanguage } from '../language-insight';

describe('莫兰语感镜', () => {
  it('空内容返回安全的零值', () => {
    const insight = analyzeEssayLanguage('   ');

    expect(insight.wordCount).toBe(0);
    expect(insight.sentenceCount).toBe(0);
    expect(insight.observations).toHaveLength(1);
  });

  it('识别超过 32 词的长句', () => {
    const longSentence = `${Array.from({ length: 38 }, (_, index) => `word${String.fromCharCode(97 + (index % 26))}`).join(' ')}.`;
    const insight = analyzeEssayLanguage(
      `Online learning is useful. ${longSentence} Students should plan their time.`,
    );

    expect(insight.sentenceCount).toBeGreaterThanOrEqual(3);
    expect(insight.longestSentenceWords).toBeGreaterThan(32);
    expect(insight.longSentenceCount).toBeGreaterThanOrEqual(1);
    expect(insight.observations[0]).toContain('拆');
  });

  it('把重复出现的动词归到同一词族', () => {
    const insight = analyzeEssayLanguage(
      'They learned from practice. They learn from feedback. They will learn from mistakes.',
    );
    const repeated = insight.repeatedWords.find((item) => item.word === 'learn');

    expect(repeated?.count).toBeGreaterThanOrEqual(3);
  });

  it('统计高频名词和段落衔接词', () => {
    const insight = analyzeEssayLanguage(
      'A student plans every week. A student reads every day. A student writes every night. A student reviews every weekend. However, the student also needs rest. Therefore, balance matters.',
    );

    expect(insight.repeatedWords.some((item) => item.word === 'student' && item.count >= 3)).toBe(true);
    expect(insight.connectorCount).toBeGreaterThanOrEqual(2);
    expect(insight.connectorPer100Words).toBeGreaterThan(0);
  });

  it('输出可直接展示的体检结论', () => {
    const insight = analyzeEssayLanguage(
      'The the same idea is repeated again and again. However, the writer should explain it with a real example. Therefore, the paragraph needs more detail.',
    );

    expect(insight.engine).toBe('compromise');
    expect(['clear', 'steady', 'watch']).toContain(insight.tone);
    expect(insight.observations.length).toBeGreaterThan(0);
    expect(insight.observations.length).toBeLessThanOrEqual(3);
  });
});
