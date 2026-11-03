import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, LoaderCircle, X, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '@/context/i18n-context';
import {
  PaymentStatusContext,
  type PaymentResult,
  type TrackedPayment,
} from '@/context/payment-status-context';
import { fetchPaymentOrder, type PaymentOrder } from '@/lib/payment-api';
import { paymentsEnabled } from '@/lib/feature-flags';
import '@/interactions-payment.css';

const STORAGE_KEY = 'moran_pending_payment_v1';
const TOKEN_KEY = 'moran_token';
const POLL_INTERVAL = 5000;

function readStoredPayment(): TrackedPayment | null {
  if (!paymentsEnabled) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TrackedPayment>;
    if (!parsed?.order?.orderNo || typeof parsed.order.amount !== 'number') {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      order: {
        ...parsed.order,
        status: parsed.order.status || 'pending',
      } as PaymentOrder,
      startedAt: Number(parsed.startedAt) || Date.now(),
    };
  } catch {
    return null;
  }
}

function persistPayment(payment: TrackedPayment | null) {
  try {
    if (payment) localStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private modes.
  }
}

export default function PaymentStatusProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [pending, setPending] = useState<TrackedPayment | null>(readStoredPayment);
  const [status, setStatus] = useState<PaymentOrder['status'] | null>(() => readStoredPayment()?.order.status ?? null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const pendingRef = useRef(pending);
  const checkingRef = useRef(false);
  const resultTimerRef = useRef<number | null>(null);

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  const clearResultTimer = useCallback(() => {
    if (resultTimerRef.current) window.clearTimeout(resultTimerRef.current);
    resultTimerRef.current = null;
  }, []);

  const dismissResult = useCallback(() => {
    clearResultTimer();
    setResult(null);
  }, [clearResultTimer]);

  const cancelPayment = useCallback(() => {
    pendingRef.current = null;
    clearResultTimer();
    setPending(null);
    setStatus(null);
    setResult(null);
    persistPayment(null);
  }, [clearResultTimer]);

  const beginPayment = useCallback((order: PaymentOrder) => {
    clearResultTimer();
    const next = { order, startedAt: Date.now() };
    pendingRef.current = next;
    setPending(next);
    setStatus(order.status);
    setResult(null);
    persistPayment(next);
  }, [clearResultTimer]);

  const checkPayment = useCallback(async (): Promise<PaymentOrder['status'] | null> => {
    const current = pendingRef.current;
    if (!current || checkingRef.current || !localStorage.getItem(TOKEN_KEY)) return null;
    checkingRef.current = true;
    setChecking(true);
    try {
      const latest = await fetchPaymentOrder(current.order.orderNo);
      if (pendingRef.current?.order.orderNo !== current.order.orderNo) return null;
      setStatus(latest.status);

      if (latest.status === 'credited') {
        pendingRef.current = null;
        setResult({
          kind: 'success',
          order: { ...current.order, status: 'credited' },
        });
        setPending(null);
        persistPayment(null);
        window.dispatchEvent(new Event('moran:quota-changed'));
        clearResultTimer();
        resultTimerRef.current = window.setTimeout(() => setResult(null), 4200);
      } else if (latest.status === 'exception' || latest.status === 'refunded') {
        pendingRef.current = null;
        setResult({
          kind: 'failed',
          order: current.order,
          reason: latest.exceptionReason || (latest.status === 'refunded' ? t('订单已退款') : t('支付未完成')),
        });
        setPending(null);
        persistPayment(null);
      }
      return latest.status;
    } catch {
      // A network hiccup is not a payment failure; keep the pending order and retry.
      return null;
    } finally {
      checkingRef.current = false;
      setChecking(false);
    }
  }, [clearResultTimer, t]);

  useEffect(() => {
    if (!pending) return;
    const checkWhenActive = () => {
      if (document.visibilityState === 'visible') void checkPayment();
    };
    checkWhenActive();
    const timer = window.setInterval(checkWhenActive, POLL_INTERVAL);
    const onFocus = () => checkWhenActive();
    const onVisibility = () => checkWhenActive();
    const onPageShow = () => checkWhenActive();
    const onOnline = () => checkWhenActive();
    window.addEventListener('focus', onFocus);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('online', onOnline);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [checkPayment, pending]);

  useEffect(() => {
    if (pendingRef.current) void checkPayment();
  }, [checkPayment, location.pathname]);

  useEffect(() => {
    const syncAuth = () => {
      if (!localStorage.getItem(TOKEN_KEY)) {
        if (pendingRef.current) cancelPayment();
        return;
      }
      if (pendingRef.current) void checkPayment();
    };
    window.addEventListener('moran:auth-changed', syncAuth);
    return () => window.removeEventListener('moran:auth-changed', syncAuth);
  }, [cancelPayment, checkPayment]);

  useEffect(() => {
    if (!result) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissResult();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dismissResult, result]);

  useEffect(() => () => {
    if (resultTimerRef.current) window.clearTimeout(resultTimerRef.current);
  }, []);

  const onMembershipPage = location.pathname === '/membership';

  return (
    <PaymentStatusContext.Provider
      value={{ pending, status, checking, result, beginPayment, cancelPayment, checkPayment, dismissResult }}
    >
      {children}
      {paymentsEnabled && pending && !onMembershipPage && createPortal(
        <div className="payment-tracker" role="status" aria-live="polite">
          <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{t('等待支付')}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {pending.order.planName} · ¥{pending.order.amount.toFixed(2)}
            </p>
          </div>
          <button type="button" onClick={() => navigate('/membership')} className="payment-tracker-link">
            {t('查看')}
          </button>
          <button type="button" onClick={cancelPayment} className="payment-tracker-cancel">
            {t('取消支付')}
          </button>
        </div>,
        document.body,
      )}
      {paymentsEnabled && result && createPortal(
        <div className="payment-result-scrim" role="dialog" aria-modal="true" aria-labelledby="payment-result-title">
          <div className={cnPaymentResult(result.kind)}>
            <button
              type="button"
              onClick={dismissResult}
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-white/60"
              aria-label={t('关闭')}
            >
              <X className="h-4 w-4" />
            </button>
            <span className={result.kind === 'success' ? 'payment-result-icon is-success' : 'payment-result-icon is-failed'}>
              {result.kind === 'success' ? <CheckCircle2 className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
            </span>
            <h2 id="payment-result-title" className="mt-4 text-xl font-semibold">
              {result.kind === 'success' ? t('支付成功') : t('支付失败')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.kind === 'success'
                ? t('额度已充值到您的账户中')
                : result.reason || t('支付未完成，请重试')}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {result.order.planName} · ¥{result.order.amount.toFixed(2)}
            </p>
            <button type="button" onClick={dismissResult} className="mt-5 min-h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
              {result.kind === 'success' ? t('完成') : t('关闭')}
            </button>
          </div>
        </div>,
        document.body,
      )}
    </PaymentStatusContext.Provider>
  );
}

function cnPaymentResult(kind: PaymentResult['kind']): string {
  return kind === 'success' ? 'payment-result-card is-success' : 'payment-result-card is-failed';
}
