// 莫兰语感镜：使用 compromise 在本地做英文分词、句子切分和动词还原，
// 只输出可解释的写作习惯指标，不联网、不生成内容、不替代正式阅卷。

import nlp from 'compromise';

const STOP_WORDS = new Set(
  `a an the and or but so for of to in on at by with from into over under than then that this these those
  it its he she we they them him her his their our your my me us you i is are was were be been being am
  do does did have has had having will would can could should may might must shall not no yes there here
  as if when while because since although though whereas which who whom whose what where why how all any
  both each few more most other some such only own same too very just also again ever never often always
  sometimes usually still yet already about after before during between among through across against
  without within upon onto off out up down once twice`
    .split(/\s+/)
    .filter(Boolean),
);

const CONNECTORS = [
  'however',
  'therefore',
  'moreover',
  'furthermore',
  'nevertheless',
  'consequently',
  'meanwhile',
  'in addition',
  'for example',
  'for instance',
  'on the other hand',
  'as a result',
  'in conclusion',
  'to sum up',
  'such as',
  'not only',
  'but also',
  'although',
  'though',
  'whereas',
  'while',
  'because',
  'since',
  'first',
  'second',
  'third',
  'finally',
] as const;

const WORD_PATTERN = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g;
const LONG_SENTENCE_WORDS = 32;

export type LanguageTone = 'clear' | 'steady' | 'watch';

export interface RepeatedWord {
  word: string;
  count: number;
}

export interface LanguageInsight {
  engine: 'compromise';
  wordCount: number;
  sentenceCount: number;
  averageSentenceWords: number;
  longestSentenceWords: number;
  longSentenceCount: number;
  contentWordCount: number;
  uniqueContentWords: number;
  lexicalVariety: number;
  repeatedWords: RepeatedWord[];
  repeatedOpenings: RepeatedWord[];
  connectorCount: number;
  connectorPer100Words: number;
  tone: LanguageTone;
  observations: string[];
}

interface TermLike {
  text?: string;
  normal?: string;
  tags?: string[];
}

interface TermGroup {
  terms?: TermLike[];
}

function countWords(text: string): number {
  return (text.match(WORD_PATTERN) ?? []).length;
}

function cleanWord(value: string | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z'-]+$/g, '')
    .replace(/'s$/, '');
}

function topRepeated(
  values: string[],
  minimumCount: number,
  limit: number,
): RepeatedWord[] {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    if (!value || value.length < 3 || STOP_WORDS.has(value)) return;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return [...counts.entries()]
    .filter(([, count]) => count >= minimumCount)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

function countConnectors(text: string): number {
  const pattern = new RegExp(
    `\\b(?:${CONNECTORS.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi',
  );
  return (text.match(pattern) ?? []).length;
}

function pickObservations(input: {
  longSentenceCount: number;
  lexicalVariety: number;
  repeatedWords: RepeatedWord[];
  repeatedOpenings: RepeatedWord[];
  connectorPer100Words: number;
}): string[] {
  const observations: string[] = [];
  if (input.longSentenceCount > 0) {
    observations.push(
      `有 ${input.longSentenceCount} 个句子超过 ${LONG_SENTENCE_WORDS} 词，建议在转折处拆成两句，让论点更清楚。`,
    );
  }
  if (input.repeatedWords[0]) {
    observations.push(
      `“${input.repeatedWords[0].word}”出现了 ${input.repeatedWords[0].count} 次，可以换用代词或更具体的同义表达。`,
    );
  }
  if (input.lexicalVariety < 45) {
    observations.push(
      `实词变化度约 ${input.lexicalVariety}%，可换用更具体的动词和名词，减少泛化表达。`,
    );
  }
  if (input.connectorPer100Words < 1.5) {
    observations.push(
      `衔接表达约 ${input.connectorPer100Words} 处/百词，可补 however、therefore、for example 等路标词。`,
    );
  }
  if (input.repeatedOpenings[0]) {
    observations.push(
      `有 ${input.repeatedOpenings[0].count} 个句子以“${input.repeatedOpenings[0].word}”开头，可以调整语序。`,
    );
  }
  if (observations.length === 0) {
    observations.push('句子长度和词汇变化较均衡，下一步重点补足论据和具体例子。');
  }
  return observations.slice(0, 3);
}

export function analyzeEssayLanguage(text: string): LanguageInsight {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      engine: 'compromise',
      wordCount: 0,
      sentenceCount: 0,
      averageSentenceWords: 0,
      longestSentenceWords: 0,
      longSentenceCount: 0,
      contentWordCount: 0,
      uniqueContentWords: 0,
      lexicalVariety: 0,
      repeatedWords: [],
      repeatedOpenings: [],
      connectorCount: 0,
      connectorPer100Words: 0,
      tone: 'steady',
      observations: ['还没有可分析的英文内容。'],
    };
  }

  const doc = nlp(trimmed);
  const sentences = (doc.sentences().out('array') as string[])
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const sentenceWordCounts = sentences.map((sentence) => countWords(sentence));
  const wordCount = sentenceWordCounts.reduce((sum, count) => sum + count, 0);
  const averageSentenceWords = sentences.length
    ? Math.round((wordCount / sentences.length) * 10) / 10
    : 0;
  const longestSentenceWords = sentenceWordCounts.length ? Math.max(...sentenceWordCounts) : 0;
  const longSentenceCount = sentenceWordCounts.filter((count) => count > LONG_SENTENCE_WORDS).length;

  // 把可见动词还原为原形，让 learning / learned / learns 能归到同一个词族。
  doc.verbs().toInfinitive();
  const termGroups = doc.terms().json({
    terms: { text: true, normal: true, tags: true },
  }) as TermGroup[];
  const terms = termGroups.flatMap((group) => group.terms ?? []);
  const tokens = terms
    .filter((term) => term.text && /^[A-Za-z]+(?:['’-][A-Za-z]+)*$/.test(term.text))
    .map((term) => cleanWord(term.normal || term.text))
    .filter((word) => word.length > 0);
  const contentWords = tokens.filter((word) => word.length > 1 && !STOP_WORDS.has(word));
  const uniqueContentWords = new Set(contentWords).size;
  const lexicalVariety = contentWords.length
    ? Math.round((uniqueContentWords / contentWords.length) * 100)
    : 0;
  const repeatedWords = topRepeated(contentWords, 3, 3);
  const openings = sentences
    .map((sentence) => cleanWord(sentence.match(WORD_PATTERN)?.[0]))
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word));
  const repeatedOpenings = topRepeated(openings, 3, 2);
  const connectorCount = countConnectors(trimmed);
  const connectorPer100Words = wordCount
    ? Math.round((connectorCount / wordCount) * 1000) / 10
    : 0;
  const warnings = [
    longSentenceCount >= 2,
    lexicalVariety < 40,
    repeatedWords.some((item) => item.count >= 4),
    connectorPer100Words < 1.2,
    repeatedOpenings.length >= 1,
  ].filter(Boolean).length;
  const tone: LanguageTone = warnings >= 2 ? 'watch' : warnings === 1 ? 'steady' : 'clear';

  return {
    engine: 'compromise',
    wordCount,
    sentenceCount: sentences.length,
    averageSentenceWords,
    longestSentenceWords,
    longSentenceCount,
    contentWordCount: contentWords.length,
    uniqueContentWords,
    lexicalVariety,
    repeatedWords,
    repeatedOpenings,
    connectorCount,
    connectorPer100Words,
    tone,
    observations: pickObservations({
      longSentenceCount,
      lexicalVariety,
      repeatedWords,
      repeatedOpenings,
      connectorPer100Words,
    }),
  };
}
