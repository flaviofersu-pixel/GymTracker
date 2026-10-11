import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '../types';
import { I18nContext, MESSAGES, detectLocale, storeLocale } from './i18n';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    storeLocale(locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, t: MESSAGES[locale], setLocale }), [locale]);
  return <I18nContext value={value}>{children}</I18nContext>;
}
