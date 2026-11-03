// 轻量 SVG 柱状图：支持堆叠与非堆叠，避免引入 ECharts 运行时。
import { useI18n } from '@/context/i18n-context';
import { useInView } from '@/hooks/use-in-view';
import { useAnimatedProgress } from '@/hooks/use-animated-progress';

export interface ChartSeries {
  name: string;
  color: string;
  data: number[];
}

export default function StudyChart({
  categories,
  series,
  stack = true,
  height = 300,
}: {
  categories: string[];
  series: ChartSeries[];
  stack?: boolean;
  height?: number;
}) {
  const { t } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>();
  const progress = useAnimatedProgress(inView, 720);
  const max = Math.max(
    1,
    ...categories.map((_, index) => stack
      ? series.reduce((sum, item) => sum + (item.data[index] ?? 0), 0)
      : Math.max(...series.map((item) => item.data[index] ?? 0), 0)),
  );
  const width = 640;
  const chartHeight = 300;
  const padding = { left: 38, right: 14, top: 28, bottom: 28 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const groupWidth = plotWidth / Math.max(1, categories.length);
  const barWidth = groupWidth * 0.52;
  const yFor = (value: number) => padding.top + plotHeight * (1 - value / max);
  const grid = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(max * ratio));

  if (!categories.length) {
    return <div className="grid place-items-center py-12 text-sm text-muted-foreground">暂无统计数据</div>;
  }

  return (
    <div ref={ref} className="w-full">
      <div className="mb-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        {series.map((item) => (
          <span key={item.name} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            {t(item.name)}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        style={{ height }}
        className="w-full"
        role="img"
        aria-label="学习统计柱状图"
      >
        {stack && (
          <defs>
            {categories.map((category, categoryIndex) => {
              const total = series.reduce((sum, item) => sum + (item.data[categoryIndex] ?? 0), 0);
              const x = padding.left + categoryIndex * groupWidth + (groupWidth - barWidth) / 2;
              const y = yFor(total);
              return (
                <clipPath id={`study-bar-${categoryIndex}`} key={`clip-${category}-${categoryIndex}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(0, yFor(0) - y)}
                    rx="5"
                  />
                </clipPath>
              );
            })}
          </defs>
        )}
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
        {categories.map((category, categoryIndex) => {
          let cumulative = 0;
          const total = series.reduce((sum, item) => sum + (item.data[categoryIndex] ?? 0), 0);
          const labelValue = stack
            ? total
            : Math.max(0, ...series.map((item) => item.data[categoryIndex] ?? 0));
          return (
            <g key={`${category}-${categoryIndex}`}>
              <g clipPath={stack ? `url(#study-bar-${categoryIndex})` : undefined}>
                {series.map((item, seriesIndex) => {
                  const value = item.data[categoryIndex] ?? 0;
                  if (value <= 0) return null;
                  const animatedValue = value * progress;
                  const segmentWidth = stack ? barWidth : barWidth / Math.max(1, series.length);
                  const x = padding.left + categoryIndex * groupWidth + (groupWidth - barWidth) / 2;
                  const y = stack ? yFor(cumulative + animatedValue) : yFor(animatedValue);
                  const segmentHeight = plotHeight * (animatedValue / max);
                  if (stack) cumulative += animatedValue;
                  return (
                    <rect
                      key={item.name}
                      x={x + (stack ? 0 : seriesIndex * segmentWidth)}
                      y={y}
                      width={segmentWidth}
                      height={Math.max(0, segmentHeight)}
                      fill={item.color}
                      rx={stack ? 0 : 4}
                    >
                    <title>{`${t(category)} · ${t(item.name)}: ${value}`}</title>
                    </rect>
                  );
                })}
              </g>
              {labelValue > 0 && progress > 0.02 && (
                <text
                  x={padding.left + categoryIndex * groupWidth + groupWidth / 2}
                  y={yFor(labelValue * progress) - 7}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-foreground"
                  fontSize="10"
                  fontWeight="600"
                >
                  {Math.round(labelValue * progress)}
                </text>
              )}
              <text
                x={padding.left + categoryIndex * groupWidth + groupWidth / 2}
                y={chartHeight - 8}
                textAnchor="middle"
                fill="currentColor"
                className="text-muted-foreground"
                fontSize="10"
              >
                {t(category)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
