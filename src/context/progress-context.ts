// EXPORTS: IProgress, IProgressContextValue, INITIAL_PROGRESS, ProgressContext, useProgress, getTodayStr, calcStreakCount
// 学习进度模型与 Context。Context 拆在独立文件（仅非组件导出），Provider 见 components/ProgressProvider.tsx。

import { createContext, useContext } from 'react';
import { format } from 'date-fns';
import type { Rating, WordMemory } from '@/lib/memory';

export interface ReviewLog {
  wordId: string;
  rating: Rating;
  ts: number;
}

export interface DailyActivity {
  newWords: number;
  reviews: number;
  listening: number;
  questions: number;
}

export interface MockExamAttempt {
  id: string;
  examSetId: string;
  completedAt: number;
  durationSeconds: number;
  listeningCorrect: number;
  listeningTotal: number;
  readingCorrect: number;
  readingTotal: number;
  answers: Record<string, number>;
}

export interface IProgress {
  learnedWords: string[]; // 已学单词 id
  favoriteWords: string[]; // 收藏单词 id
  wordStats: Record<string, { correct: number; wrong: number }>; // 单词测验对错统计
  memory: Record<string, WordMemory>; // 每个词的艾宾浩斯记忆状态
  listeningDone: string[]; // 旧版字段，仅用于兼容已有本地数据
  questionResults: Record<string, boolean>; // 题目(qid)对错
  streakDates: string[]; // 打卡日期（yyyy-MM-dd，去重）
  reviewLog: ReviewLog[]; // 每次复习的评价记录（用于每日统计与持久度）
  studyLog: Record<string, number>; // 每日学习时长（yyyy-MM-dd -> 秒）
  dailyActivity: Record<string, DailyActivity>; // 每日完成量（yyyy-MM-dd -> 计数）
  mockExamAttempts: MockExamAttempt[];
}

export interface IProgressContextValue {
  progress: IProgress;
  markWordLearned: (id: string) => void;
  toggleFavorite: (id: string) => void;
  recordWordResult: (id: string, correct: boolean) => void;
  reviewWord: (id: string, rating: Rating) => void;
  addStudySeconds: (day: string, secs: number) => void;
  markListeningDone: (id: string) => void;
  recordQuestion: (qid: string, correct: boolean) => void;
  recordMockExamAttempt: (attempt: MockExamAttempt) => void;
  resetProgress: () => void;
  restoreProgress: (snapshot: IProgress) => void;
  todayCheckedIn: boolean;
  streakCount: number;
}

export const INITIAL_PROGRESS: IProgress = {
  learnedWords: [],
  favoriteWords: [],
  wordStats: {},
  memory: {},
  listeningDone: [],
  questionResults: {},
  streakDates: [],
  reviewLog: [],
  studyLog: {},
  dailyActivity: {},
  mockExamAttempts: [],
};

export function getTodayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function calcStreakCount(dates: string[]): number {
  const set = new Set(dates);
  let count = 0;
  const d = new Date();
  while (set.has(format(d, 'yyyy-MM-dd'))) {
    count += 1;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export const ProgressContext = createContext<IProgressContextValue | null>(null);

export function useProgress(): IProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
}
