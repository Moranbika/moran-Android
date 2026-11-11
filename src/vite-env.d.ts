/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MIAODA_CLIENT_BASE_PATH: string;
  readonly VITE_PUBLIC_STORE?: string;
  readonly VITE_PAYMENTS_ENABLED?: string;
}

declare const __MORAN_API_BASE__: string;
declare const __MORAN_CONTENT_API_BASE__: string;
declare const __MORAN_WEB_TEST__: boolean;
declare const __MORAN_HASH_ROUTER__: boolean;
