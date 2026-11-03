export type StudyTaskKind = 'review' | 'new-words' | 'listening' | 'practice';
export type PlanIntensity = 'light' | 'standard' | 'sprint';

export interface StudyTask {
  id: StudyTaskKind;
  title: string;
  description: string;
  route: string;
  completed: number;
  target: number;
  unit: string;
  estimatedMinutes: number;
  percent: number;
  done: boolean;
}

export interface DailyPlanInput {
  dueToday: number;
  dailyTarget: number;
  reviewsToday: number;
  newWordsToday: number;
  listeningToday: number;
  questionsToday: number;
  intensity?: PlanIntensity;
}

const clampProgress = (completed: number, target: number) =>
  target > 0 ? Math.min(1, Math.max(0, completed / target)) : 1;

export function buildDailyPlan(input: DailyPlanInput): StudyTask[] {
  // 到期数与今日已复习数相加，任务开始后目标不会随着复习而缩小。
  const reviewTarget = Math.max(0, input.dueToday + input.reviewsToday);
  const intensity = input.intensity ?? 'standard';
  const newTarget = intensity === 'light'
    ? Math.min(8, Math.max(0, input.dailyTarget))
    : Math.max(0, input.dailyTarget);
  const listeningTarget = intensity === 'sprint' ? 2 : 1;
  const practiceTarget = intensity === 'light' ? 5 : intensity === 'sprint' ? 20 : 10;
  const definitions: Array<Omit<StudyTask, 'completed' | 'target' | 'estimatedMinutes' | 'percent' | 'done'> & {
    completed: number;
    target: number;
    estimatedMinutes: number;
  }> = [
    {
      id: 'review',
      title: '到期复习',
      description: reviewTarget > 0 ? '先清掉最容易遗忘的词' : '今天没有到期词',
      route: '/vocab?mode=review',
      completed: input.reviewsToday,
      target: reviewTarget,
      unit: '词',
      estimatedMinutes: Math.ceil(reviewTarget * 0.4),
    },
    {
      id: 'new-words',
      title: '新词学习',
      description: `完成今天的 ${newTarget} 个新词`,
      route: '/vocab?mode=new',
      completed: input.newWordsToday,
      target: newTarget,
      unit: '词',
      estimatedMinutes: Math.ceil(newTarget * 0.5),
    },
    {
      id: 'listening',
      title: '听力训练',
      description: `完成 ${listeningTarget} 套六级听力真题`,
      route: '/listening',
      completed: input.listeningToday,
      target: listeningTarget,
      unit: '套',
      estimatedMinutes: listeningTarget * 20,
    },
    {
      id: 'practice',
      title: '题型练习',
      description: `完成 ${practiceTarget} 道阅读、翻译或写作题`,
      route: '/practice',
      completed: input.questionsToday,
      target: practiceTarget,
      unit: '题',
      estimatedMinutes: Math.ceil(practiceTarget * 1.2),
    },
  ];

  return definitions.map((task) => {
    const ratio = clampProgress(task.completed, task.target);
    return {
      ...task,
      completed: Math.min(task.completed, task.target),
      percent: Math.round(ratio * 100),
      done: task.completed >= task.target,
    };
  });
}

export function planCompletion(tasks: StudyTask[]): number {
  if (tasks.length === 0) return 0;
  return Math.round(tasks.reduce((sum, task) => sum + task.percent, 0) / tasks.length);
}

export function nextStudyTask(tasks: StudyTask[]): StudyTask | undefined {
  return tasks.find((task) => !task.done);
}

export function daysUntilExam(examDate: string, now = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(examDate)) return null;
  const target = new Date(`${examDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}
