import { useMemo } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { useAnimatedProgress } from '@/hooks/use-animated-progress';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  active?: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  active,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 760,
  className,
}: AnimatedNumberProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const progress = useAnimatedProgress(active ?? inView, duration);
  const current = value * progress;
  const formatter = useMemo(() => new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }), [decimals]);
  const formatted = formatter.format(current);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
