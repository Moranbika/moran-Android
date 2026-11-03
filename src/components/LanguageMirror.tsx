// 莫兰语感镜：把 compromise 的本地英文分析结果整理成可读的写作体检卡片。

import { Gauge, Repeat2, Route, ScanText, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LanguageInsight, LanguageTone } from '@/lib/language-insight';
import { useI18n } from '@/context/i18n-context';

const TONE_META: Record<LanguageTone, { label: string; className: string }> = {
  clear: { label: '节奏平稳', className: 'bg-primary/10 text-primary' },
  steady: { label: '还可打磨', className: 'bg-warning/12 text-warning' },
  watch: { label: '先拆长句', className: 'bg-destructive/12 text-destructive' },
};

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="min-w-0 rounded-[15px] bg-white/36 px-3 py-3">
      <div className="flex items-center gap-1.5 text-[11px] text-foreground/48">
        <Icon className="h-3.5 w-3.5 text-primary/80" />
        {label}
      </div>
      <p className="mt-1.5 truncate text-lg font-normal tabular-nums tracking-[-0.025em]">{value}</p>
      <p className="mt-0.5 truncate text-[11px] text-foreground/42">{detail}</p>
    </div>
  );
}

export default function LanguageMirror({ insight }: { insight: LanguageInsight }) {
  const { t } = useI18n();
  const tone = TONE_META[insight.tone];
  const topRepeated = insight.repeatedWords[0];

  return (
    <section
      aria-label={t('莫兰语感镜')}
      className="rounded-[20px] border border-primary/15 bg-white/30 p-4 md:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ScanText className="h-4 w-4 text-primary" />
            {t('莫兰语感镜')}
          </p>
          <p className="mt-1 text-xs leading-5 text-foreground/50">
            {t('本地英文分析 · 只检查写作习惯，不上传作文')}
          </p>
        </div>
        <span className={cn('rounded-full px-3 py-1 text-xs font-medium', tone.className)}>
          {t(tone.label)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Metric
          icon={Gauge}
          label={t('平均句长')}
          value={t('{n} 词', { n: insight.averageSentenceWords })}
          detail={t('最长 {longest} 词 / {count} 句', { longest: insight.longestSentenceWords, count: insight.sentenceCount })}
        />
        <Metric
          icon={Type}
          label={t('词汇变化')}
          value={`${insight.lexicalVariety}%`}
          detail={t('{n} 个不同实词', { n: insight.uniqueContentWords })}
        />
        <Metric
          icon={Repeat2}
          label={t('高频复现')}
          value={topRepeated ? `${topRepeated.word} ×${topRepeated.count}` : '—'}
          detail={insight.repeatedWords.length ? t('共 {n} 组高频词', { n: insight.repeatedWords.length }) : t('无明显口头禅')}
        />
        <Metric
          icon={Route}
          label={t('衔接密度')}
          value={`${insight.connectorPer100Words}`}
          detail={t('每百词 {n} 处路标词', { n: insight.connectorCount })}
        />
      </div>

      <ul className="mt-4 space-y-2" aria-label={t('语感镜建议')}>
        {insight.observations.map((observation) => (
          <li key={observation} className="flex gap-2 text-sm leading-6 text-foreground/66">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/65" aria-hidden="true" />
            <span>{t(observation)}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] leading-5 text-foreground/38">
        {t('分析引擎 compromise（MIT）· 词法分析在本机完成 · 结果只用于学习反馈')}
      </p>
    </section>
  );
}
