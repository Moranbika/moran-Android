// EXPORTS: SettingsPage
// 设置：每日学习量（可输入数字，学习量过多时二次确认）、记忆模式、数据存储说明、登录状态。

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Camera,
  Check,
  Clock3,
  CreditCard,
  Database,
  Globe2,
  Palette,
  Pencil,
  Settings2,
  Target,
  Volume2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/settings-context';
import { useI18n } from '@/context/i18n-context';
import { useProgress } from '@/context/progress-context';
import ConfirmDialog from '@/components/ConfirmDialog';
import { AVATARS, FONT_SCALES, THEMES, WALLPAPERS } from '@/lib/appearance';
import { deleteAccount } from '@/lib/auth';
import { maskAccountId } from '@/lib/account-display';
import { cloudAccountsEnabled } from '@/lib/cloud-sync';
import { fetchQuota, type UserQuota } from '@/lib/payment-api';
import { paymentsEnabled } from '@/lib/feature-flags';
import { PERMISSION_OPEN_EVENT } from '@/lib/permission-consent';
import { cn } from '@/lib/utils';

const MODES = [
  { label: '中英', desc: '看中文想英文，看英文想中文' },
  { label: '英中', desc: '看英文想中文释义' },
  { label: '听音', desc: '播放读音，回忆拼写与释义' },
];

const CONTACT_EMAIL = '2218145697@qq.com';

// 当日学习量达到该值即视为"过多"，需二次确认
const OVERLOAD_THRESHOLD = 30;

export default function SettingsPage() {
  const { t, locale } = useI18n();
  const {
    settings,
    setDailyTarget,
    setMemoryMode,
    setAccent,
    setNickname,
    setWallpaper,
    setTheme,
    setAvatar,
    setFontScale,
    setGlassOpacity,
    setLanguage,
    logout,
  } = useSettings();
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState(String(settings.dailyTarget));
  const [pendingDaily, setPendingDaily] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [nicknameOpen, setNicknameOpen] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState(settings.nickname);
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [quotaError, setQuotaError] = useState('');
  const { resetProgress } = useProgress();
  const [cloudSession, setCloudSession] = useState(
    () => cloudAccountsEnabled && Boolean(localStorage.getItem('moran_token')),
  );
  useEffect(() => {
    const sync = () => {
      setCloudSession(cloudAccountsEnabled && Boolean(localStorage.getItem('moran_token')));
    };
    sync();
    window.addEventListener('moran:auth-changed', sync);
    return () => window.removeEventListener('moran:auth-changed', sync);
  }, []);
  useEffect(() => {
    if (!paymentsEnabled || !cloudSession) {
      setQuota(null);
      setQuotaLoading(false);
      setQuotaError('');
      return;
    }
    let active = true;
    const loadQuota = () => {
      setQuotaLoading(true);
      fetchQuota()
        .then((next) => {
          if (!active) return;
          setQuota(next);
          setQuotaError('');
        })
        .catch((error: Error) => {
          if (active) setQuotaError(error.message);
        })
        .finally(() => {
          if (active) setQuotaLoading(false);
        });
    };
    loadQuota();
    window.addEventListener('moran:quota-changed', loadQuota);
    return () => {
      active = false;
      window.removeEventListener('moran:quota-changed', loadQuota);
    };
  }, [cloudSession]);
  const avatar = AVATARS.find((item) => item.id === settings.avatar) ?? AVATARS[0];
  const accountLabel = maskAccountId(settings.accountId) || t(cloudAccountsEnabled ? '云端账号' : '本机账号');
  const displayName = settings.nickname || (settings.loggedIn ? t('莫兰学习者') : t('访客'));
  const quotaPercent = quota && quota.timesTotal > 0
    ? Math.round((quota.timesUsed / quota.timesTotal) * 100)
    : 0;
  const quotaExpiry = quota?.expiresAt
    ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(quota.expiresAt))
    : '';

  const handleInput = (raw: string) => {
    setInputVal(raw);
    const n = Number(raw);
    if (Number.isNaN(n) || raw.trim() === '') return;
    if (n >= OVERLOAD_THRESHOLD) {
      setPendingDaily(n); // 学习量过多，二次确认
    } else {
      setDailyTarget(n);
    }
  };

  const confirmOverload = () => {
    if (pendingDaily != null) setDailyTarget(pendingDaily);
    setPendingDaily(null);
  };

  const handleDeleteAccount = async () => {
    if (!settings.accountId) {
      setDeleteError(t('当前登录状态缺少账号信息，请退出后重新登录。'));
      return;
    }
    setDeleteError('');
    setDeleting(true);
    const result = await deleteAccount(settings.accountId, deletePassword);
    setDeleting(false);
    if (!result.ok) {
      setDeleteError(t(result.msg));
      return;
    }
    resetProgress();
    logout();
    toast.success(t(result.msg));
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 pt-4 md:pt-7">
      <div>
        <h1 className="screen-title flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-primary" /> {t('设置')}
        </h1>
        <p className="screen-lead mt-2">{t('调整学习习惯，你的选择都会保存在本机')}</p>
      </div>

      {/* 我的 */}
      <Card className="app-glass app-glass-strong order-1">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:gap-5 md:text-left">
            <button
              type="button"
              onClick={() => setAvatarOpen((open) => !open)}
              aria-label={t('设置头像')}
              aria-expanded={avatarOpen}
              className={cn(
                'relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br text-3xl shadow-inner transition-transform hover:-translate-y-0.5',
                avatar.gradient,
              )}
            >
              <span aria-hidden="true">{avatar.emoji}</span>
              <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-white bg-white text-foreground shadow-sm">
                <Camera className="h-3.5 w-3.5" />
              </span>
            </button>
            <div className="min-w-0 flex-1">
            {nicknameOpen ? (
              <div className="flex w-full max-w-xs items-center gap-2 md:max-w-sm">
                <input
                  autoFocus
                  value={nicknameDraft}
                  maxLength={20}
                  onChange={(event) => setNicknameDraft(event.target.value)}
                  aria-label={t('昵称')}
                  placeholder={t('输入昵称')}
                  className="min-w-0 flex-1 rounded-xl border border-primary/25 bg-white/70 px-3 text-center text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNickname(nicknameDraft);
                    setNicknameOpen(false);
                    toast.success(t('昵称已保存'));
                  }}
                  className="shrink-0 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                >
                  {t('保存')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setNicknameDraft(settings.nickname);
                  setNicknameOpen(true);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-lg font-semibold transition-colors hover:bg-primary/6"
              >
                {displayName}
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
            <p className="text-xs text-muted-foreground">
              {settings.loggedIn ? accountLabel : t('登录后记录学习进度与偏好')}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {settings.loggedIn
                ? t(cloudAccountsEnabled
                  ? (cloudSession
                    ? '已登录 · 学习记录会同步到莫兰云端'
                    : '本机登录 · 学习记录保存在此设备')
                  : '已登录 · 学习数据保存在当前设备')
                : ''}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <button
                type="button"
                onClick={() => setAvatarOpen((open) => !open)}
                className="rounded-full border border-border bg-white/55 px-4 py-2 text-xs font-medium text-foreground"
              >
                {t('更换头像')}
              </button>
            <Link
              to="/login"
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {settings.loggedIn ? t(cloudSession ? '管理账号' : '重新登录') : t('去登录')}
            </Link>
            </div>
            </div>
          </div>

          {cloudAccountsEnabled && settings.loggedIn && !cloudSession && (
            <div className="mt-4 rounded-2xl bg-warning/10 p-3 text-xs leading-5 text-warning">
              {t('当前是本机登录，学习记录不会上传到后台。请使用上方“重新登录”完成云端绑定。')}
            </div>
          )}

          {avatarOpen && (
            <div className="mt-4 rounded-[18px] border border-white/65 bg-white/30 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">{t('选择头像')}</p>
                <button
                  type="button"
                  onClick={() => setAvatarOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {t('收起')}
                </button>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {AVATARS.map((item) => {
                  const selected = settings.avatar === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setAvatar(item.id);
                        setAvatarOpen(false);
                        toast.success(t('已切换为{name}头像', { name: t(item.name) }));
                      }}
                      aria-pressed={selected}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl border p-2 text-[11px] transition-colors',
                        selected ? 'border-primary/50 bg-primary/10' : 'border-transparent hover:bg-white/40',
                      )}
                    >
                      <span className={cn('grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br text-xl', item.gradient)}>
                        {item.emoji}
                      </span>
                      <span>{t(item.name)}</span>
                      {selected && <Check className="h-3 w-3 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {paymentsEnabled && (
          <div className="rounded-[22px] border border-white/70 bg-white/36 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="h-4 w-4 text-primary" />
                {t('会员额度')}
              </p>
              {!__MORAN_WEB_TEST__ && (
                <Link
                  to="/membership"
                  className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground"
                >
                  {quota?.activePlans ? t('购买 / 续费') : t('开通会员')}
                </Link>
              )}
            </div>
            {__MORAN_WEB_TEST__ ? (
              <p className="mt-3 text-xs text-muted-foreground">{t('网页测试版不启用会员额度')}</p>
            ) : !cloudSession ? (
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {t('登录云端账号后，可在这里查看会员额度消耗与到期时间。')}
              </p>
            ) : quotaLoading ? (
              <p className="mt-3 text-xs text-muted-foreground">{t('正在同步会员额度…')}</p>
            ) : quotaError ? (
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-destructive">
                <span>{t('额度暂时无法同步')}</span>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('moran:quota-changed'))}
                  className="rounded-full border border-destructive/25 px-3 py-1.5 font-medium"
                >
                  {t('重试')}
                </button>
              </div>
            ) : quota ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    {t('剩余')}
                    <strong className="mx-1 text-2xl font-normal tabular-nums text-foreground">{quota.timesLeft}</strong>
                    {t('次')}
                  </p>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {quota.timesTotal > 0
                      ? t('已用 {used} / {total}', { used: quota.timesUsed, total: quota.timesTotal })
                      : t('当前为有效期套餐')}
                  </p>
                </div>
                {quota.timesTotal > 0 && (
                  <div className="h-2 overflow-hidden rounded-full bg-foreground/8">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-500"
                      style={{ width: `${Math.min(100, Math.max(2, quotaPercent))}%` }}
                    />
                  </div>
                )}
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {quotaExpiry ? t('有效期至 {date}', { date: quotaExpiry }) : t('暂无到期时间')}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">{t('暂无会员额度')}</p>
            )}
          </div>
          )}
        </CardContent>
      </Card>

      {/* 语言 */}
      <Card className="app-glass app-glass-strong order-6">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-base font-semibold">
            <Globe2 className="h-4 w-4 text-primary" /> {t('语言')}
          </div>
          <p className="text-sm text-muted-foreground">{t('切换后，导航、按钮、日期与提示会立即使用所选语言')}</p>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t('应用界面语言')}>
            {([
              ['zh', '中文', '中文'],
              ['en', 'English', 'EN'],
              ['system', '跟随系统', 'Auto'],
            ] as const).map(([value, label, short]) => {
              const selected = settings.language === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={t(label)}
                  onClick={() => setLanguage(value)}
                  className={cn(
                    'rounded-xl border px-2 py-3 text-center transition-colors',
                    selected
                      ? 'border-primary/45 bg-primary/10 text-primary'
                      : 'border-white/62 bg-white/22 text-muted-foreground hover:border-primary/35',
                  )}
                >
                  <span className="block text-sm font-semibold">{short}</span>
                  <span className="mt-0.5 block text-[11px]">{t(label)}</span>
                  {selected && <Check className="mx-auto mt-1 h-3.5 w-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 外观 */}
      <Card className="app-glass app-glass-strong order-8">
        <CardContent className="space-y-5 p-5">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold">
              <Palette className="h-4 w-4 text-primary" /> {t('外观')}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('多套界面风格与十二套壁纸，会立即应用到全部页面')}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">{t('界面风格')}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('颜色、按钮和玻璃色调会随风格变化')}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label={t('选择界面风格')}>
              {THEMES.map((theme) => {
                const selected = settings.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setTheme(theme.id)}
                    className={cn(
                      'rounded-xl border p-2 text-left transition-colors',
                      selected ? 'border-primary/45 bg-white/42' : 'border-white/62 bg-white/22 hover:border-primary/35',
                    )}
                  >
                    <span className={cn('theme-swatch', `theme-swatch-${theme.id}`)} />
                    <span className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold">{t(theme.name)}</span>
                      {selected && <Check className="h-3.5 w-3.5 text-primary" />}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">{t(theme.description)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">{t('壁纸')}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t('选择壁纸')}>
            {WALLPAPERS.map((wallpaper) => {
              const selected = settings.wallpaper === wallpaper.id;
              return (
                <button
                  key={wallpaper.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setWallpaper(wallpaper.id)}
                  className={
                    'group overflow-hidden rounded-[18px] border text-left transition-[border-color,transform,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 ' +
                    (selected
                      ? 'border-primary/45 bg-white/38'
                      : 'border-white/62 bg-white/22 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white/34')
                  }
                >
                  <span className="wallpaper-preview relative block aspect-[16/10] overflow-hidden" data-wallpaper={wallpaper.id}>
                    <span className="absolute inset-0 bg-gradient-to-t from-foreground/12 via-transparent to-white/10" />
                    {selected && (
                      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
                        <Check className="size-3.5" strokeWidth={2.5} />
                      </span>
                    )}
                  </span>
                  <span className="block px-3 pb-3 pt-2.5">
                    <span className="block text-sm font-semibold text-foreground">{t(wallpaper.name)}</span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{t(wallpaper.description)}</span>
                  </span>
                </button>
              );
            })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{t('字体大小')}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t('正文、按钮和表格会一起缩放')}</p>
              </div>
              <span className="rounded-full bg-white/62 px-2.5 py-1 text-xs font-semibold tabular-nums text-foreground">
                {t(FONT_SCALES.find((option) => Math.abs(option.value - settings.fontScale) < 0.001)?.label ?? '标准')}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {FONT_SCALES.map((option) => {
                const selected = Math.abs(settings.fontScale - option.value) < 0.001;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFontScale(option.value)}
                    className={cn(
                      'rounded-xl border px-2 py-2 text-center transition-colors',
                      selected
                        ? 'border-primary/45 bg-primary/10 text-primary'
                        : 'border-white/62 bg-white/22 text-muted-foreground hover:border-primary/35',
                    )}
                  >
                    <span className="block font-semibold" style={{ fontSize: `${option.value * 0.95}rem` }}>Aa</span>
                    <span className="mt-0.5 block text-[11px]">{t(option.label)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[18px] border border-white/65 bg-white/26 p-4">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="glass-opacity" className="text-sm font-semibold">{t('玻璃透明度')}</label>
              <output htmlFor="glass-opacity" className="rounded-full bg-white/62 px-2.5 py-1 text-xs font-semibold tabular-nums text-foreground">
                {settings.glassOpacity}%
              </output>
            </div>
            <input
              id="glass-opacity"
              type="range"
              min={20}
              max={90}
              step={1}
              value={settings.glassOpacity}
              onChange={(event) => setGlassOpacity(Number(event.target.value))}
              aria-label={t('玻璃透明度')}
              aria-valuetext={`${t('玻璃透明度')} ${settings.glassOpacity}%`}
              className="glass-opacity-range mt-3 w-full"
            />
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>{t('更通透')}</span>
              <span>{t('更雾化')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 每日学习量 */}
      <Card className="order-2">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-base font-semibold">
            <Target className="h-4 w-4 text-primary" /> {t('每日学习量')}
          </div>
          <p className="text-sm text-muted-foreground">
            {t('当日复习的单词量 + 当日新学单词量，直接输入数字')}
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={100}
              value={inputVal}
              onChange={(e) => handleInput(e.target.value)}
              aria-label={t('每日学习词数')}
              inputMode="numeric"
              className="w-28 rounded-lg border border-border bg-card px-3 py-2 text-center text-lg font-bold outline-none focus:border-primary"
            />
            <span className="text-sm text-muted-foreground">{t('词 / 天')}</span>
            <span className="ml-auto rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">
              {t('当前 {n} 词', { n: settings.dailyTarget })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 记忆模式 */}
      <Card className="order-4">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-base font-semibold">
            <BookOpen className="h-4 w-4 text-primary" /> {t('记忆模式')}
          </div>
          <div className="grid gap-2">
            {MODES.map((m, i) => (
              <button
                key={m.label}
                onClick={() => setMemoryMode(i)}
                className={
                  'flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ' +
                  (settings.memoryMode === i
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40')
                }
              >
                <span>
                  <span className="font-semibold">{t(m.label)}</span>
                  <span className="ml-2 text-muted-foreground">{t(m.desc)}</span>
                </span>
                {settings.memoryMode === i && (
                  <span className="text-sm font-bold text-primary">{t('当前')}</span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 发音 */}
      <Card className="order-5">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-base font-semibold">
            <Volume2 className="h-4 w-4 text-primary" /> {t('发音')}
          </div>
          <p className="text-sm text-muted-foreground">
            {t('学习时自动朗读当前单词，可选择美音或英音')}
          </p>
          <div className="flex gap-2">
            {(
              [
                ['us', '美音'],
                ['uk', '英音'],
              ] as ['us' | 'uk', string][]
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setAccent(k)}
                className={
                  'flex-1 rounded-lg border px-4 py-3 text-left text-sm transition-colors ' +
                  (settings.accent === k
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40')
                }
              >
                <span className="font-semibold">{t(label)}</span>
                {settings.accent === k && (
                  <span className="ml-2 text-xs font-bold text-primary">{t('当前')}</span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 数据与登录 */}
      <Card className="order-7">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-base font-semibold">
            <Database className="h-4 w-4 text-primary" /> {t('数据存储')}
          </div>
          <p className="text-sm text-muted-foreground">
            {t(cloudAccountsEnabled
              ? (cloudSession
                ? '学习进度保存在本机，并同步到莫兰云端账号；卸载或清除应用数据前请确认已同步。'
                : '当前是本机登录，学习进度还没有上传到云端；请重新登录一次以启用同步。')
              : __MORAN_WEB_TEST__
                ? '学习进度与记忆数据只保存在当前浏览器的本地存储，清除浏览器数据后会丢失。'
                : '学习进度与记忆数据保存在当前设备的应用数据目录，不会自动上传到其他设备。')}
          </p>

          {!__MORAN_WEB_TEST__ && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
              <div>
                <p className="text-sm font-semibold">{t('权限管理')}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {t('逐项检查网络、存储、日历与学习提醒权限')}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new Event(PERMISSION_OPEN_EVENT))}
              >
                {t('重新检查')}
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
            <div>
              <p className="text-sm font-semibold">{t('隐私与账号')}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t('查看隐私政策、用户协议，或删除账号与本机学习数据')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/privacy"
                className="rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-white/40 hover:text-foreground"
              >
                {t('隐私政策')}
              </Link>
              <Link
                to="/terms"
                className="rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-white/40 hover:text-foreground"
              >
                {t('用户协议')}
              </Link>
              {settings.loggedIn && (
                <button
                  type="button"
                  onClick={() => setDeleteOpen((open) => !open)}
                  className="rounded-full border border-destructive/35 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/8"
                >
                  {t('删除账号与数据')}
                </button>
              )}
            </div>
          </div>

          {deleteOpen && settings.loggedIn && (
            <div className="space-y-3 rounded-[18px] border border-destructive/25 bg-destructive/6 p-4">
              <p className="text-sm font-semibold text-destructive">{t('此操作不可恢复')}</p>
              <p className="text-xs leading-5 text-muted-foreground">
                {t('将删除当前账号、本机学习进度、错题、收藏和设置；如云端可用，也会同步删除云端账号与进度。')}
              </p>
              <label className="block text-xs font-medium text-foreground">
                {t('输入当前密码确认')}
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  autoComplete="current-password"
                  className="mt-1.5 w-full rounded-xl border border-destructive/25 bg-white/54 px-3 py-2.5 text-sm outline-none focus:border-destructive"
                />
              </label>
              {deleteError && <p aria-live="polite" className="text-xs text-destructive">{deleteError}</p>}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteOpen(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  className="min-h-10 rounded-full border border-border bg-white/45 px-4 text-xs font-medium"
                >
                  {t('取消')}
                </button>
                <button
                  type="button"
                  disabled={!deletePassword || deleting}
                  onClick={() => void handleDeleteAccount()}
                  className="min-h-10 rounded-full bg-destructive px-4 text-xs font-semibold text-white disabled:opacity-45"
                >
                  {deleting ? t('正在删除…') : t('确认删除账号与数据')}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="order-last mt-2 rounded-[22px] border border-border/65 bg-card/55 px-5 py-5 text-center">
        <p className="text-sm font-semibold text-foreground">{t('莫兰 · 英语词汇学习')}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{t('版本')} 0.2.9</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
          <Link to="/privacy" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">
            {t('隐私政策')}
          </Link>
          <Link to="/terms" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">
            {t('用户协议')}
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">
            {t('联系开发者')}
          </a>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          {t('APP 备案号')}：
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            晋ICP备2026017079号-1A
          </a>
        </p>
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          {t('作文与翻译反馈由设备本地规则生成，不上传作文。')}
        </p>
        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
          {t('AI 生成功能仍在开发中，敬请期待。')}
        </p>
      </footer>

      <ConfirmDialog
        open={pendingDaily !== null}
        title={t('学习量过多')}
        message={t('你输入的每日学习量是 {n} 词，一次学太多容易记不牢、容易疲劳，确定要学这么多吗？', { n: pendingDaily ?? 0 })}
        onCancel={() => setPendingDaily(null)}
        onConfirm={confirmOverload}
      />
    </div>
  );
}
