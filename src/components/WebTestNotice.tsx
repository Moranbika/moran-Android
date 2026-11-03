import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Headphones, ShieldCheck, Sparkles, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n-context';

const NOTICE_KEY = 'cet6-practice:web-test-notice-v1';

export default function WebTestNotice() {
  const { t } = useI18n();
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(NOTICE_KEY) !== 'dismissed';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.title = t('莫兰 · 网页测试版');
  }, [t]);

  if (!open) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(NOTICE_KEY, 'dismissed');
    } catch {
      // The notice can still be dismissed when site storage is unavailable.
    }
    setOpen(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#173e38]/32 p-4 backdrop-blur-sm">
      <section
        className="w-full max-w-lg rounded-[28px] border border-white/80 bg-[#f9fdfb] p-6 text-foreground shadow-[0_28px_90px_rgba(23,62,56,0.24)] sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="web-test-title"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-primary text-primary-foreground shadow-lg shadow-primary/15">
            <Sparkles className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <span className="rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-primary">
            WEB TEST
          </span>
        </div>

        <h1 id="web-test-title" className="mt-6 font-serif text-[28px] font-normal leading-tight">
          {t('莫兰 · 网页测试版')}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t('界面和学习逻辑与 App 保持一致。这一版主要用于收集网页端的体验反馈。')}
        </p>

        <div className="mt-5 space-y-2.5">
          <div className="flex gap-3 rounded-2xl border border-white/70 bg-white/55 px-4 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-foreground/72">
              {t('学习数据只保存在当前浏览器，不会上传到云端。')}
            </p>
          </div>
          <div className="flex gap-3 rounded-2xl border border-white/70 bg-white/55 px-4 py-3">
            <Wifi className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-foreground/72">
              {t('注册可用任意以 1 开头的 11 位手机号，不需要短信验证码。')}
            </p>
          </div>
          <div className="flex gap-3 rounded-2xl border border-white/70 bg-white/55 px-4 py-3">
            <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-foreground/72">
              {t('听力音频需要联网；建议同时测试手机和电脑浏览器。')}
            </p>
          </div>
        </div>

        <Button className="mt-6 min-h-12 w-full rounded-xl text-sm font-semibold" onClick={dismiss}>
          {t('开始测试')}
        </Button>
        <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
          {t('发现问题时，请记下页面、设备和操作步骤。')}
        </p>
      </section>
    </div>,
    document.body,
  );
}
