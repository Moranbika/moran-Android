// srs/predict.ts — 未来 N 天到期预测（基于现有 WordMemory）
import type { WordMemory } from '@/lib/memory';

const DAY_MS = 86400000;

/** 预测未来 days 天每天到期多少词 */
export function predictDueNextDays(
  memory: Record<string, WordMemory>,
  days: number,
  now = Date.now(),
): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  for (let d = 0; d < days; d++) {
    const dayStart = startOfToday.getTime() + d * DAY_MS;
    const dayEnd = dayStart + DAY_MS;
    let count = 0;
    for (const m of Object.values(memory)) {
      if (!m || m.due === 0) continue;
      if (m.due >= dayStart && m.due < dayEnd) count++;
    }
    const dt = new Date(dayStart);
    result.push({
      date: `${dt.getMonth() + 1}/${dt.getDate()}`,
      count,
    });
  }
  return result;
}
