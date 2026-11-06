import { useState } from 'react';
import {
  CheckCircle2,
  CloudDownload,
  Database,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useContent } from '@/context/content-context';
import { useI18n } from '@/context/i18n-context';
import { cn } from '@/lib/utils';
import ProcessingLoader from '@/components/ProcessingLoader';

export default function UpdatesPage() {
  const { t, locale } = useI18n();
  const {
    version,
    source,
    status,
    releaseNote,
    publishedAt,
    remoteEnabled,
    refresh,
  } = useContent();
  const [checking, setChecking] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);

  const publishedLabel = publishedAt
    ? new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(publishedAt))
    : t('包内内容');

  const sourceLabel = {
    bundled: t('包内内容'),
    cache: t('本地缓存'),
    remote: t('云端内容'),
  }[source];

  const statusLabel = {
    idle: t('等待检查'),
    checking: t('正在检查'),
    current: t('内容已是最新'),
    offline: t('网络不可用'),
  }[status];

  const checkNow = async () => {
    setChecking(true);
    setRefreshProgress(0);
    try {
      const result = await refresh(setRefreshProgress);
      if (result.status === 'offline') {
        toast.error(t('暂时无法连接更新服务，已继续使用本地内容'));
      } else if (result.status === 'idle') {
        toast.message(t('当前构建未启用云端内容服务'));
      } else if (!result.updated) {
        toast.success(t('已是最新版本'));
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 pb-8 pt-7">
      <header>
        <h1 className="screen-title flex items-center gap-2">
          <CloudDownload className="h-6 w-6 text-primary" />
          {t('更新中心')}
        </h1>
        <p className="screen-lead mt-2">
          {t('后台发布内容后，下拉刷新即可立即同步到新版本，不需要重新安装。')}
        </p>
      </header>

      <section className="app-glass app-glass-strong overflow-hidden rounded-[28px] p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                v{version || 0}
              </span>
              <span className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                status === 'offline'
                  ? 'bg-warning/12 text-warning'
                  : 'bg-foreground/5 text-foreground/60',
              )}>
                {statusLabel}
              </span>
            </div>
            <p className="mt-6 text-[34px] font-normal leading-none tracking-[-0.05em]">
              {version ? `v${version}` : t('包内版本')}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {sourceLabel} · {t('发布时间')} {publishedLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void checkNow()}
            disabled={checking}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-55"
          >
            {checking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CloudDownload className="h-4 w-4" />}
            {checking ? t('正在检查') : t('检查更新')}
          </button>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-[18px] bg-white/30 p-4">
          {remoteEnabled ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          ) : (
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          )}
          <div>
            <p className="text-sm font-medium">
              {remoteEnabled ? t('云端更新已自动开启') : t('当前构建未连接内容服务')}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {remoteEnabled
                ? t('下拉刷新会立即检查；App 在前台时每分钟自动检查一次，重新进入应用也会立即检查。')
                : t('莫兰需要联网获取词书、账号和云更新，请检查构建配置或网络。')}
            </p>
          </div>
        </div>
        {checking && (
          <ProcessingLoader
            className="mt-4 rounded-[18px] border border-border/70 bg-white/40 p-3"
            label={t('正在检查更新')}
            progress={refreshProgress}
          />
        )}
      </section>

      <section className="app-glass rounded-[28px] p-5 md:p-6">
        <h2 className="text-base font-semibold">{t('本次发布说明')}</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {releaseNote || t('暂无发布说明')}
        </p>
      </section>

      <section className="app-glass rounded-[28px] p-5 md:p-6">
        <h2 className="text-base font-semibold">{t('测试更新流程')}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ['1', t('在后台修改词书和单词')],
            ['2', t('保存草稿，在发布页填写说明并发布')],
            ['3', t('测试设备保持联网，下拉刷新即可立即切换新内容')],
          ].map(([step, text]) => (
            <div key={step} className="rounded-[18px] bg-white/28 p-4">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {step}
              </span>
              <p className="mt-3 text-sm leading-6 text-foreground/72">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <Database className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t('内容更新覆盖词书和单词；界面或功能代码改动仍需要发布新的 App 版本。')}
        </p>
      </section>
    </div>
  );
}
