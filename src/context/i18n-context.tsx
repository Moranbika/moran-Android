import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { LanguagePreference } from '@/context/settings-context';
import { useSettings } from '@/context/settings-context';
import {
  localeFor,
  resolveLanguage,
  translate,
  type ResolvedLanguage,
} from '@/lib/i18n';

type I18nValue = {
  language: ResolvedLanguage;
  locale: string;
  preference: LanguagePreference;
  t: (source: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

function currentSystemLanguage(): string {
  if (typeof navigator === 'undefined') return 'zh-CN';
  return navigator.language || '';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [systemLanguage, setSystemLanguage] = useState(currentSystemLanguage);

  useEffect(() => {
    const update = () => setSystemLanguage(currentSystemLanguage());
    window.addEventListener('languagechange', update);
    return () => window.removeEventListener('languagechange', update);
  }, []);

  const language = resolveLanguage(settings.language, systemLanguage);
  const locale = localeFor(language);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.language = language;
  }, [language, locale]);

  const t = useCallback(
    (source: string, vars?: Record<string, string | number>) => translate(language, source, vars),
    [language],
  );

  const value = useMemo<I18nValue>(
    () => ({ language, locale, preference: settings.language, t }),
    [language, locale, settings.language, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
