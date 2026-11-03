// EXPORTS: store
// localStorage 封装，带项目命名空间，读写均容错（隐私模式静默降级）。

const NS = 'cet6-practice';

export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(`${NS}:${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
    } catch {
      /* 隐私模式 / 禁用站点数据时静默降级 */
    }
  },
  clearAll(): void {
    try {
      const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
        .filter((key): key is string => Boolean(key?.startsWith(`${NS}:`)));
      keys.forEach((key) => localStorage.removeItem(key));
    } catch {
      /* 隐私模式 / 禁用站点数据时静默降级 */
    }
  },
};
