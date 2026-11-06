// 首次使用前的隐私保护指引：必须由用户主动勾选并点击同意，未同意不创建账号。

import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useI18n } from '@/context/i18n-context';
import { cloudAccountsEnabled } from '@/lib/cloud-sync';
import { hasCurrentPrivacyConsent, writePrivacyConsent } from '@/lib/privacy-consent';

const LEGAL_PATHS = ['/privacy', '/terms'];

export default function PrivacyConsentGate() {
  const { t } = useI18n();
  const location = useLocation();
  const [accepted, setAccepted] = useState(() => hasCurrentPrivacyConsent());
  const [checked, setChecked] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [checkNotice, setCheckNotice] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);

  if (accepted || LEGAL_PATHS.includes(location.pathname)) return null;

  const agree = () => {
    if (!checked) {
      setCheckNotice(true);
      checkboxRef.current?.focus();
      return;
    }
    writePrivacyConsent();
    setAccepted(true);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-consent-title"
      aria-describedby="privacy-consent-summary"
    >
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-[24px] border border-white/70 bg-[#f7fcf9] p-6 text-foreground shadow-2xl">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h2 id="privacy-consent-title" className="mt-4 text-xl font-semibold">
          {declined ? t('你已选择不同意') : t('隐私保护指引')}
        </h2>

        {declined ? (
          <>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t('莫兰不会创建账号或收集你输入的个人信息。你可以阅读以下文件，或重新选择。')}
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <Link className="inline-flex min-h-11 items-center text-primary underline underline-offset-4" to="/privacy">
                {t('阅读隐私政策')}
              </Link>
              <Link className="inline-flex min-h-11 items-center text-primary underline underline-offset-4" to="/terms">
                {t('阅读用户协议')}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setDeclined(false)}
              className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {t('重新选择')}
            </button>
          </>
        ) : (
          <>
            <p id="privacy-consent-summary" className="mt-2 text-sm leading-6 text-muted-foreground">
              {t('欢迎使用莫兰。在你主动同意前，我们不会收集你输入的手机号，也不会创建账号。')}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-xs leading-5 text-muted-foreground">
              <li>
                {cloudAccountsEnabled
                  ? t('手机号用于账号登录；账号与学习进度可能同步到莫兰云端。')
                  : t('手机号仅用于本机账号标识；公开商店版不会上传账号或学习数据。')}
              </li>
              <li>{t('学习记录、错题和设置保存在当前设备，可在设置中删除。')}</li>
              <li>{t('联网播放发音时，第三方服务会收到完成请求所需的网络信息。')}</li>
              <li>{t('作文与翻译反馈由设备本地规则生成，不会上传到外部服务。')}</li>
            </ul>

            <label className="mt-5 flex cursor-pointer items-start gap-2 text-sm leading-6 text-muted-foreground">
              <input
                ref={checkboxRef}
                type="checkbox"
                checked={checked}
                onChange={(event) => {
                  setChecked(event.target.checked);
                  if (event.target.checked) setCheckNotice(false);
                }}
                className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-primary"
              />
              <span>
                {t('我已阅读并同意')}
                <Link className="inline-flex min-h-11 items-center text-primary underline underline-offset-4" to="/terms">
                  {t('《用户协议》')}
                </Link>
                {t('与')}
                <Link className="inline-flex min-h-11 items-center text-primary underline underline-offset-4" to="/privacy">
                  {t('《隐私政策》')}
                </Link>
              </span>
            </label>
            {checkNotice && (
              <p role="alert" className="mt-2 text-xs leading-5 text-destructive">
                {t('请先阅读并勾选同意《用户协议》和《隐私政策》')}
              </p>
            )}

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={agree}
                className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {t('同意并继续')}
              </button>
              <button
                type="button"
                onClick={() => setDeclined(true)}
                className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                {t('不同意')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
