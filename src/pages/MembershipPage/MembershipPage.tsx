import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  LoaderCircle,
  LogIn,
  QrCode,
  RefreshCw,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n-context';
import { useSettings } from '@/context/settings-context';
import { usePaymentStatus } from '@/context/payment-status-context';
import {
  createPaymentOrder,
  fetchPlans,
  paymentApiEnabled,
  type PaymentPlan,
} from '@/lib/payment-api';
import { getSafePaymentQr } from '@/lib/payment-qr';
import { cn } from '@/lib/utils';

const TOKEN_KEY = 'moran_token';

function planDescription(plan: PaymentPlan, t: (text: string) => string): string {
  return plan.type === 'duration'
    ? t('有效期 {n} 天').replace('{n}', String(plan.days))
    : t('包含 {n} 次').replace('{n}', String(plan.times));
}

export default function MembershipPage() {
  const { t } = useI18n();
  const { logout } = useSettings();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);
  const [hasCloudToken, setHasCloudToken] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));
  const [payPhase, setPayPhase] = useState<'idle' | 'paying' | 'done'>('idle');
  const [qrVisible, setQrVisible] = useState(false);
  const {
    pending,
    status,
    checking,
    beginPayment,
    cancelPayment,
    checkPayment,
  } = usePaymentStatus();
  const order = pending?.order ?? null;
  const orderStatus = status ?? order?.status ?? 'pending';
  const paymentQr = getSafePaymentQr(order);

  useEffect(() => {
    if (!order) {
      setQrVisible(false);
      return;
    }
    if (orderStatus === 'credited') {
      setQrVisible(false);
      setPayPhase('done');
      return;
    }
    if (paymentQr) {
      setQrVisible(true);
      setPayPhase((phase) => (phase === 'idle' ? 'paying' : phase));
    }
  }, [order?.orderNo, orderStatus, paymentQr]);

  useEffect(() => {
    const sync = () => setHasCloudToken(Boolean(localStorage.getItem(TOKEN_KEY)));
    sync();
    window.addEventListener('moran:auth-changed', sync);
    return () => window.removeEventListener('moran:auth-changed', sync);
  }, []);

  useEffect(() => {
    let active = true;
    fetchPlans()
      .then((next) => {
        if (active) setPlans(next);
      })
      .catch((error: Error) => {
        if (active) toast.error(t(error.message));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  const loginCloud = () => {
    logout();
    navigate('/login', { state: { from: '/membership' } });
  };

  const buy = async (plan: PaymentPlan) => {
    if (!hasCloudToken) {
      toast.message(t('购买前请先登录云端账号'));
      return;
    }
    setBuying(plan.id);
    try {
      const next = await createPaymentOrder(plan.id);
      beginPayment(next);
      const canScan = Boolean(getSafePaymentQr(next));
      setQrVisible(canScan);
      setPayPhase(canScan ? 'paying' : 'idle');
    } catch (error) {
      toast.error(t(error instanceof Error ? error.message : '创建订单失败'));
    } finally {
      setBuying(null);
    }
  };

  const copyOrder = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.orderNo);
      toast.success(t('订单号已复制'));
    } catch {
      toast.message(order.orderNo);
    }
  };

  const openPayment = async () => {
    if (!order) return;
    if (orderStatus === 'credited') return;
    if (paymentQr) {
      setQrVisible(true);
      setPayPhase('paying');
      return;
    }
    await copyOrder();
    toast.message(t('当前未配置固定金额订单二维码，已复制订单号，请联系管理员'));
  };

  const cancelOrder = () => {
    cancelPayment();
    setQrVisible(false);
    setPayPhase('idle');
    toast.message(t('已取消支付'));
  };

  const checkOrderNow = async () => {
    if (!order) return;
    try {
      const latest = await checkPayment();
      if (latest === 'pending' || latest === 'paid') {
        toast.message(t('订单仍在等待确认'));
      }
    } catch (error) {
      toast.error(t(error instanceof Error ? error.message : '无法检查订单'));
    }
  };

  const statusText = {
    pending: t('等待付款'),
    paid: t('已付款，等待确认'),
    credited: t('已到账，套餐已开通'),
    exception: t('订单异常'),
    refunded: t('已退款'),
  }[orderStatus];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 pb-8 pt-7">
      <header>
        <Link
          to="/settings"
          className="mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('返回设置')}
        </Link>
        <h1 className="screen-title flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          {t('会员套餐')}
        </h1>
        <p className="screen-lead mt-2">
          {t('选择套餐并确认订单，支付完成后自动到账并充值额度。')}
        </p>
      </header>

      {!paymentApiEnabled && (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/6 p-4 text-sm text-destructive">
          {t('当前构建未启用云端账号和支付服务')}
        </div>
      )}

      {!hasCloudToken && (
        <Card className="app-glass app-glass-strong">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">{t('需要登录云端账号')}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t('订单和套餐需要绑定到云端账号，请重新登录一次。')}
              </p>
            </div>
            <Button onClick={loginCloud}>
              <LogIn className="h-4 w-4" />
              {t('登录云端账号')}
            </Button>
          </CardContent>
        </Card>
      )}

      {order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a25]/36 p-4 backdrop-blur-sm">
          <div className="popup-enter max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-white/80 bg-[#f7fcfa]/98 p-5 shadow-[0_28px_90px_rgba(12,45,39,0.28)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{t('确认支付')}</h2>
              </div>
              <button
                type="button"
                onClick={cancelOrder}
                aria-label={t('取消支付并关闭')}
                className="grid size-11 place-items-center rounded-full bg-white/70 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-white/55 p-1.5 text-center text-[10px] font-medium text-muted-foreground">
              <span className="rounded-xl bg-primary text-primary-foreground">{t('确认订单')}</span>
              <span className={cn('rounded-xl py-2', orderStatus !== 'pending' && 'bg-primary/10 text-primary')}>{t('完成支付')}</span>
              <span className={cn('rounded-xl py-2', orderStatus === 'credited' && 'bg-success/12 text-success')}>{t('额度到账')}</span>
            </div>

            <div className="mt-4 rounded-2xl border border-white/80 bg-white/64 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{order.planName || t('莫兰学习套餐')}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{statusText}</p>
                </div>
                <p className="text-2xl font-semibold tabular-nums">¥{order.amount.toFixed(2)}</p>
              </div>
              <button
                type="button"
                onClick={() => void copyOrder()}
                className="mt-4 flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-white/55 px-3 text-left"
              >
                <span className="min-w-0">
                  <span className="block text-[10px] text-muted-foreground">{t('订单号')}</span>
                  <span className="mt-0.5 block truncate font-mono text-xs">{order.orderNo}</span>
                </span>
                <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </div>

            {orderStatus === 'credited' && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-success/8 p-4 text-sm text-success">
                <CheckCircle2 className="h-5 w-5" />
                {t('付款已确认，额度已充值到您的账户')}
              </div>
            )}
            {orderStatus !== 'credited' && (
              <>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {paymentQr
                    ? t('订单二维码已生成。扫码后金额固定为套餐金额，无需输入或修改金额。')
                    : t('当前支付渠道未配置固定金额订单二维码。为避免展示个人收款码，应用不会生成静态收款二维码；请联系管理员配置支付渠道。')}
                </p>
              </>
            )}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void openPayment()}
                disabled={orderStatus === 'credited' || (payPhase !== 'idle' && Boolean(paymentQr))}
                className="inline-flex min-h-12 w-full min-w-[170px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors disabled:cursor-default disabled:opacity-100"
              >
                {payPhase === 'done' || orderStatus === 'credited' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {t('已完成')}
                  </>
                ) : payPhase === 'paying' && paymentQr ? (
                  <>
                    <QrCode className="h-4 w-4" />
                    {t('等待扫码')}
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4" />
                    {paymentQr ? t('显示支付二维码') : t('复制订单号')}
                  </>
                )}
              </button>
              {orderStatus !== 'credited' && (
                  <button
                    type="button"
                    onClick={() => void checkOrderNow()}
                    disabled={checking}
                    aria-busy={checking}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white/60 px-4 text-sm font-medium disabled:cursor-wait disabled:opacity-65"
                  >
                    {checking ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    {checking ? t('正在检查支付状态…') : t('检测到账')}
                  </button>
              )}
            </div>
            {qrVisible && paymentQr && orderStatus !== 'credited' && (
              <div className="mt-4 rounded-2xl border border-primary/15 bg-white/72 p-4 text-center">
                <p className="text-sm font-semibold">{t('订单支付二维码')}</p>
                <div className="mx-auto mt-3 w-fit rounded-2xl border border-border bg-white p-3 shadow-sm">
                  <QRCodeSVG
                    value={paymentQr}
                    size={172}
                    level="M"
                    marginSize={2}
                    role="img"
                    aria-label={t('订单支付二维码')}
                  />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{order.planName}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                  ¥{order.amount.toFixed(2)}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {t('金额已锁定为 ¥{amount}，请勿修改；到账后会自动充值额度。', {
                    amount: order.amount.toFixed(2),
                  })}
                </p>
              </div>
            )}
            {orderStatus !== 'credited' && (
              <>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {t('应用会自动轮询订单状态，无需重复付款')}
                </p>
                <button
                  type="button"
                  onClick={cancelOrder}
                  className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl text-xs font-semibold text-destructive transition-colors hover:bg-destructive/6"
                >
                  {t('取消支付')}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {!order && (
        <section className="grid gap-3 sm:grid-cols-2">
          {loading ? (
            <Card className="sm:col-span-2">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                {t('正在加载套餐…')}
              </CardContent>
            </Card>
          ) : plans.length === 0 ? (
            <Card className="sm:col-span-2">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                {t('管理员还没有配置套餐')}
              </CardContent>
            </Card>
          ) : plans.map((plan) => (
            <Card key={plan.id} className="app-glass">
              <CardContent className="flex h-full flex-col p-5">
                <p className="text-base font-semibold">{plan.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{planDescription(plan, t)}</p>
                <p className="mt-5 text-3xl font-semibold tabular-nums">
                  ¥{Number(plan.price).toFixed(2)}
                </p>
                <Button
                  className="mt-5 w-full disabled:pointer-events-auto disabled:cursor-not-allowed disabled:border disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
                  disabled={buying === plan.id || !hasCloudToken}
                  onClick={() => void buy(plan)}
                >
                  {buying === plan.id
                    ? t('正在创建订单…')
                    : hasCloudToken
                      ? t('购买')
                      : t('登录后可购买')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <p className="text-center text-xs leading-5 text-muted-foreground">
        {t('支付完成后应用会自动检测到账并充值会员额度。')}
      </p>
    </div>
  );
}
