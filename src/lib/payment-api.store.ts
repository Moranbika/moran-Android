export const paymentApiEnabled = false;

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

export async function fetchPlans(): Promise<PaymentPlan[]> {
  return [];
}

export async function createPaymentOrder(): Promise<PaymentOrder> {
  throw new Error('Unavailable');
}

export async function fetchPaymentOrder(): Promise<never> {
  throw new Error('Unavailable');
}

export async function fetchQuota(): Promise<UserQuota> {
  throw new Error('Unavailable');
}
