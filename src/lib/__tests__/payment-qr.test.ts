import { describe, expect, it } from 'vitest';
import { getSafePaymentQr } from '../payment-qr';
import type { PaymentOrder } from '../payment-api';

function order(overrides: Partial<PaymentOrder>): PaymentOrder {
  return {
    ok: true,
    orderNo: 'MR1',
    planName: '测试套餐',
    amount: 9.9,
    status: 'pending',
    channel: 'alipay',
    payUrl: null,
    qrCode: null,
    provider: 'epay',
    manualOnly: false,
    ...overrides,
  };
}

describe('getSafePaymentQr', () => {
  it('prefers a provider-issued QR payload', () => {
    expect(getSafePaymentQr(order({ qrCode: 'https://qr.alipay.com/example' })))
      .toBe('https://qr.alipay.com/example');
  });

  it('accepts a gateway order checkout URL', () => {
    expect(getSafePaymentQr(order({ payUrl: 'https://pay.example.com/submit.php?out_trade_no=MR1' })))
      .toContain('/submit.php');
  });

  it('rejects the retired personal QR provider', () => {
    expect(getSafePaymentQr(order({ provider: 'qr', payUrl: 'https://example.com/pay/qr/MR1' })))
      .toBeNull();
  });

  it('rejects personal Alipay QR routes and images', () => {
    expect(getSafePaymentQr(order({ payUrl: 'https://example.com/pay/qr/MR1' }))).toBeNull();
    expect(getSafePaymentQr(order({ payUrl: 'https://example.com/pay/alipay-qr.jpg' }))).toBeNull();
  });
});
