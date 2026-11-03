import { Capacitor, registerPlugin } from '@capacitor/core';
import { Copy, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
  buildMobileDeviceCode,
  checkMobileDeviceAuthorization,
  type NativeDevicePlatform,
} from '@/lib/mobile-device-auth';
import { isDeviceAuthorizationEnabled } from '@/lib/device-auth-policy';

interface MoranDevicePlugin {
  getId(): Promise<{ identifier: string }>;
}

const MoranDevice = registerPlugin<MoranDevicePlugin>('MoranDevice');

interface MoranHarmonyPlugin {
  getId(): string;
}

type GateState =
  | { phase: 'checking'; deviceCode: string; message: string }
  | { phase: 'denied'; deviceCode: string; message: string }
  | { phase: 'error'; deviceCode: string; message: string }
  | { phase: 'authorized'; deviceCode: string; message: string };

const APP_VERSION = '0.2.9';
const PUBLIC_STORE_BUILD = import.meta.env.VITE_PUBLIC_STORE === 'true';
const DEVICE_AUTH_ENABLED = isDeviceAuthorizationEnabled(
  import.meta.env.VITE_DEVICE_AUTH_ENABLED,
  PUBLIC_STORE_BUILD,
);

function nativePlatform(): NativeDevicePlatform | null {
  if (!DEVICE_AUTH_ENABLED) return null;
  const harmony = (window as Window & { MoranHarmony?: MoranHarmonyPlugin }).MoranHarmony;
  if (harmony?.getId) return 'harmony';
  if (!Capacitor.isNativePlatform()) return null;
  const platform = Capacitor.getPlatform();
  return platform === 'ios' ? 'ios' : null;
}

async function inspectDevice(platform: NativeDevicePlatform): Promise<GateState> {
  try {
    const identifier = platform === 'harmony'
      ? (window as Window & { MoranHarmony?: MoranHarmonyPlugin }).MoranHarmony?.getId()
      : (await MoranDevice.getId()).identifier;
    const deviceCode = await buildMobileDeviceCode(identifier || '');
    if (!deviceCode) {
      return {
        phase: 'error',
        deviceCode: '',
        message: '无法读取这台设备的标识，请联系管理员。',
      };
    }
    const result = await checkMobileDeviceAuthorization(deviceCode, APP_VERSION, platform);
    return {
      phase: result.authorized ? 'authorized' : 'denied',
      deviceCode,
      message: result.reason,
    };
  } catch {
    return {
      phase: 'error',
      deviceCode: '',
      message: '设备验证没有完成，请检查网络后重试。',
    };
  }
}

export function DeviceGate({ children }: { children: ReactNode }) {
  const platform = nativePlatform();
  const [state, setState] = useState<GateState>({
    phase: platform ? 'checking' : 'authorized',
    deviceCode: '',
    message: '',
  });
  const [copied, setCopied] = useState(false);

  const verify = useCallback(async () => {
    if (!platform) {
      setState({ phase: 'authorized', deviceCode: '', message: '' });
      return;
    }
    setCopied(false);
    setState({ phase: 'checking', deviceCode: '', message: '正在读取设备标识并连接授权服务器。' });
    setState(await inspectDevice(platform));
  }, [platform]);

  useEffect(() => {
    if (!platform) return;
    let active = true;
    void inspectDevice(platform).then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, [platform]);

  if (state.phase === 'authorized') return children;

  const copyDeviceCode = async () => {
    if (!state.deviceCode) return;
    try {
      await navigator.clipboard.writeText(state.deviceCode);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const checking = state.phase === 'checking';
  const title = checking
    ? '正在验证设备'
    : state.phase === 'error'
      ? '无法完成设备验证'
      : '设备授权未通过';

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#edf6f1] px-5 py-8 text-[#173e38]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,238,190,.72),transparent_30%),radial-gradient(circle_at_16%_78%,rgba(35,159,143,.22),transparent_38%),linear-gradient(135deg,#edf7f2_0%,#f7fbf6_44%,#dcefe7_100%)]" />
      <section className="relative w-full max-w-[520px] rounded-[30px] border border-white/80 bg-white/65 p-8 shadow-[0_24px_80px_rgba(35,95,84,.13)] backdrop-blur-3xl">
        <div className="grid size-14 place-items-center rounded-[18px] bg-primary text-primary-foreground shadow-lg shadow-[#183d37]/15">
          <ShieldCheck className="size-7" strokeWidth={1.8} />
        </div>
        <p className="mt-6 text-[11px] font-semibold tracking-[0.18em] text-primary">DEVICE AUTHORIZATION</p>
        <h1 className="mt-2 font-serif text-[30px] font-normal leading-tight">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-[#173e38]/65">{state.message}</p>

        <div className="mt-6 flex items-center gap-3 rounded-[18px] bg-white/55 p-4">
          {checking ? (
            <span className="size-6 shrink-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          ) : (
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-destructive text-xs font-bold text-white">!</span>
          )}
          <div>
            <strong className="block text-sm">{checking ? '请稍候' : state.phase === 'error' ? '验证服务未响应' : '当前设备未获授权'}</strong>
            <span className="mt-1 block text-xs text-[#173e38]/55">
              {checking ? '设备验证通常需要几秒钟' : state.phase === 'error' ? '请联网后重新验证' : '请联系管理员添加此设备码'}
            </span>
          </div>
        </div>

        {state.deviceCode ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#173e38]/20 bg-white/35 p-4">
            <span className="text-[11px] text-[#173e38]/45">本机设备码（发送给管理员时使用）</span>
            <code className="mt-1.5 block break-all font-mono text-[13px] font-semibold leading-6 tracking-[0.03em]">
              {state.deviceCode}
            </code>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[13px] font-medium text-white disabled:opacity-50"
            disabled={checking}
            onClick={() => void verify()}
          >
            <RefreshCw className={`size-4 ${checking ? 'animate-spin' : ''}`} />
            重新验证
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/60 px-5 text-[13px] font-medium text-[#173e38] disabled:opacity-45"
            disabled={!state.deviceCode}
            onClick={() => void copyDeviceCode()}
          >
            <Copy className="size-4" />
            {copied ? '已复制' : '复制设备码'}
          </button>
          <a
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/60 px-5 text-[13px] font-medium text-[#173e38]"
            href="mailto:2218145697@qq.com"
          >
            <Mail className="size-4" />
            联系管理员
          </a>
        </div>

        <p className="mt-5 text-[11px] leading-6 text-[#173e38]/40">
          莫兰只使用经过 SHA-256 处理的设备标识，不显示或上传原始设备序列号。验证服务必须联网可用，离线时不会绕过设备授权。
        </p>
      </section>
    </main>
  );
}
