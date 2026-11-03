import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/i18n-context';
import { useInView } from '@/hooks/use-in-view';
import { useAnimatedProgress } from '@/hooks/use-animated-progress';

export interface SilentLinePoint {
  label: string;
  value: number;
}

export function SilentLineChart({
  points,
  height = 220,
  accent = 'var(--primary)',
  ariaLabel = '学习趋势折线图',
  valueSuffix = '',
}: {
  points: SilentLinePoint[];
  height?: number;
  accent?: string;
  ariaLabel?: string;
  valueSuffix?: string;
}) {
  const { t } = useI18n();
  const width = 720;
  const padding = { left: 44, right: 18, top: 24, bottom: 30 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...points.map((point) => point.value));
  const yMax = Math.max(4, Math.ceil(maxValue / 4) * 4);
  const xFor = (index: number) =>
    padding.left + (index / Math.max(1, points.length - 1)) * plotWidth;
  const yFor = (value: number) =>
    padding.top + (1 - Math.min(yMax, Math.max(0, value)) / yMax) * plotHeight;
  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(point.value)}`)
    .join(' ');
  const baseline = padding.top + plotHeight;
  const area = points.length
    ? `${line} L ${xFor(points.length - 1)} ${baseline} L ${xFor(0)} ${baseline} Z`
    : '';
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(yMax * ratio));
  const tickStep = Math.max(1, Math.ceil(points.length / 7));
  const last = points[points.length - 1];

  if (!points.length) {
    return (
      <div className="grid min-h-40 place-items-center text-sm text-muted-foreground">
        {t('还没有学习记录')}
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ height }}
      className="w-full"
      role="img"
      aria-label={ariaLabel}
    >
      {ticks.map((value) => (
        <g key={value}>
          <line
            x1={padding.left}
            y1={yFor(value)}
            x2={width - padding.right}
            y2={yFor(value)}
            stroke="currentColor"
            className="text-border/70"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={padding.left - 8}
            y={yFor(value) + 4}
            textAnchor="end"
            fill="currentColor"
            className="text-muted-foreground"
            fontSize="10"
          >
            {value}
          </text>
        </g>
      ))}
      <path d={area} fill={accent} opacity="0.1" />
      <path
        d={line}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {points.map((point, index) => {
        const showLabel = index % tickStep === 0 || index === points.length - 1;
        return (
          <g key={`${point.label}-${index}`}>
            {index === points.length - 1 && (
              <circle
                cx={xFor(index)}
                cy={yFor(point.value)}
                r="3.5"
                fill={accent}
                stroke="var(--card)"
                strokeWidth="2"
              />
            )}
            {showLabel && (
              <text
                x={xFor(index)}
                y={height - 8}
                textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
                fill="currentColor"
                className="text-muted-foreground"
                fontSize="10"
              >
                {point.label}
              </text>
            )}
          </g>
        );
      })}
      {last && (
        <text
          x={xFor(points.length - 1)}
          y={Math.max(12, yFor(last.value) - 10)}
          textAnchor="end"
          fill="currentColor"
          className="text-foreground"
          fontSize="11"
          fontWeight="600"
        >
          {last.value}
          {valueSuffix}
        </text>
      )}
    </svg>
  );
}

export function SilentBarList({
  rows,
  max,
  suffix = '',
  accent = 'var(--primary)',
}: {
  rows: Array<{ label: string; value: number; detail?: string }>;
  max?: number;
  suffix?: string;
  accent?: string;
}) {
  const maxValue = Math.max(1, max ?? Math.max(...rows.map((row) => row.value)));
  const { ref, inView } = useInView<HTMLDivElement>();
  const progress = useAnimatedProgress(inView, 680);

  return (
    <div ref={ref} className="space-y-4">
      {rows.map((row) => (
        <div key={row.label} className="silent-bar-row">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.label}</p>
            {row.detail && <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.detail}</p>}
          </div>
          <div className="silent-bar-track" aria-hidden="true">
            <span
              style={{
                width: `${row.value > 0 ? Math.max(4, (row.value / maxValue) * 100) * progress : 0}%`,
                backgroundColor: accent,
              }}
            />
          </div>
          <span className="silent-bar-value tabular-nums">
            {Math.round(row.value * progress)}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SilentRing({
  value,
  size = 132,
  label,
}: {
  value: number;
  size?: number;
  label: string;
}) {
  const { t } = useI18n();
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={label}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--silent-ring-track, rgba(23, 62, 56, 0.14))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <strong className="text-[30px] font-normal tabular-nums tracking-[-0.04em]">{progress}%</strong>
        <span className="text-xs text-muted-foreground">{t('今日完成')}</span>
      </div>
    </div>
  );
}

export function SilentPanel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('silent-panel', className)}>
      <div className="silent-panel-head">
        <div>
          <h2 className="text-base font-medium">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
