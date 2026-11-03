import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, CalendarDays, Database, ShieldCheck, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/settings-context';
import { useI18n } from '@/context/i18n-context';
import {
  calendarSupported,
  requestCalendarPermission,
  requestNotificationPermission,
  type PermissionOutcome,
} from '@/lib/native-permissions';
import {
  PERMISSION_CHANGED_EVENT,
  PERMISSION_OPEN_EVENT,
  readPermissionConsent,
  writePermissionConsent,
  type PermissionStepKey,
} from '@/lib/permission-consent';

type StepOutcome = PermissionOutcome | 'accepted';

interface PermissionStep {
  key: PermissionStepKey;
  icon: typeof Wifi;
  title: string;
  description: string;
  actionLabel: string;
  request: () => Promise<StepOutcome>;
}

export default function PermissionConsent() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState<Partial<Record<PermissionStepKey, StepOutcome>>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const steps = useMemo<PermissionStep[]>(() => {
    const list: PermissionStep[] = [
      {
        key: 'network',
        icon: Wifi,
        title: t('网络访问'),
        description: t('莫兰需要联网加载词书、听力、账号和云更新，无法离线使用。'),
        actionLabel: t('继续'),
        request: async () => 'accepted',
      },
      {
        key: 'storage',
        icon: Database,
        title: t('本机存储'),
        description: t('保存登录状态、学习进度、错题和外观设置。网络与存储是应用运行的必需能力。'),
        actionLabel: t('继续'),
        request: async () => 'accepted',
      },
    ];
    if (calendarSupported()) {
      list.push({
        key: 'calendar',
        icon: CalendarDays,
        title: t('学习提醒（日历）'),
        description: t('设置学习计划后，莫兰会在每天 18:00 写入一条日历提醒；完成当天学习后会自动删除。'),
        actionLabel: t('允许日历权限'),
        request: requestCalendarPermission,
      });
    } else {
      list.push({
        key: 'notifications',
        icon: Bell,
        title: t('系统提醒'),
        description: t('当前平台不支持写入系统日历，将使用系统通知在 18:00 提醒。可在系统设置中随时关闭。'),
        actionLabel: t('允许通知'),
        request: requestNotificationPermission,
      });
    }
    return list;
  }, [t]);

  useEffect(() => {
    if (!settings.loggedIn) return;
    if (readPermissionConsent()?.done) return;
    setStepIndex(0);
    setResults({});
    setOpen(true);
  }, [settings.loggedIn]);

  useEffect(() => {
    const openHandler = () => {
      const existing = readPermissionConsent();
      setResults(existing?.results ?? {});
      setStepIndex(0);
      setNotice('');
      setOpen(true);
    };
    window.addEventListener(PERMISSION_OPEN_EVENT, openHandler);
    return () => window.removeEventListener(PERMISSION_OPEN_EVENT, openHandler);
  }, []);

  if (__MORAN_WEB_TEST__ || !open) return null;

  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const Icon = step.icon;

  const advance = (outcome: StepOutcome) => {
    const next = { ...results, [step.key]: outcome };
    setResults(next);
    setNotice('');
    if (stepIndex + 1 >= steps.length) {
      writePermissionConsent({ done: true, results: next });
      setOpen(false);
      window.dispatchEvent(new Event(PERMISSION_CHANGED_EVENT));
      return;
    }
    setStepIndex(stepIndex + 1);
  };

  const request = async () => {
    setBusy(true);
    setNotice('');
    try {
      const outcome = await step.request();
      if (outcome === 'denied') {
        setResults((current) => ({ ...current, [step.key]: outcome }));
        setNotice(t('未获得权限，相关功能可能无法使用。你可以稍后在设置中重新开启。'));
        return;
      }
      if (outcome === 'unavailable') {
        setResults((current) => ({ ...current, [step.key]: outcome }));
        setNotice(t('当前平台不支持这项权限，学习提醒会继续使用应用内弹窗。'));
        return;
      }
      advance(outcome);
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="permission-consent-title">
      <div className="w-full max-w-md rounded-[24px] border border-white/70 bg-[#f7fcf9] p-6 text-foreground shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <span className="rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted-foreground">
            {t('第 {n} / {total} 项', { n: stepIndex + 1, total: steps.length })}
          </span>
        </div>
        <h2 id="permission-consent-title" className="mt-4 text-xl font-semibold">{step.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
        <div className="mt-4 flex gap-3 rounded-2xl border border-white/70 bg-white/45 p-3">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-5 text-muted-foreground">
            {step.key === 'network' && t('这是应用运行的必要条件，关闭网络后无法登录、更新内容或使用云同步。')}
            {step.key === 'storage' && t('只保存在当前设备和你的莫兰云端账号中，不用于广告。')}
            {step.key === 'calendar' && t('只用于写入和删除莫兰自己的学习提醒，不读取其他日历事件。')}
            {step.key === 'notifications' && t('通知只用于 18:00 学习提醒，拒绝不影响其他功能。')}
          </p>
        </div>
        {notice && (
          <p className="mt-3 rounded-xl bg-warning/10 px-3 py-2 text-xs leading-5 text-warning">{notice}</p>
        )}
        <div className="mt-5 flex gap-3">
          <Button className="flex-1" onClick={() => void request()} disabled={busy}>
            {busy ? t('正在申请…') : step.actionLabel}
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => advance('denied')} disabled={busy}>
            {t('暂不')}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
