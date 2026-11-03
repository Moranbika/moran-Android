import type { ForgettingCurve } from '@/lib/memory';
import { useI18n } from '@/context/i18n-context';

const X_LABELS = Array.from({ length: 15 }, (_, index) => (
  index === 0 ? '今天' : index === 1 ? '明天' : index === 2 ? '后天' : `${index}天后`
));
const GRID = [0, 25, 50, 75, 100];
const WIDTH = 1080;
const HEIGHT = 360;
const PADDING = { left: 46, right: 24, top: 22, bottom: 42 };

function xAt(index: number, count: number) {
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  return PADDING.left + (index / Math.max(1, count - 1)) * plotWidth;
}

function yAt(value: number) {
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  return PADDING.top + (1 - Math.max(0, Math.min(100, value)) / 100) * plotHeight;
}

function pointsFor(data: Array<{ recall: number }>) {
  return data
    .map((point, index) => `${xAt(index, data.length).toFixed(1)},${yAt(point.recall).toFixed(1)}`)
    .join(' ');
}

export default function MemoryCurve({ curve }: { curve: ForgettingCurve }) {
  const { t } = useI18n();
  const actual = curve.actual;
  const theoretical = curve.theoretical;

  return (
    <div className="w-full">
      <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--chart-1)]" /> {t('你的学习遗忘曲线')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--chart-2)]" /> {t('艾宾浩斯遗忘曲线')}
        </span>
      </div>
      <p className="mb-2 text-[11px] text-muted-foreground sm:hidden">{t('左右滑动查看完整 14 天趋势')}</p>
      <div className="scrollbar-hidden overflow-x-auto overscroll-x-contain pb-2">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-[320px] w-full min-w-[940px]"
          role="img"
          aria-label={t('你的学习遗忘曲线与艾宾浩斯理论曲线对比')}
        >
        {GRID.map((value) => (
          <g key={value}>
            <line
              x1={PADDING.left}
              y1={yAt(value)}
              x2={WIDTH - PADDING.right}
              y2={yAt(value)}
              stroke="currentColor"
              className="text-border/70"
              strokeWidth="1"
            />
            <text
              x={PADDING.left - 7}
              y={yAt(value) + 4}
              textAnchor="end"
              fill="currentColor"
              className="text-muted-foreground"
              fontSize="11"
            >
              {value}%
            </text>
          </g>
        ))}

        {X_LABELS.map((label, index) => (
          <text
            key={index}
            x={xAt(index, Math.max(actual.length, theoretical.length, 1))}
            y={HEIGHT - 16}
            textAnchor="middle"
            fill="currentColor"
            className="text-muted-foreground"
            fontSize="11"
          >
            {t(label)}
          </text>
        ))}

        <polyline
          points={pointsFor(theoretical)}
          fill="none"
          stroke="var(--chart-2)"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={pointsFor(actual)}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {actual.map((point, index) => (
          <circle
            key={`actual-${index}`}
            cx={xAt(index, actual.length)}
            cy={yAt(point.recall)}
            r="3.2"
            fill="var(--chart-1)"
            stroke="var(--card)"
            strokeWidth="1.2"
          >
            <title>{`${t(X_LABELS[index] ?? '')}: ${point.recall}%`}</title>
          </circle>
        ))}
        </svg>
      </div>
      <div className="mt-2 rounded-xl bg-white/30 p-3 text-center text-xs leading-5 text-muted-foreground">
        {t('坚持使用莫兰学习的时间越久，你的遗忘曲线统计将越精准。')}
      </div>
    </div>
  );
}
