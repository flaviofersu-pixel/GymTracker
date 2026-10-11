import { TARGET_WEEKLY_GAIN } from '../data/plan';
import type { DateKey, WeightEntry } from '../types';
import { addDays } from './dates';

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

export type Pace = 'unknown' | 'slow' | 'on-track' | 'fast';

/**
 * Classifies a weekly change against the plan's +0.2 to +0.3 kg target.
 * The bounds are a little wider than the target so normal day-to-day noise
 * does not flip the status every week.
 */
export function classifyPace(delta: number | null): Pace {
  if (delta === null) return 'unknown';
  if (delta < TARGET_WEEKLY_GAIN.min - 0.1) return 'slow';
  if (delta > 0.5) return 'fast';
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
