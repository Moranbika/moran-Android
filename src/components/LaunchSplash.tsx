import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const STANDARD_HOLD_MS = 2050;
const REDUCED_HOLD_MS = 600;
const STANDARD_EXIT_MS = 750;

interface LaunchSplashProps {
  onComplete: () => void;
}

export default function LaunchSplash({ onComplete }: LaunchSplashProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(
      () => setLeaving(true),
      reducedMotion ? REDUCED_HOLD_MS : STANDARD_HOLD_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(onComplete, reducedMotion ? 160 : STANDARD_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, onComplete]);

  return (
    <div
      className={cn('moran-launch', leaving && 'is-leaving')}
      role="status"
      aria-label="莫兰正在启动"
    >
      <div className="moran-launch-brand" aria-hidden="true">
        <p className="moran-launch-wordmark">莫兰</p>
        <p className="moran-launch-signature">MORAN</p>
        <p className="moran-launch-tagline">把今天，翻到下一页。</p>
      </div>
      <span className="sr-only">莫兰正在启动</span>
    </div>
  );
}
