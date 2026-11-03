import { useCallback, useEffect, useRef, useState } from 'react';

export const DATA_REFRESH_EVENT = 'moran:data-refresh';

function easeOutQuart(value: number) {
  return 1 - (1 - value) ** 4;
}

export function useAnimatedProgress(active: boolean, duration = 760) {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  const restart = useCallback(() => {
    if (!activeRef.current) {
      setProgress(0);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }

    window.cancelAnimationFrame(frameRef.current);
    setProgress(0);
    const startedAt = performance.now();
    const tick = (now: number) => {
      const next = Math.min(1, (now - startedAt) / duration);
      setProgress(easeOutQuart(next));
      if (next < 1) frameRef.current = window.requestAnimationFrame(tick);
    };
    frameRef.current = window.requestAnimationFrame(tick);
  }, [duration]);

  useEffect(() => {
    if (active) restart();
    else setProgress(0);
    return () => window.cancelAnimationFrame(frameRef.current);
  }, [active, restart]);

  useEffect(() => {
    const replay = () => restart();
    window.addEventListener(DATA_REFRESH_EVENT, replay);
    return () => window.removeEventListener(DATA_REFRESH_EVENT, replay);
  }, [restart]);

  return progress;
}
