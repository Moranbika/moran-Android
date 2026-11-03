// EXPORTS: ListeningPage
// 听力考试模式：选套次 → 完整音频连续播放 → 按 Section 作答 → 每个 Section 提交后才显示答案解析。

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Hls from 'hls.js';
import { Headphones, CheckCircle2, XCircle, ChevronDown, ChevronUp, FileText, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useProgress } from '@/context/progress-context';
import { useContent } from '@/context/content-context';
import { useI18n } from '@/context/i18n-context';
import type { IListeningSection, IQuestion } from '@/data/listening';

const PART_LABEL: Record<string, string> = {
  A: 'Section A',
  B: 'Section B',
  C: 'Section C',
};

// 按句子切分英文文本（按 . ! ? ；切分，保留标点）
function splitEn(text: string): string[] {
  return text
    .replace(/\n/g, ' ')
    .match(/[^.!?;]+[.!?;]*\s*/g)
    ?.map((s) => s.trim())
    .filter(Boolean) ?? [text];
}
// 按句子切分中文文本（按 。！？；切分）
function splitZh(text: string): string[] {
  return text
    .replace(/\n/g, '')
    .match(/[^。！？；]+[。！？；]*\s*/g)
    ?.map((s) => s.trim())
    .filter(Boolean) ?? [text];
}

export default function ListeningPage() {
  const { t } = useI18n();
  const { progress, markListeningDone, recordQuestion } = useProgress();
  const { content } = useContent();
  const realSets = useMemo(
    () => content.listeningSets.filter((set) => /^(https?:|\.?\/audio\/)/.test(set.audio)),
    [content.listeningSets],
  );
  const [level, setLevel] = useState<'cet4' | 'cet6'>('cet6');
  const filtered = useMemo(() => realSets.filter((s) => s.level === level), [level, realSets]);
  const [selectedId, setSelectedId] = useState<string>(filtered[0]?.id ?? '');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submittedParts, setSubmittedParts] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowSec, setNowSec] = useState(0);
  const [audioDur, setAudioDur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(() => {
    const saved = Number(localStorage.getItem('cet6-practice:listening-rate'));
    return [0.75, 1, 1.25, 1.5].includes(saved) ? saved : 1;
  });

  const selected = useMemo(() => filtered.find((s) => s.id === selectedId) ?? filtered[0], [filtered, selectedId]);

  // 按 part 分组 sections
  const parts = useMemo(() => {
    if (!selected) return [];
    const groups: Array<{ part: 'A'|'B'|'C'; sections: IListeningSection[]; questions: IQuestion[] }> = [];
    (['A', 'B', 'C'] as const).forEach((p) => {
      const secs = selected.sections.filter((s) => s.part === p);
      if (secs.length > 0) groups.push({ part: p, sections: secs, questions: secs.flatMap((s) => s.questions) });
    });
    return groups;
  }, [selected]);

  // 用 hls.js 加载 m3u8 音频
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selected) return;
    const url = selected.audio;
    if (!url) return;

    let hls: Hls | null = null;
    if (Hls.isSupported() && url.includes('.m3u8')) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(audio);
    } else {
      audio.src = url;
    }
    return () => { hls?.destroy(); };
  }, [selected]);

  const resetSetState = () => {
    setAnswers({});
    setSubmittedParts({});
    setExpanded(null);
    setShowTranscript(false);
    setNowSec(0);
    setAudioDur(0);
  };

  const switchLevel = (lv: 'cet4' | 'cet6') => {
    if (lv === level) return;
    setLevel(lv);
    const f = realSets.find((s) => s.level === lv);
    if (f) setSelectedId(f.id);
    resetSetState();
  };

  const switchSet = (id: string) => {
    setSelectedId(id);
    resetSetState();
  };

  const choose = (no: number, i: number, part: string) => {
    if (submittedParts[part]) return;
    setAnswers((p) => ({ ...p, [no]: i }));
  };

  const submitPart = (part: 'A' | 'B' | 'C') => {
    const grp = parts.find((g) => g.part === part);
    if (!grp) return;
    grp.questions.forEach((q) => {
      const ch = answers[q.no!];
      if (ch !== undefined) recordQuestion(`l-${selected.id}-q${q.no}`, ch === q.answer);
    });
    const nextSubmitted = { ...submittedParts, [part]: true };
    setSubmittedParts(nextSubmitted);
    if (parts.every((group) => nextSubmitted[group.part])) markListeningDone(selected.id);
  };

  const st = selected?.sectionStart ?? {};
  const jumpTo = (p: 'A' | 'B' | 'C') => {
    const t = st[p];
    if (t == null || !audioRef.current) return;
    const a = audioRef.current;
    const go = () => {
      a.currentTime = t;
      a.play().catch(() => {});
    };
    if (a.readyState >= 1) go();
    else {
      a.addEventListener('loadedmetadata', go, { once: true });
      a.load();
    }
  };

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const skip = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const duration = Number.isFinite(audio.duration)
      ? audio.duration
      : audio.currentTime + Math.abs(delta);
    audio.currentTime = Math.max(0, Math.min(Math.max(0, duration - 0.05), audio.currentTime + delta));
  }, []);

  const seekTo = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    const next = Math.max(0, Math.min(audio.duration - 0.05, value));
    audio.currentTime = next;
    setNowSec(next);
  }, []);

  useEffect(() => {
    localStorage.setItem('cet6-practice:listening-rate', String(playbackRate));
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate, selectedId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target
        && (target.tagName === 'INPUT'
          || target.tagName === 'TEXTAREA'
          || target.tagName === 'SELECT'
          || target.isContentEditable)
      ) {
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault();
        togglePlay();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        skip(-10);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        skip(10);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skip, togglePlay]);
  const curPart: 'A' | 'B' | 'C' =
    st.C != null && nowSec >= st.C ? 'C'
    : st.B != null && nowSec >= st.B ? 'B'
    : 'A';
  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60); const ss = Math.floor(s % 60);
    return `${m}:${ss.toString().padStart(2, '0')}`;
  };
  const totalQuestions = parts.reduce((sum, group) => sum + group.questions.length, 0);
  const answeredCount = parts.reduce(
    (sum, group) => sum + group.questions.filter((question) => answers[question.no!] !== undefined).length,
    0,
  );
  const submittedCount = parts.filter((group) => submittedParts[group.part]).length;
  const correctCount = parts.reduce(
    (sum, group) => sum + group.questions.filter((question) => answers[question.no!] === question.answer).length,
    0,
  );
  const seekMax = Number.isFinite(audioDur) && audioDur > 0 ? audioDur : Math.max(1, nowSec);

  if (!selected) return <div className="p-6 text-muted-foreground">{t('暂无可用真题。')}</div>;

  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="screen-title">{t('听力考试')}</h1>
        <p className="screen-lead mt-2">
          {t('播放考试原声音频，按 Section 作答。每个 Section 答完后点"提交本部分"查看答案解析。')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="apple-segmented inline-flex">
          {(['cet4', 'cet6'] as const).map((lv) => (
            <button key={lv} onClick={() => switchLevel(lv)}
              data-active={level === lv}
              className="apple-segment px-4">
              {lv === 'cet4' ? t('四级 CET-4') : t('六级 CET-6')}
            </button>
          ))}
        </div>
        <select value={selected?.id ?? ''} onChange={(e) => switchSet(e.target.value)}
          aria-label={t('选择听力真题')}
          className="max-w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
          {filtered.map((s) => (<option key={s.id} value={s.id}>{s.title}</option>))}
        </select>
        <span className="text-xs text-muted-foreground">{t('共 {n} 套真题', { n: filtered.length })}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.65fr)]">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 shrink-0 text-primary" />
            <p className="min-w-0 flex-1 text-sm font-medium leading-5">{selected.title} · {t('考试原声音频')}</p>
            <button onClick={() => setShowTranscript((v) => !v)}
              className={cn('ml-auto inline-flex min-h-11 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-3 text-xs font-medium transition-colors',
                showTranscript ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary')}>
              <FileText className="h-3.5 w-3.5" />
              {showTranscript ? t('隐藏听力原文') : t('边听边看原文')}
            </button>
          </div>
          <audio key={selected.id} ref={audioRef} preload="none"
            controlsList="nodownload noplaybackrate" onContextMenu={(e) => e.preventDefault()}
            onTimeUpdate={(e) => setNowSec(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => {
              setAudioDur(e.currentTarget.duration);
              e.currentTarget.playbackRate = playbackRate;
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            className="hidden" />
          <div className="mt-4 rounded-2xl border border-border/70 bg-muted/30 p-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? t('暂停') : t('播放')}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? t('暂停') : t('播放')}
              </button>
              <div className="min-w-0 flex-1">
                <input
                  type="range"
                  min={0}
                  max={seekMax}
                  step={0.1}
                  value={Math.min(Math.max(0, nowSec), seekMax)}
                  onChange={(event) => seekTo(Number(event.target.value))}
                  aria-label={t('播放进度')}
                  aria-valuetext={`${fmt(nowSec)} / ${fmt(audioDur)}`}
                  className="h-11 w-full accent-[var(--primary)]"
                />
                <div className="flex items-center justify-between text-[11px] tabular-nums text-muted-foreground">
                  <span>{fmt(nowSec)}</span>
                  <span>{fmt(audioDur)}</span>
                </div>
              </div>
            </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <button type="button" onClick={() => skip(-10)}
              className="min-h-9 rounded-full border border-border bg-card px-3 font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45">
              {t('← 10 秒')}
            </button>
            <button type="button" onClick={() => skip(10)}
              className="min-h-9 rounded-full border border-border bg-card px-3 font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45">
              {t('10 秒 →')}
            </button>
            <div className="apple-segmented ml-auto">
              <span className="text-muted-foreground">{t('倍速')}</span>
              {[0.75, 1, 1.25, 1.5].map((rate) => (
                <button key={rate} type="button" onClick={() => setPlaybackRate(rate)}
                  aria-pressed={playbackRate === rate}
                  data-active={playbackRate === rate}
                  className="apple-segment min-h-9 px-2.5 tabular-nums">
                  {rate}×
                </button>
              ))}
            </div>
          </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="lg:hidden">{t('拖动进度条定位，或直接跳到某个 Section')}</span>
            <span className="hidden lg:inline">
              {t('空格 播放/暂停 · ←/→ 快退/快进 10 秒 · 点击原文句子可回放该句')}
            </span>
          </p>
          {showTranscript && (
            <div className="mt-4 max-h-[480px] space-y-4 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
              {selected.sections.map((sec, idx) => {
                // 每篇文章独立按 startSec/endSec 精确高亮
                const enS = splitEn(sec.transcript);
                const zhS = splitZh(sec.transcriptZh);
                const n = Math.max(enS.length, zhS.length);
                const pairs: Array<{ en: string; zh: string }> = [];
                for (let i = 0; i < n; i++) pairs.push({ en: enS[i] ?? '', zh: zhS[i] ?? '' });

                // 计算每句话的时间范围
                // 优先用 segments（静音检测的真实段落边界），把句子映射到 segments 上
                let sentenceTimes: Array<{ start: number; end: number }>;
                if (sec.segments && sec.segments.length > 0 && pairs.length > 0) {
                  // 每个 segment 内按单词数分配句子
                  const segCount = sec.segments.length;
                  const wordCounts = pairs.map(p => Math.max(1, p.en.split(/\s+/).filter(Boolean).length));
                  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
                  // 按单词数比例把句子分配到 segments
                  sentenceTimes = [];
                  let wordAcc = 0;
                  let pairIdx = 0;
                  for (let s = 0; s < segCount; s++) {
                    const seg = sec.segments[s];
                    const segDur = seg.end - seg.start;
                    // 这个 segment 应该分配多少句子？按单词数比例
                    const segWordTarget = (s + 1) / segCount * totalWords;
                    let segWords = 0;
                    while (pairIdx < pairs.length && (segWords === 0 || wordAcc + segWords < segWordTarget)) {
                      segWords += wordCounts[pairIdx];
                      wordAcc += wordCounts[pairIdx];
                      pairIdx++;
                    }
                    // 在这个 segment 内按句子均分时间
                    const segPairs = pairIdx - (sentenceTimes.length > 0 ? sentenceTimes.length : 0);
                    if (segPairs > 0) {
                      for (let p = 0; p < segPairs; p++) {
                        const pStart = seg.start + (p / segPairs) * segDur;
                        const pEnd = seg.start + ((p + 1) / segPairs) * segDur;
                        sentenceTimes.push({ start: pStart, end: pEnd });
                      }
                    }
                  }
                  // 如果还有剩余句子，按最后一个 segment 均分
                  while (sentenceTimes.length < pairs.length) {
                    const lastSeg = sec.segments[sec.segments.length - 1];
                    sentenceTimes.push({ start: lastSeg.end - 0.5, end: lastSeg.end });
                  }
                } else {
                  // 兜底：按单词数加权
                  const sStart = sec.startSec ?? 0;
                  const sEnd = sec.endSec ?? audioDur;
                  const sDur = Math.max(1, sEnd - sStart);
                  const wordCounts = pairs.map(p => Math.max(1, p.en.split(/\s+/).filter(Boolean).length));
                  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
                  let acc = 0;
                  sentenceTimes = pairs.map((_, i) => {
                    const start = sStart + (acc / totalWords) * sDur;
                    acc += wordCounts[i];
                    const end = sStart + (acc / totalWords) * sDur;
                    return { start, end };
                  });
                }

                const inRange = nowSec >= (sentenceTimes[0]?.start ?? 0) && nowSec < (sentenceTimes[sentenceTimes.length-1]?.end ?? audioDur);
                const activeIdx = inRange
                  ? sentenceTimes.findIndex(t => nowSec >= t.start && nowSec < t.end)
                  : -1;

                return (
                  <div key={idx}>
                    <p className="mb-1.5 text-xs font-semibold text-primary">
                      Section {sec.part} · {sec.title}
                    </p>
                    <div className="space-y-1">
                      {pairs.map((pair, i) => {
                        const active = i === activeIdx;
                        const targetTime = sentenceTimes[i]?.start ?? 0;
                        return (
                          <div key={i} onClick={() => {
                            if (!audioRef.current) return;
                            audioRef.current.currentTime = targetTime;
                            audioRef.current.play().catch(() => {});
                          }}
                            className={cn('cursor-pointer rounded px-1.5 py-0.5 transition-colors hover:bg-primary/8',
                              active ? 'bg-primary/12' : '')}>
                            <span className={cn('text-sm leading-relaxed',
                              active ? 'font-semibold text-primary' : 'text-foreground')}>
                              {pair.en}
                            </span>
                            {pair.zh && (
                              <span className={cn('ml-2 text-sm leading-relaxed',
                                active ? 'font-semibold text-primary' : 'text-primary/75')}>
                                {pair.zh}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {selected.sectionStart && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs text-muted-foreground">{t('章节跳转节点（点击直接跳到对应 Section 开头）：')}</p>
              <div className="flex flex-wrap gap-2">
                {(['A', 'B', 'C'] as const).map((p) => {
                  const t = selected.sectionStart![p];
                  if (t == null) return null;
                  const active = curPart === p;
                  return (
                    <button key={p} onClick={() => jumpTo(p)}
                      className={cn(
                        'rounded-full border px-4 py-1.5 text-xs font-semibold transition-all',
                        active
                          ? 'border-primary bg-primary text-primary-foreground shadow'
                          : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                      )}>
                      Section {p} · {fmt(t)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <aside className="space-y-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{t('本套训练概览')}</p>
                <p className="mt-1 text-xs text-muted-foreground">{selected.title}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {submittedCount}/3 Section
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/32 px-2 py-3">
                <p className="text-[11px] text-muted-foreground">{t('已作答')}</p>
                <p className="mt-1 text-lg tabular-nums">{answeredCount}/{totalQuestions}</p>
              </div>
              <div className="rounded-xl bg-white/32 px-2 py-3">
                <p className="text-[11px] text-muted-foreground">{t('已提交')}</p>
                <p className="mt-1 text-lg tabular-nums">{submittedCount}</p>
              </div>
              <div className="rounded-xl bg-white/32 px-2 py-3">
                <p className="text-[11px] text-muted-foreground">{t('答对')}</p>
                <p className="mt-1 text-lg tabular-nums">{correctCount}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {parts.map((group) => {
                const submitted = !!submittedParts[group.part];
                const correct = group.questions.filter((question) => answers[question.no!] === question.answer).length;
                return (
                  <div key={group.part} className="flex items-center justify-between rounded-xl bg-white/28 px-3 py-2 text-xs">
                    <span className="font-medium">Section {group.part}</span>
                    <span className={submitted ? 'text-success' : 'text-muted-foreground'}>
                      {submitted ? t('已提交 · 答对 {correct}/{total}', { correct, total: group.questions.length }) : t('{n} 题待完成', { n: group.questions.length })}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
              {t('建议先完整听一遍，再按 Section 作答；提交后才会显示答案和解析。')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{t('最近完成')}</p>
              <span className="text-xs text-muted-foreground">
                {progress.listeningDone.length} / {content.listeningSets.length}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {content.listeningSets.slice(0, 4).map((item) => {
                const done = progress.listeningDone.includes(item.id);
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/28 px-3 py-2 text-xs">
                    <span className="min-w-0 truncate">{item.title}</span>
                    <span className={done ? 'shrink-0 text-success' : 'shrink-0 text-muted-foreground'}>
                      {done ? t('已完成') : t('未完成')}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </aside>
      </div>

      {parts.map((grp) => {
        const submitted = !!submittedParts[grp.part];
        const answered = grp.questions.filter((q) => answers[q.no!] !== undefined).length;
        const total = grp.questions.length;
        const correct = grp.questions.filter((q) => answers[q.no!] === q.answer).length;
        return (
          <div key={grp.part}>
            <div className="mb-2 flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold leading-5 text-primary">
                {PART_LABEL[grp.part]} · {grp.sections.map((s) => s.title).join(' / ')}
              </div>
              {submitted && (
                <span className="rounded bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  {t('已提交 · 答对 {correct}/{total}', { correct, total })}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {grp.questions.map((q, qi) => {
                const ch = answers[q.no!];
                const show = submitted;
                const ok = ch === q.answer;
                const open = expanded === q.no;
                const sec = grp.sections.find((s) => s.questions.some((x) => x.no === q.no));
                return (
                  <Card key={q.no}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {q.no}
                        </span>
                        <div className="min-w-0 flex-1">
                          {/* 答题中：题干隐藏，选项文字照常显示（真实考试试卷上印着选项） */}
                          {show && (
                            <>
                              <p className="text-sm font-semibold">{q.prompt}</p>
                              {q.promptZh && <p className="mt-0.5 text-xs text-muted-foreground">{q.promptZh}</p>}
                            </>
                          )}
                          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                            {q.options.map((opt, i) => {
                              let cls = 'border-border bg-card hover:border-primary';
                              if (show) {
                                if (i === q.answer) cls = 'border-success bg-success/10 text-success';
                                else if (ch === i) cls = 'border-destructive bg-destructive/10 text-destructive';
                                else cls = 'border-border bg-card opacity-60';
                              } else if (ch === i) cls = 'border-primary bg-primary/5';
                              return (
                                <button key={i} onClick={() => choose(q.no!, i, grp.part)} disabled={show}
                                  className={cn('flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[13px] leading-5 transition-colors', cls)}>
                                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]">
                                    {String.fromCharCode(65 + i)}
                                  </span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {show && (
                            <div className="mt-3">
                              <button onClick={() => setExpanded(open ? null : q.no!)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                {open ? t('收起') : t('查看题目详情与解析')}
                              </button>
                              {open && (
                                <div className="mt-2 space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-xs">
                                  <p><span className="font-semibold">{t('你的答案：')}</span>{ch !== undefined ? String.fromCharCode(65 + ch) : t('未作答')}</p>
                                  <p><span className="font-semibold text-success">{t('正确答案：')}</span>{String.fromCharCode(65 + q.answer)}</p>
                                  <p><span className="font-semibold">{t('解析：')}</span>{q.analysis}</p>
                                  {sec && (
                                    <details className="mt-1">
                                      <summary className="cursor-pointer text-primary">{t('查看本段录音原文 + 中文翻译')}</summary>
                                      <div className="mt-2 space-y-2">
                                        <p className="whitespace-pre-line leading-relaxed">{sec.transcript}</p>
                                        <p className="whitespace-pre-line leading-relaxed text-primary/80">{sec.transcriptZh}</p>
                                      </div>
                                    </details>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {show && (ok
                          ? <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-success" />
                          : <XCircle className="mt-1 h-5 w-5 shrink-0 text-destructive" />)}
                      </div>
                      {qi === grp.questions.length - 1 && !submitted && (
                        <div className="mt-3 flex justify-end">
                          <Button size="sm" onClick={() => submitPart(grp.part)} disabled={answered < total}>
                            {answered < total ? t('提交 Section {part}（{done}/{total}）', { part: grp.part, done: answered, total }) : t('提交 Section {part}', { part: grp.part })}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
