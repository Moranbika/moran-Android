import { Link } from "react-router-dom";
import { useI18n } from '@/context/i18n-context';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-background/86 backdrop-blur-[2px]" aria-hidden="true" />
      <section className="app-glass app-glass-strong relative w-full max-w-md rounded-[28px] border border-white/70 px-8 py-10 text-center shadow-none">
        <h1 className="text-5xl font-semibold tracking-[-0.04em] text-foreground">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t('页面不存在')}</p>
        <Link
          to="/"
          className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
        >
          {t('返回首页')}
        </Link>
      </section>
    </main>
  );
}
