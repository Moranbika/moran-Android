import { createContext, useContext } from 'react';
import type { PaymentOrder } from '@/lib/payment-api';

export interface TrackedPayment {
  order: PaymentOrder;
  startedAt: number;
}

export interface PaymentResult {
  kind: 'success' | 'failed';
  order: PaymentOrder;
  reason?: string;
}

export interface PaymentStatusContextValue {
  pending: TrackedPayment | null;
  status: PaymentOrder['status'] | null;
  checking: boolean;
  result: PaymentResult | null;
  beginPayment: (order: PaymentOrder) => void;
  cancelPayment: () => void;
  checkPayment: () => Promise<PaymentOrder['status'] | null>;
  dismissResult: () => void;
}

export const PaymentStatusContext = createContext<PaymentStatusContextValue | null>(null);

export function usePaymentStatus(): PaymentStatusContextValue {
  const context = useContext(PaymentStatusContext);
  if (!context) throw new Error('usePaymentStatus must be used within PaymentStatusProvider');
  return context;
}
