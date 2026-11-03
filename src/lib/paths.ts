// EXPORTS: BASE
// 应用根路径前缀：静态资源与站内资源一律用它拼接，避免发布后 404。

export const BASE = (import.meta.env.MIAODA_CLIENT_BASE_PATH || '').replace(/\/$/, '') + '/';
