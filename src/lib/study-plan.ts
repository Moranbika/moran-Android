export type StudyTaskKind = 'review' | 'new-words';

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
}

const clampProgress = (completed: number, target: number) =>
  target > 0 ? Math.min(1, Math.max(0, completed / target)) : 1;

export function buildDailyPlan(input: DailyPlanInput): StudyTask[] {
  const reviewTarget = Math.max(0, input.dueToday + input.reviewsToday);
  const newTarget = Math.max(0, input.dailyTarget);
  const definitions = [
    {
      id: 'review' as const,
      title: '到期复习',
      description: reviewTarget > 0 ? '先清掉最容易遗忘的词' : '今天没有到期词',
      route: '/vocab?mode=review',
      completed: input.reviewsToday,
      target: reviewTarget,
      unit: '词',
      estimatedMinutes: Math.ceil(reviewTarget * 0.4),
    },
    {
      id: 'new-words' as const,
      title: '新词学习',
      description: `完成今天的 ${newTarget} 个新词`,
      route: '/vocab?mode=new',
      completed: input.newWordsToday,
      target: newTarget,
      unit: '词',
      estimatedMinutes: Math.ceil(newTarget * 0.5),
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
