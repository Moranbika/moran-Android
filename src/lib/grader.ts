// 刷题辅助：翻译近似判定 + 作文批改（明确错误批注 + 打分）

// 只标记确定的高频拼写错误，避免把词库未收录的正常单词误判为错误。
const COMMON_MISSPELLINGS: Record<string, string> = {
  teh: 'the',
  recieve: 'receive',
  becuase: 'because',
  thier: 'their',
  definately: 'definitely',
  seperate: 'separate',
  enviroment: 'environment',
  goverment: 'government',
  sucess: 'success',
  wich: 'which',
  occured: 'occurred',
  untill: 'until',
  acheive: 'achieve',
  writting: 'writing',
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ===== 翻译近似判定 =====
export interface TranslationVerdict {
  match: boolean;
  score: number; // 实义词覆盖率 0~1
  missing: string[]; // 参考译文中漏掉的实义词
}
const STOP = new Set('a an the and or but so for of to in on at by with from into over under than it its you he she we they them my your our their his this that these those is are was were be been being am not no yes there here will would can could should may might must'.split(' '));

export function translationsMatch(user: string, ref: string): TranslationVerdict {
  const uWords = new Set(norm(user).split(' ').filter((w) => w && !STOP.has(w)));
  const rWords = norm(ref).split(' ').filter((w) => w && !STOP.has(w));
  if (rWords.length === 0) return { match: false, score: 0, missing: [] };
  const missing = rWords.filter((w) => !uWords.has(w));
  const matched = rWords.length - missing.length;
  const score = matched / rWords.length;
  const uniqueMissing = Array.from(new Set(missing)).slice(0, 5);
  return { match: score >= 0.5, score, missing: uniqueMissing };
}

// ===== 作文批改 =====
export interface EssayIssue {
  start: number; // tokens 中的起始下标
  end: number; // 结束下标（含）
  type: 'spelling' | 'grammar' | 'style';
  message: string;
  fix: string;
}
export interface EssayToken {
  text: string;
  issue?: number; // 指向 issues 下标
  skip: boolean; // 空白/标点，不可点击
}
export interface EssayGrade {
  score: number;
  tokens: EssayToken[];
  issues: EssayIssue[];
  summary: string;
  wordCount: number;
  capReason?: string;
  vocabularyNote?: string;
}

export interface EssayStats {
  wordCount: number;
  chineseChars: number;
  sentenceCount: number;
  uniqueRatio: number;
  uniqueWords: number;
  minWords: number;
  maxWords: number;
}

export interface EssayValidation {
  ok: boolean;
  reason?: string;
  warning?: string;
  stats: EssayStats;
}

export function essayStats(text: string, level: 'cet4' | 'cet6' = 'cet6'): EssayStats {
  const words = text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? [];
  const lower = words.map((word) => word.toLowerCase());
  const chineseChars = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const sentenceCount = text.split(/[.!?]+/).filter((part) => part.trim()).length;
  return {
    wordCount: words.length,
    chineseChars,
    sentenceCount,
    uniqueRatio: words.length ? new Set(lower).size / words.length : 0,
    uniqueWords: new Set(lower).size,
    minWords: level === 'cet6' ? 150 : 120,
    maxWords: level === 'cet6' ? 200 : 180,
  };
}

export function validateEssay(
  text: string,
  level: 'cet4' | 'cet6' = 'cet6',
): EssayValidation {
  const stats = essayStats(text, level);
  if (stats.wordCount === 0) {
    return { ok: false, reason: '未检测到英文内容。请用英文写一点内容后再提交；哪怕只写几句也会批改。', stats };
  }

  const warnings: string[] = [];
  if (stats.chineseChars > Math.max(3, stats.wordCount * 0.05)) {
    warnings.push(`检测到 ${stats.chineseChars} 个中文字符，中文内容不能作为英文作文评分；系统仍会按现有英文内容批改。`);
  }
  if (stats.wordCount < 20) {
    warnings.push(`目前只有 ${stats.wordCount} 个英文词，仍会批改，但篇幅会限制得分。`);
  }
  if (stats.uniqueWords < 15) {
    warnings.push(`全文只有 ${stats.uniqueWords} 个不同单词，词汇量偏少；仍会批改，但表达丰富度会受限。`);
  }
  return { ok: true, warning: warnings.length ? warnings.join(' ') : undefined, stats };
}

function essayScoreCap(stats: EssayStats): { cap: number; reason?: string } {
  const chineseRatio = stats.wordCount ? stats.chineseChars / stats.wordCount : 1;
  const caps: Array<{ cap: number; reason: string }> = [];
  if (chineseRatio > 0.2) {
    caps.push({ cap: 15, reason: `中文占比较高（${stats.chineseChars} 个中文字符），得分上限为 15。` });
  } else if (chineseRatio > 0.05) {
    caps.push({ cap: 35, reason: '中文内容偏多，得分上限为 35。' });
  }
  if (stats.wordCount < stats.minWords * 0.25) {
    caps.push({ cap: 20, reason: '不足要求词数的 25%，得分上限为 20。' });
  } else if (stats.wordCount < stats.minWords * 0.5) {
    caps.push({ cap: 35, reason: '不足要求词数的 50%，得分上限为 35。' });
  } else if (stats.wordCount < stats.minWords * 0.75) {
    caps.push({ cap: 50, reason: '不足要求词数的 75%，得分上限为 50。' });
  } else if (stats.wordCount < stats.minWords) {
    caps.push({ cap: 65, reason: `未达到 ${stats.minWords} 词要求，得分上限为 65。` });
  }
  if (stats.uniqueWords < 12) {
    caps.push({ cap: 35, reason: `全文只有 ${stats.uniqueWords} 个不同单词，词汇量偏少，得分上限为 35。` });
  } else if (stats.uniqueWords < 20) {
    caps.push({ cap: 50, reason: `全文只有 ${stats.uniqueWords} 个不同单词，表达丰富度受限，得分上限为 50。` });
  }
  if (stats.uniqueRatio < 0.3) {
    caps.push({ cap: 40, reason: '重复词过多，内容表达单一，得分上限为 40。' });
  }
  if (stats.sentenceCount < 3) {
    caps.push({ cap: 55, reason: '完整句数量不足，得分上限为 55。' });
  }
  const worst = caps.sort((a, b) => a.cap - b.cap)[0];
  return worst ?? { cap: 100 };
}

export function gradeEssay(
  text: string,
  level: 'cet4' | 'cet6' = 'cet6',
): EssayGrade {
  const validation = validateEssay(text, level);
  const stats = validation.stats;
  // 先分词（保留标点）
  const rawTokens: string[] = text.match(/[A-Za-z]+|[^\sA-Za-z]+|\s+/g) ?? [];
  const issues: EssayIssue[] = [];
  const tokenToWord: Record<number, string> = {};

  rawTokens.forEach((t, i) => {
    if (/^[A-Za-z]+$/.test(t)) tokenToWord[i] = t;
  });

  // 拼写检查
  const spellingIdx: number[] = [];
  const spellingFix: Record<number, string> = {};
  for (const i of Object.keys(tokenToWord).map(Number)) {
    const w = tokenToWord[i].toLowerCase();
    if (COMMON_MISSPELLINGS[w]) {
      spellingIdx.push(i);
      spellingFix[i] = COMMON_MISSPELLINGS[w];
    }
  }

  // 语法：句首小写
  const lowerStart: number[] = [];
  let sentenceStart = true;
  rawTokens.forEach((t, i) => {
    if (/^[.!?]+$/.test(t.trim())) {
      sentenceStart = true;
      return;
    }
    if (sentenceStart && /^[A-Za-z]/.test(t) && t === t.toLowerCase() && t.trim() !== '') {
      lowerStart.push(i);
      sentenceStart = false;
    } else if (/^[A-Za-z]/.test(t) && t !== t.toLowerCase()) {
      sentenceStart = false;
    }
  });

  // 语法：连续重复词
  const dupIdx: number[] = [];
  let previousWordIndex = -1;
  for (let i = 0; i < rawTokens.length; i += 1) {
    const word = tokenToWord[i];
    if (!word) continue;
    if (previousWordIndex >= 0
      && tokenToWord[previousWordIndex].toLowerCase() === word.toLowerCase()) {
      dupIdx.push(i);
    }
    previousWordIndex = i;
  }

  for (const i of spellingIdx) {
    issues.push({
      start: i, end: i, type: 'spelling',
      message: `“${rawTokens[i]}”拼写错误。`,
      fix: `改为 “${spellingFix[i]}”。`,
    });
  }
  for (const i of lowerStart) {
    issues.push({
      start: i, end: i, type: 'grammar',
      message: `“${rawTokens[i]}”出现在句首，应首字母大写。`, fix: '把句首首字母改为大写，如 “' + rawTokens[i][0].toUpperCase() + rawTokens[i].slice(1) + '”。',
    });
  }
  for (const i of dupIdx) {
    issues.push({
      start: i - 1, end: i, type: 'grammar',
      message: '相邻重复词，属于语病。', fix: '删除其中一个重复的词。',
    });
  }

  let score = 72 - spellingIdx.length * 4 - lowerStart.length * 6 - dupIdx.length * 6;
  if (stats.wordCount < stats.minWords) {
    issues.push({
      start: 0, end: 0, type: 'style',
      message: `篇幅不足，当前 ${stats.wordCount} 词，要求 ${stats.minWords}-${stats.maxWords} 词。`,
      fix: `再展开关键论点，把作文补充到至少 ${stats.minWords} 词。`,
    });
  }
  if (stats.uniqueWords < 20) {
    issues.push({
      start: 0, end: 0, type: 'style',
      message: `全文只有 ${stats.uniqueWords} 个不同单词，词汇量偏少。`,
      fix: '先保留现有内容完成批改；下一步用同义替换、具体名词和动词扩充表达。',
    });
  }
  const cap = essayScoreCap(stats);
  if (!validation.ok) score = 0;
  score = Math.max(0, Math.min(cap.cap, score, 75));

  const vocabularyNote = stats.uniqueWords < 15
    ? `全文只有 ${stats.uniqueWords} 个不同单词，词汇量偏少。系统仍按现有内容批改，但“表达丰富”会受限；可以先用同义替换和具体名词、动词扩充。`
    : stats.wordCount < 20
      ? `目前只有 ${stats.wordCount} 个英文词，系统仍会批改；先把每个论点展开成 2–3 句，篇幅和内容分会更准确。`
      : undefined;

  // 生成 tokens
  const tokens: EssayToken[] = rawTokens.map((t, i) => {
    const issueIdx = issues.findIndex((it) => i >= it.start && i <= it.end);
    return { text: t, issue: issueIdx >= 0 ? issueIdx : undefined, skip: !/^[A-Za-z]+$/.test(t) };
  });

  const summary = !validation.ok
    ? validation.reason ?? '无法识别为有效英文作文。'
    : score >= 70
      ? '基础检查完成，拼写和句式整体较稳定；本地评分不等同于正式阅卷。'
      : score >= 50
        ? '基础检查发现拼写、句式或篇幅问题，建议按批注逐条修改。'
        : '得分受限，请先解决语言、篇幅或表达重复问题。';

  return {
    score,
    tokens,
    issues,
    summary,
    wordCount: stats.wordCount,
    capReason: [validation.warning, cap.reason].filter(Boolean).join(' ') || undefined,
    vocabularyNote,
  };
}

export interface EssayDimension {
  key: 'content' | 'structure' | 'language' | 'expression';
  label: string;
  value: number;
}

export interface EssayGradeReport {
  rank: 'S' | 'A' | 'B+' | 'B' | 'C' | 'D';
  headline: string;
  priority: string;
  dimensions: EssayDimension[];
  issueCounts: {
    spelling: number;
    grammar: number;
    style: number;
  };
}

export function buildEssayGradeReport(
  grade: EssayGrade,
  stats: EssayStats,
): EssayGradeReport {
  const issueCounts = {
    spelling: grade.issues.filter((issue) => issue.type === 'spelling').length,
    grammar: grade.issues.filter((issue) => issue.type === 'grammar').length,
    style: grade.issues.filter((issue) => issue.type === 'style').length,
  };
  const rank = grade.score >= 85 ? 'S'
    : grade.score >= 75 ? 'A'
      : grade.score >= 60 ? 'B+'
        : grade.score >= 45 ? 'B'
          : grade.score >= 30 ? 'C'
            : 'D';
  const lengthRatio = Math.min(1, stats.wordCount / stats.minWords);
  const dimensions: EssayDimension[] = [
    {
      key: 'content',
      label: '内容展开',
      value: Math.max(0, Math.min(100, Math.round(lengthRatio * 82 - issueCounts.style * 5))),
    },
    {
      key: 'structure',
      label: '结构完整',
      value: Math.max(0, Math.min(100, Math.round(45 + lengthRatio * 25 + Math.min(stats.sentenceCount, 12) * 2))),
    },
    {
      key: 'language',
      label: '语言准确',
      value: Math.max(0, Math.min(100, Math.round(grade.score + 8 - issueCounts.spelling * 4 - issueCounts.grammar * 3))),
    },
    {
      key: 'expression',
      label: '表达丰富',
      value: Math.max(0, Math.min(100, Math.round(35 + stats.uniqueRatio * 60))),
    },
  ];
  const headline = grade.capReason
    ? '先把硬指标补齐，再谈文章发挥。'
    : issueCounts.grammar > 0
      ? `先处理 ${issueCounts.grammar} 处句子问题，再继续打磨表达。`
      : issueCounts.spelling > 0
        ? `先修正 ${issueCounts.spelling} 处明确拼写错误。`
        : issueCounts.style > 0
          ? '内容框架已经成形，先补实论据和细节。'
          : stats.wordCount < stats.minWords
            ? '语言问题不多，先把篇幅补到要求范围。'
            : '机械性错误较少，这一篇的提升点在论证深度。';
  const firstIssue = grade.issues[0];
  const priority = grade.capReason
    ?? (firstIssue ? `${firstIssue.message} ${firstIssue.fix}` : undefined)
    ?? '没有发现机械性语言错误；下一步应回到题目，补足一个具体论据或例子。';
  return { rank, headline, priority, dimensions, issueCounts };
}
