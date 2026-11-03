import { useI18n } from '@/context/i18n-context';

// 轻量 SVG 记忆持久度阶梯图，避免引入 ECharts 运行时。
const X_LABELS = ['9天前', '8天前', '7天前', '6天前', '5天前', '4天前', '3天前', '前天', '昨天', '今天'];
const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];
const LABELS = ['全部单词', '≥10天', '≥30天', '≥60天', '≥90天'];

export default function PersistenceChart({
  data,
  height = 260,
}: {
  categories: string[];
  data: number[];
  height?: number;
}) {
  const { t } = useI18n();
  const max = Math.max(1, ...data);
  const width = 640;
  const chartHeight = 260;
  const padding = { left: 38, right: 14, top: 24, bottom: 28 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const xFor = (index: number) => padding.left + (index / Math.max(1, X_LABELS.length - 1)) * plotWidth;
  const yFor = (value: number) => padding.top + plotHeight * (1 - value / max);
  const grid = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(max * ratio));

  if (!data.length) {
    return <div className="grid place-items-center py-12 text-sm text-muted-foreground">{t('暂无统计数据')}</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {LABELS.map((label, index) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
            {t(label)}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        style={{ height }}
        className="w-full"
        role="img"
        aria-label={t('记忆持久度阶梯图')}
      >
        {grid.map((value) => (
          <g key={value}>
            <line
              x1={padding.left}
              y1={yFor(value)}
              x2={width - padding.right}
              y2={yFor(value)}
              stroke="currentColor"
              className="text-border/70"
              strokeWidth="1"
            />
            <text
              x={padding.left - 6}
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
        {X_LABELS.map((label, index) => (
          index % 2 === 0 || index === X_LABELS.length - 1 ? (
            <text
              key={label}
              x={xFor(index)}
              y={chartHeight - 8}
              textAnchor="middle"
              fill="currentColor"
              className="text-muted-foreground"
              fontSize="10"
            >
              {t(label)}
            </text>
          ) : null
        ))}
        {data.slice(0, LABELS.length).map((value, index) => (
          <g key={LABELS[index]}>
            <line
              x1={xFor(0)}
              y1={yFor(value)}
              x2={xFor(X_LABELS.length - 1)}
              y2={yFor(value)}
              stroke={COLORS[index]}
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <title>{`${t(LABELS[index])}: ${value}`}</title>
            </line>
            <circle cx={xFor(X_LABELS.length - 1)} cy={yFor(value)} r="3" fill={COLORS[index]} />
          </g>
        ))}
      </svg>
    </div>
  );
}
