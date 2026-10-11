import type { DateKey } from '../types';

const pad = (n: number): string => String(n).padStart(2, '0');

export function toDateKey(date: Date = new Date()): DateKey {
  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses a date key at local noon, so daylight-saving shifts never change the day. */
export function fromDateKey(key: DateKey): Date {
  return new Date(`${key}T12:00:00`);
}

export function addDays(key: DateKey, days: number): DateKey {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function daysBetween(from: DateKey, to: DateKey): number {
  return Math.round((fromDateKey(to).getTime() - fromDateKey(from).getTime()) / 86_400_000);
}

/** @param locale A BCP 47 tag such as `en-GB` or `es-ES`. */
export function formatDay(key: DateKey, locale: string): string {
  return fromDateKey(key).toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatShortDate(key: DateKey, locale: string): string {
  return fromDateKey(key).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}
