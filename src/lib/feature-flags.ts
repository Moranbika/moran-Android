// 商店构建暂时关闭会员与支付入口；相关页面和支付代码保留，后续版本可重新开启。
export const paymentsEnabled = !__MORAN_WEB_TEST__
  && import.meta.env.VITE_PAYMENTS_ENABLED !== 'false';
