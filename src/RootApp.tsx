import { useCallback, useState } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { DeviceGate } from '@/components/DeviceGate/DeviceGate';
import ContentProvider from '@/components/ContentProvider';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Toaster } from '@/components/ui/sonner';
import LaunchSplash from '@/components/LaunchSplash';
import App from './app';

export function RootApp() {
  const [showLaunch, setShowLaunch] = useState(true);
  const finishLaunch = useCallback(() => setShowLaunch(false), []);
  const isHarmony = typeof window !== 'undefined'
    && Boolean((window as Window & { MoranHarmony?: unknown }).MoranHarmony);
  const content = (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DeviceGate>
          <ContentProvider>
            <App />
          </ContentProvider>
        </DeviceGate>
        <Toaster richColors closeButton />
      </ErrorBoundary>
      {showLaunch && <LaunchSplash onComplete={finishLaunch} />}
    </>
  );

  return isHarmony || __MORAN_HASH_ROUTER__ ? (
    <HashRouter>{content}</HashRouter>
  ) : (
    <BrowserRouter basename={import.meta.env.MIAODA_CLIENT_BASE_PATH || '/'}>
      {content}
    </BrowserRouter>
  );
}
