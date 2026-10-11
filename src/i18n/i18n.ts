import { createContext, use } from 'react';
import type { Locale } from '../types';
import { en, type Messages } from './en';
import { es } from './es';

export const MESSAGES: Record<Locale, Messages> = { en, es };
export const LOCALES = Object.keys(MESSAGES) as Locale[];

const STORAGE_KEY = 'locale';

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as string[]).includes(value);

/** The saved choice, else the device language, else English. */
export function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // Storage may be blocked; fall back to the device language.
  }
  const device = navigator.language.slice(0, 2);
  return isLocale(device) ? device : 'en';
}

export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Not critical: the device language is used next time.
  }
}

interface I18n {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => void;
}

export const I18nContext = createContext<I18n>({ locale: 'en', t: en, setLocale: () => undefined });

export const useI18n = (): I18n => use(I18nContext);
