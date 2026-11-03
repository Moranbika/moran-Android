import { describe, expect, it } from 'vitest';
import { resolveLanguage, translate } from '../i18n';

describe('i18n', () => {
  it('resolves explicit and system language preferences', () => {
    expect(resolveLanguage('zh', 'en-US')).toBe('zh');
    expect(resolveLanguage('en', 'zh-CN')).toBe('en');
    expect(resolveLanguage('system', 'zh-CN')).toBe('zh');
    expect(resolveLanguage('system', 'en-GB')).toBe('en');
  });

  it('translates UI copy with interpolation', () => {
    expect(translate('en', '连续 {n} 天', { n: 7 })).toBe('7-day streak');
    expect(translate('en', '开始{title}', { title: 'Listening practice' })).toBe('Start Listening practice');
    expect(translate('zh', '连续 {n} 天', { n: 7 })).toBe('连续 7 天');
  });

  it('translates dynamic book and feedback patterns', () => {
    expect(translate('en', '人教版小学英语·二年级上册')).toBe('PEP Primary English · Grade 2A');
    expect(translate('en', '先处理 2 处句子问题，再继续打磨表达。')).toBe(
      'Fix 2 sentence issues before polishing expression.',
    );
  });

  it('keeps unknown content unchanged for safe fallback', () => {
    expect(translate('en', '未配置的内容')).toBe('未配置的内容');
  });
});
