// EXPORTS: LoginPage
// 登录界面：真实手机号账号登录（本地校验登录态）。
// 微信 / QQ / Apple 为第三方登录入口，需开放平台应用 + 云端回调才能真实接入。

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, GraduationCap, LogOut, Phone, Lock, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/context/settings-context';
import { useI18n } from '@/context/i18n-context';
import { login } from '@/lib/auth';
import { maskAccountId } from '@/lib/account-display';
import { cloudAccountsEnabled } from '@/lib/cloud-sync';
import { writePrivacyConsent } from '@/lib/privacy-consent';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const { t } = useI18n();
  const { settings, login: setLogin, logout } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from || '/';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; msg: string } | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [hasCloudToken, setHasCloudToken] = useState(() => Boolean(localStorage.getItem('moran_token')));
  const consentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => setHasCloudToken(Boolean(localStorage.getItem('moran_token')));
    sync();
    window.addEventListener('moran:auth-changed', sync);
    return () => window.removeEventListener('moran:auth-changed', sync);
  }, []);

  const loggedIn = settings.loggedIn;

  const display = useMemo(() => {
    if (!loggedIn) return '';
    if (settings.loginMethod === 'account') return maskAccountId(settings.accountId);
    return { wechat: t('微信账号'), qq: t('QQ 账号'), apple: t('Apple 账号') }[settings.loginMethod ?? ''] ?? '';
  }, [loggedIn, settings.loginMethod, settings.accountId, t]);

  const submit = async () => {
    setNotice(null);
    if (!agreed) {
      const message = t('请先阅读并勾选同意《用户协议》和《隐私政策》');
      setNotice({ ok: false, msg: message });
      toast.message(message);
      consentRef.current?.focus();
      consentRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    if (!phone.trim() || !password) {
      setNotice({ ok: false, msg: t('请输入手机号和密码') });
      return;
    }
    setShowAgreement(true);
  };

  const confirmAgree = async () => {
    writePrivacyConsent();
    setAgreed(true);
    setShowAgreement(false);
    // 用户点了"同意并登录"，直接继续登录
    setBusy(true);
    const r = await login(phone, password);
    setBusy(false);
    if (!r.ok) {
      setNotice({ ok: false, msg: t(r.msg) });
      toast.error(t(r.msg));
      return;
    }
    setLogin('account', r.phone ?? phone.trim());
    toast.success(t('登录成功，欢迎回来'));
    navigate(destination, { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-background/86 backdrop-blur-[2px]" aria-hidden="true" />
      {/* 隐私政策确认弹窗 */}
      {showAgreement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-consent-title"
        >
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h2 id="login-consent-title" className="text-lg font-bold">{t('用户协议与隐私政策')}</h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {t('未勾选同意或选择不同意时，莫兰不会登录账号，也不会向你输入的手机号发起账号请求。')}
            </p>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
              <div>
                <p className="font-semibold">{t('《用户协议》')}</p>
                <p className="mt-1 text-muted-foreground">
                  {t(cloudAccountsEnabled
                    ? '欢迎使用莫兰英语学习应用。账号与学习记录会同步到莫兰云端，学习结果仅供参考。'
                    : '欢迎使用莫兰英语学习应用。核心学习数据保存在当前设备，账号仅在用户主动触发且云端服务可用时联网。学习结果仅供参考。')}
                </p>
                <Link to="/terms" className="mt-1 inline-block text-primary underline underline-offset-4">
                  {t('阅读完整用户协议')}
                </Link>
              </div>
              <div>
                <p className="font-semibold">{t('《隐私政策》')}</p>
                <p className="mt-1 text-muted-foreground">
                  {t(cloudAccountsEnabled
                    ? '手机号、账号和学习进度会同步到莫兰云端；发音、听力和账号服务会产生必要网络请求。莫兰不将数据用于广告或出售。'
                    : '手机号、学习进度和设置在设备本地保存。联网播放发音、听力及使用账号服务时会产生必要网络请求。莫兰不将数据用于广告或出售。')}
                </p>
                <Link to="/privacy" className="mt-1 inline-block text-primary underline underline-offset-4">
                  {t('阅读完整隐私政策')}
                </Link>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowAgreement(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                {t('不同意')}
              </button>
              <button
                onClick={confirmAgree}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {t('同意并登录')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-sm space-y-4">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-7 w-7" />
          </span>
          <h1 className="screen-title mt-4">{loggedIn ? t('管理账号') : t('莫兰')}</h1>
          <p className="screen-lead mx-auto mt-2">{loggedIn ? t('当前账号与设备登录状态') : t('登录后开始记录你的六级学习进度')}</p>
        </div>

        <Card className="app-glass app-glass-strong rounded-[28px] border-white/70 shadow-none">
          <CardContent className="space-y-3 p-6">
            {loggedIn ? (
              <div className="text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <UserRound className="h-5 w-5" />
                </span>
                <p className="mt-2 text-lg font-semibold">{display}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(cloudAccountsEnabled && hasCloudToken
                    ? '已登录 · 学习进度已同步到莫兰云端'
                    : '已登录 · 学习进度保存在当前设备')}
                </p>
                <button
                  onClick={() => {
                    logout();
                    toast.success(t('已退出登录'));
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <LogOut className="h-4 w-4" /> {t('退出登录')}
                </button>
                <div className="mt-4 flex justify-center gap-3 border-t border-border/70 pt-4 text-xs">
                  <Link to="/privacy" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{t('隐私政策')}</Link>
                  <Link to="/terms" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{t('用户协议')}</Link>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white/60 text-sm font-medium text-foreground hover:bg-white"
                >
                  <ArrowLeft className="h-4 w-4" /> {t('返回设置')}
                </button>
              </div>
            ) : (
              <>
                {/* 手机号账号登录 */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold">{t('手机号登录')}</p>
                  <div className="moran-field flex items-center gap-2 rounded-lg border px-3 py-2.5">
                    <Phone className="moran-field-icon h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('手机号')}
                      aria-label={t('手机号')}
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={11}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                  <div className="moran-field flex items-center gap-2 rounded-lg border px-3 py-2.5">
                    <Lock className="moran-field-icon h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('密码')}
                      aria-label={t('密码')}
                      autoComplete="current-password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? t('隐藏密码') : t('显示密码')}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="moran-password-toggle"
                    >
                      {showPassword
                        ? <EyeOff className="h-[18px] w-[18px]" />
                        : <Eye className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                  {notice && (
                    <p aria-live="polite" className={cn('text-xs', notice.ok ? 'text-primary' : 'text-destructive')}>{notice.msg}</p>
                  )}
                  <button
                    onClick={submit}
                    disabled={busy || !phone || !password}
                    aria-busy={busy}
                    className="moran-action flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {busy ? (
                      <>
                        {t('登录中')}
                        <span className="moran-action-dots" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </span>
                      </>
                    ) : t('登录')}
                  </button>
                  <Link
                    to="/register"
                    className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
                  >
                    {t('没有账号？注册一个')}
                  </Link>
                  {cloudAccountsEnabled ? (
                    <Link
                      to="/forgot-password"
                      className="block w-full text-center text-xs font-medium text-primary hover:underline"
                    >
                      {t('忘记密码？')}
                    </Link>
                  ) : (
                    <p className="text-center text-xs text-muted-foreground">
                      {t('账号只保存在本机，无法远程找回密码。')}
                    </p>
                  )}
                </div>

              </>
            )}

          </CardContent>
        </Card>

        {!loggedIn && (
        <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <input
            ref={consentRef}
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setNotice(null);
            }}
            className="h-4 w-4 shrink-0 rounded border-border accent-primary"
          />
          {t('我已阅读并同意')}
          <Link to="/terms" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{t('《用户协议》')}</Link>
          {t('与')}
          <Link to="/privacy" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{t('《隐私政策》')}</Link>
        </label>
        )}
      </div>
    </div>
  );
}
