// 艾宾浩斯记忆调度核心
// 参考墨墨背单词的"回忆 → 自评 → 间隔重复"机制：
// 每复习一次，按评分更新记忆强度(ease)与复习间隔(interval)，
// 遗忘的词会被打回并在本次会话中反复出现，直到记住。

export type Rating = 0 | 1 | 2 | 3; // 忘记 / 模糊 / 认识 / 熟悉

export type MemoryStatus = 'new' | 'learning' | 'mastered';

export interface WordMemory {
  status: MemoryStatus;
  ease: number; // 记忆强度系数，1.3 ~ 3.0
  interval: number; // 当前复习间隔（天），0 表示当天需重学
  due: number; // 下次到期时间戳（ms）
  reps: number; // 已复习次数
  lapses: number; // 遗忘次数
  lastRating: Rating;
  learnedAt: number; // 首次学习时间戳
}

export const INITIAL_MEMORY: WordMemory = {
  status: 'new',
  ease: 2.5,
  interval: 0,
  due: 0,
  reps: 0,
  lapses: 0,
  lastRating: 2,
  learnedAt: 0,
};

// 艾宾浩斯间隔序列（天）：复习次数对应的下次间隔
const EBBINGHAUS_DAYS = [1, 2, 4, 7, 15, 30, 60, 120];

// 每天新学单词上限（可调整）
export const NEW_WORDS_PER_DAY = 10;

// 记住一个词（返回新的记忆状态）。
// rating=0 遗忘 → 间隔归零、本会话重学；>=1 按评分推进艾宾浩斯间隔。
export function reviewWord(prev: WordMemory, rating: Rating, now = Date.now()): WordMemory {
  const mem: WordMemory = {
    ...prev,
    learnedAt: prev.learnedAt || now,
  };
  let { ease, interval, reps, lapses } = mem;

  if (rating === 0) {
    // 遗忘：强度下降、遗忘数+1、间隔归零（本会话末尾再出现）
    ease = Math.max(1.3, ease - 0.25);
    lapses += 1;
    reps += 1;
    interval = 0;
  } else if (rating === 1) {
    // 模糊：强度略降，间隔轻微增长
    ease = Math.max(1.3, ease - 0.12);
    reps += 1;
    interval = Math.max(1, Math.round(interval * 1.3));
  } else if (rating === 2) {
    // 认识：强度略升，按艾宾浩斯序列推进
    ease = Math.min(3, ease + 0.12);
    reps += 1;
    interval = EBBINGHAUS_DAYS[Math.min(reps - 1, EBBINGHAUS_DAYS.length - 1)];
  } else {
    // 熟悉：强度上升，间隔跳档推进
    ease = Math.min(3, ease + 0.18);
    reps += 1;
    interval = EBBINGHAUS_DAYS[Math.min(reps, EBBINGHAUS_DAYS.length - 1)];
  }

  // 进入长期记忆：间隔足够长且复习稳定
  const status: MemoryStatus =
    (interval >= 30 && reps >= 3) || (reps >= 6 && lapses === 0) ? 'mastered' : 'learning';

  // 遗忘的词让其在本次会话内反复出现（due 置为 now），否则排到下次到期
  const due = rating === 0 ? now : now + interval * 86400000;

  return { ...mem, ease, interval, reps, lapses, lastRating: rating, status, due };
}

// 构建今天的学习队列：到期复习词 + 今日新学词
export interface StudyQueue {
  dueWords: string[]; // 到期复习词 id
  newWords: string[]; // 本次新学词 id
  dueCount: number;
  newCount: number;
}

export function buildStudyQueue(
  memory: Record<string, WordMemory>,
  allIds: string[],
  dailyNewLimit: number = NEW_WORDS_PER_DAY,
  now = Date.now(),
): StudyQueue {
  const dueWords: string[] = [];
  const freshNew: string[] = [];
  for (const id of allIds) {
    const m = memory[id];
    if (!m || m.status === 'new') {
      freshNew.push(id);
    } else if (m.status !== 'mastered' && m.due <= now) {
      dueWords.push(id);
    }
  }
  // 已掌握但到期（长期复习）也纳入复习
  const masteredDue = allIds.filter(
    (id) => memory[id]?.status === 'mastered' && memory[id].due <= now,
  );
  dueWords.push(...masteredDue);
  const newWords = freshNew.slice(0, Math.max(0, dailyNewLimit));
  return { dueWords, newWords, dueCount: dueWords.length, newCount: newWords.length };
}

// 记忆分析：分布 + 薄弱词 + 牢固词
export interface MemorySummary {
  total: number;
  newCount: number;
  learningCount: number;
  masteredCount: number;
  dueToday: number;
  weakIds: string[];
  strongIds: string[];
}

export function summarizeMemory(
  memory: Record<string, WordMemory>,
  allIds: string[],
  now = Date.now(),
): MemorySummary {
  let newCount = 0;
  let learningCount = 0;
  let masteredCount = 0;
  let dueToday = 0;
  const weakIds: string[] = [];
  const strongIds: string[] = [];

  for (const id of allIds) {
    const m = memory[id];
    if (!m || m.status === 'new') {
      newCount += 1;
      continue;
    }
    if (m.status === 'mastered') {
      masteredCount += 1;
      strongIds.push(id);
    } else {
      learningCount += 1;
      // 薄弱：遗忘多或强度低
      if (m.lapses >= 2 || (m.lapses >= 1 && m.ease < 1.9)) weakIds.push(id);
    }
    if (m.due <= now) dueToday += 1;
  }

  return {
    total: allIds.length,
    newCount,
    learningCount,
    masteredCount,
    dueToday,
    weakIds,
    strongIds,
  };
}

// ===== 遗忘曲线 =====
export interface CurvePoint {
  day: number; // 距上次复习的天数
  recall: number; // 记忆保持率（%）
}

export interface ForgettingCurve {
  theoretical: CurvePoint[]; // 理论平均（经典艾宾浩斯）
  actual: CurvePoint[]; // 我的实际记忆保持
  prediction: CurvePoint[]; // 当天之后的预测
}

// 记忆半衰期映射：ease 越高，忘得越慢（半衰期越长）
function halfLifeByEase(ease: number): number {
  return 0.8 + (ease - 1.3) * ((4 - 0.8) / (3 - 1.3));
}

// 估算用户遗忘曲线：从今天往后预测
export function getForgettingCurve(
  memory: Record<string, WordMemory>,
  allIds: string[],
): ForgettingCurve {
  const mems = allIds.map((id) => memory[id]).filter((m) => m && m.status !== 'new' && m.reps > 0);
  const avgEase = mems.length ? mems.reduce((s, m) => s + m.ease, 0) / mems.length : 2.5;
  const H = halfLifeByEase(avgEase);

  // 理论曲线（经典艾宾浩斯）：从今天往后14天
  const theoretical: CurvePoint[] = [];
  for (let d = 0; d <= 14; d++) {
    theoretical.push({ day: d, recall: Math.round(100 * Math.pow(0.5, d / 1.5)) });
  }

  // 你的曲线：基于真实数据的半衰期预测
  const actual: CurvePoint[] = [];
  for (let d = 0; d <= 14; d++) {
    actual.push({ day: d, recall: Math.round(100 * Math.pow(0.5, d / H)) });
  }

  return { theoretical, actual, prediction: actual };
}
