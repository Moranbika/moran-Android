// 图形验证码（人机验证）：Canvas 绘制随机字符 + 干扰线/噪点，点击可刷新。
// 由父组件持有 code，本组件负责绘制并暴露点击刷新。

import { useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function Captcha({ code, onRefresh }: { code: string; onRefresh: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, w, h);
    // 干扰线
    for (let i = 0; i < 4; i += 1) {
      ctx.strokeStyle = ['#cbd5e1', '#94a3b8', '#c7d2fe'][i % 3];
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * h);
      ctx.lineTo(w, Math.random() * h);
      ctx.stroke();
    }
    // 噪点
    for (let i = 0; i < 30; i += 1) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
    // 字符
    ctx.font = 'bold 26px monospace';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < code.length; i += 1) {
      ctx.save();
      ctx.translate(14 + i * 24, h / 2 + (Math.random() * 6 - 3));
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillStyle = ['#334155', '#1d4ed8', '#be123c', '#166534'][i % 4];
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  }, [code]);

  return (
    <button
      type="button"
      onClick={onRefresh}
      title="点击刷新验证码"
      className="flex items-center gap-2 rounded-lg border border-border bg-card px-2"
    >
      <canvas ref={ref} width={104} height={40} className="h-10" />
      <RefreshCw className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
