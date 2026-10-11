import type { DateKey, WeightEntry } from '../types';
import { addDays } from './dates';
import type { PaceRange } from './targets';

export function averageBetween(
  entries: readonly WeightEntry[],
  from: DateKey,
  to: DateKey,
): number | null {
  const inRange = entries.filter((e) => e.date >= from && e.date <= to);
  if (inRange.length === 0) return null;
  return inRange.reduce((sum, e) => sum + e.kg, 0) / inRange.length;
}

export interface WeeklyChange {
  /** Mean of the last 7 days, including today. */
  current: number | null;
  /** Mean of the 7 days before that. */
  previous: number | null;
  delta: number | null;
}

export function weeklyChange(entries: readonly WeightEntry[], today: DateKey): WeeklyChange {
  const current = averageBetween(entries, addDays(today, -6), today);
  const previous = averageBetween(entries, addDays(today, -13), addDays(today, -7));
  const delta = current !== null && previous !== null ? current - previous : null;
  return { current, previous, delta };
}

export type Pace = 'unknown' | 'below' | 'on-track' | 'above';

/** Day-to-day noise allowed outside the target range before the pace is flagged. */
const PACE_TOLERANCE_KG = 0.1;

/** Classifies a weekly change against the target range for the person's goal. */
export function classifyPace(delta: number | null, range: PaceRange): Pace {
  if (delta === null) return 'unknown';
  if (delta < range.min - PACE_TOLERANCE_KG) return 'below';
  if (delta > range.max + PACE_TOLERANCE_KG) return 'above';
  return 'on-track';
}

export interface TrendPoint {
  date: DateKey;
  kg: number;
  /** Rolling mean of the 7 days ending on this date. */
  average: number;
}

export function trend(entries: readonly WeightEntry[], from: DateKey): TrendPoint[] {
  return [...entries]
    .filter((e) => e.date >= from)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      date: e.date,
      kg: e.kg,
      average: averageBetween(entries, addDays(e.date, -6), e.date) ?? e.kg,
    }));
}
