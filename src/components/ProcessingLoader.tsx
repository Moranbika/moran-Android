import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingLoaderProps {
  label: string;
  progress: number;
  active?: boolean;
  className?: string;
}

function useSmoothProgress(value: number) {
  const target = Math.max(0, Math.min(100, value));
  const [visual, setVisual] = useState(target);
  const visualRef = useRef(target);

  useEffect(() => {
    const from = visualRef.current;
    if (Math.abs(from - target) < 0.01) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      visualRef.current = target;
      setVisual(target);
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const duration = 260;
    const tick = (now: number) => {
      const ratio = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - ratio) ** 3;
      const next = from + (target - from) * eased;
      visualRef.current = next;
      setVisual(next);
      if (ratio < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  return visual;
}

export default function ProcessingLoader({
  label,
  progress,
  active = true,
  className,
}: ProcessingLoaderProps) {
  const visual = useSmoothProgress(progress);
  const rounded = Math.round(visual);

  return (
    <div className={cn('processing-loader', className)} role="status" aria-live="polite">
      <div className="processing-loader-head">
        {active ? (
          <LoaderCircle className="processing-loader-spinner h-5 w-5 text-primary" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
        <span className="processing-loader-value">{rounded}%</span>
      </div>
      <div
        className="processing-loader-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
      >
        <span style={{ width: `${visual}%` }} />
      </div>
    </div>
  );
}
