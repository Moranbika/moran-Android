import type { PaymentOrder } from './payment-api';

export function getSafePaymentQr(order: PaymentOrder | null): string | null {
  if (!order) return null;
  if (order.provider === 'qr' || order.provider === 'none') return null;
  const qrCode = String(order.qrCode || '').trim();
  if (qrCode) return qrCode;
  const payUrl = String(order.payUrl || '').trim();
  if (!payUrl) return null;
  // Never render a static personal collection-code page as the purchase QR.
  if (/\/pay\/(?:qr\/|alipay-qr)|payment-qr/i.test(payUrl)) return null;
  return payUrl;
}
