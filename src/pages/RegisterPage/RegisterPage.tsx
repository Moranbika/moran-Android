// EXPORTS: RegisterPage
// 注册界面：本机账号、图形验证码与密码确认。手机号仅作为本机账号标识。

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Phone, Lock, ShieldCheck, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/context/settings-context';
import { useI18n } from '@/context/i18n-context';
import { register, isValidPhone } from '@/lib/auth';
import { writePrivacyConsent } from '@/lib/privacy-consent';
import Captcha from '@/components/Captcha';
import { randomCaptchaCode } from '@/lib/random-captcha';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const { t } = useI18n();
  const { login } = useSettings();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [captchaCode, setCaptchaCode] = useState(() => randomCaptchaCode());
  const [captchaInput, setCaptchaInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; msg: string } | null>(null);

  const submit = async () => {
    setNotice(null);
    if (!agreed) {
      setNotice({ ok: false, msg: t('请先阅读并勾选同意《用户协议》和《隐私政策》') });
      return;
    }
    if (!isValidPhone(phone)) {
      setNotice({ ok: false, msg: t('请输入有效的 11 位手机号') });
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setNotice({ ok: false, msg: t('图形验证码错误，请重新输入或刷新') });
      setCaptchaCode(randomCaptchaCode());
      return;
    }
    if (password.length < 6) {
      setNotice({ ok: false, msg: t('密码至少 6 位') });
      return;
    }
    if (password !== confirm) {
      setNotice({ ok: false, msg: t('两次输入的密码不一致') });
      return;
    }
    writePrivacyConsent();
    const r = await register(phone, password);
    if (!r.ok) {
      setNotice({ ok: false, msg: t(r.msg) });
      toast.error(t(r.msg));
      return;
    }
    login('account', phone.trim());
    toast.success(t('注册成功，欢迎使用莫兰'));
    navigate('/', { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-background/86 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="relative w-full max-w-sm space-y-4">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-7 w-7" />
          </span>
          <h1 className="screen-title mt-4">{t('注册账号')}</h1>
          <p className="screen-lead mx-auto mt-2">{t('绑定手机号，保存你的学习账号与登录状态')}</p>
        </div>

        <Card className="app-glass app-glass-strong rounded-[28px] border-white/70 shadow-none">
          <CardContent className="space-y-3 p-6">
            {/* 手机号 */}
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
              <Phone className="h-4 w-4 text-muted-foreground" />
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

            {/* 人机验证：图形验证码 */}
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2.5">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <input
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder={t('图形验证码（人机验证）')}
                  aria-label={t('图形验证码')}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <Captcha
                code={captchaCode}
                onRefresh={() => {
                  setCaptchaCode(randomCaptchaCode());
                  setCaptchaInput('');
                }}
              />
            </div>

            {/* 密码 */}
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('设置密码（至少 6 位）')}
                aria-label={t('设置密码')}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t('确认密码')}
                aria-label={t('确认密码')}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            {notice && (
              <p aria-live="polite" className={cn('text-xs', notice.ok ? 'text-primary' : 'text-destructive')}>{notice.msg}</p>
            )}

            <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-muted-foreground">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
              />
              <span>
                {t('我已阅读并同意')}
                <Link to="/terms" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{t('《用户协议》')}</Link>
                {t('与')}
                <Link to="/privacy" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{t('《隐私政策》')}</Link>
              </span>
            </label>

            <button
              onClick={submit}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <UserRound className="h-4 w-4" /> {t('注册并登录')}
            </button>

            <Link to="/login" className="flex min-h-11 items-center justify-center text-center text-xs text-muted-foreground hover:text-foreground">
              {t('已有账号？去登录')}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
