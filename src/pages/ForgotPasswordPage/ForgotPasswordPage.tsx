import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cloudAccountsEnabled } from '@/lib/cloud-sync';
import { useI18n } from '@/context/i18n-context';

const SUPPORT_EMAIL = '2218145697@qq.com';
const MAIL_SUBJECT_ZH = '莫兰账号找回申请';
const MAIL_BODY_ZH = [
  '你好，我忘记了莫兰账号密码，请协助重置。',
  '',
  '注册手机号：',
  '使用的平台（Windows / iOS / HarmonyOS）：',
  '最近登录时间：',
  '',
  '请不要在邮件中发送原密码。',
].join('\n');
const MAIL_SUBJECT_EN = 'Moran account recovery request';
const MAIL_BODY_EN = [
  'Hello, I have forgotten my Moran account password. Please help me reset it.',
  '',
  'Registered phone number:',
  'Platform (Windows / iOS / HarmonyOS):',
  'Last sign-in time:',
  '',
  'Please do not send your original password by email.',
].join('\n');

export default function ForgotPasswordPage() {
  const { t, language } = useI18n();
  const mailTo = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(language === 'en' ? MAIL_SUBJECT_EN : MAIL_SUBJECT_ZH)}&body=${encodeURIComponent(language === 'en' ? MAIL_BODY_EN : MAIL_BODY_ZH)}`;
  if (!cloudAccountsEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <KeyRound className="h-7 w-7" />
            </span>
            <h1 className="screen-title mt-4">{t('找回密码')}</h1>
            <p className="screen-lead mx-auto mt-2">
              {t('公开商店版本使用本机账号，密码无法远程找回。')}
            </p>
          </div>

          <Card className="app-glass app-glass-strong rounded-[28px] border-white/70 shadow-none">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{t('本机账号说明')}</p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {t('账号和学习记录只保存在当前设备，开发者无法远程重置本机密码。如果忘记密码，可以在系统设置中清除应用数据后重新注册；本机学习进度会一并删除。')}
                  </p>
                </div>
              </div>
              <Link
                to="/login"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" /> {t('返回登录')}
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-background/86 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="relative w-full max-w-md space-y-4">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <KeyRound className="h-7 w-7" />
          </span>
          <h1 className="screen-title mt-4">{t('找回密码')}</h1>
          <p className="screen-lead mx-auto mt-2">{t('为避免冒名重置，请通过邮件联系开发者核验身份。')}</p>
        </div>

        <Card className="app-glass app-glass-strong rounded-[28px] border-white/70 shadow-none">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{t('安全重置说明')}</p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {t('请提供注册手机号和最近登录平台。开发者核验后会在后台设置临时密码，不会查看或发送你的原密码。')}
                </p>
              </div>
            </div>

            <a
              href={mailTo}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" />
              {t('发送找回邮件至 {email}', { email: SUPPORT_EMAIL })}
            </a>

            <p className="text-center text-xs leading-6 text-muted-foreground">
              {t('邮件会预先填写申请模板。发送后请等待开发者回复，不要重复发送密码或验证码。')}
            </p>

            <Link
              to="/login"
              className="flex min-h-11 items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {t('返回登录')}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
