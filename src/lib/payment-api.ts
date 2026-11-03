const API_BASE = __MORAN_API_BASE__;

export const paymentApiEnabled = Boolean(API_BASE);

export interface PaymentPlan {
  id: number;
  name: string;
  type: 'times' | 'duration';
  times: number;
  days: number;
  price: number;
  sort_order: number;
}

export interface PaymentOrder {
  ok: true;
  orderNo: string;
  planName: string;
  amount: number;
  status: 'pending' | 'paid' | 'credited' | 'exception' | 'refunded';
  channel: string;
  payUrl: string | null;
  qrCode?: string | null;
  provider: string;
  manualOnly: boolean;
}

export interface UserQuota {
  activePlans: number;
  timesLeft: number;
  timesTotal: number;
  timesUsed: number;
  expiresAt: number;
}

function token(): string {
  return localStorage.getItem('moran_token') || '';
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      (payload as { msg?: string }).msg || `请求失败 ${response.status}`,
    );
  }
  return payload as T;
}

export async function fetchPlans(): Promise<PaymentPlan[]> {
  if (!API_BASE) return [];
  const response = await fetch(`${API_BASE}/api/plans`, {
    headers: { Accept: 'application/json' },
  });
  const payload = await readJson<{ ok: boolean; plans: PaymentPlan[] }>(response);
  return payload.plans ?? [];
}

export async function createPaymentOrder(planId: number): Promise<PaymentOrder> {
  const auth = token();
  if (!API_BASE || !auth) throw new Error('请先登录云端账号');
  const response = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth}`,
    },
    body: JSON.stringify({ planId, channel: 'alipay' }),
  });
  return readJson<PaymentOrder>(response);
}

export async function fetchPaymentOrder(orderNo: string) {
  const auth = token();
  if (!API_BASE || !auth) throw new Error('请先登录云端账号');
  const response = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderNo)}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${auth}`,
    },
  });
  return readJson<{
    ok: true;
    orderNo: string;
    planName: string;
    amount: number;
    status: PaymentOrder['status'];
    paidAt: number;
    creditedAt: number;
    exceptionReason: string;
  }>(response);
}

export async function fetchQuota(): Promise<UserQuota> {
  const auth = token();
  if (!API_BASE || !auth) throw new Error('请先登录云端账号');
  const response = await fetch(`${API_BASE}/api/me/quota`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${auth}`,
    },
  });
  const payload = await readJson<Partial<UserQuota>>(response);
  const timesLeft = Number(payload.timesLeft || 0);
  const timesTotal = Number(payload.timesTotal || timesLeft || 0);
  return {
    activePlans: Number(payload.activePlans || 0),
    timesLeft,
    timesTotal,
    timesUsed: Number(payload.timesUsed ?? Math.max(0, timesTotal - timesLeft)),
    expiresAt: Number(payload.expiresAt || 0),
  };
}
