import { describe, expect, it } from 'vitest';
import type { WeightEntry } from '../types';
import { addDays } from './dates';
import { classifyPace, trend, weeklyChange } from './weight';

const TODAY = '2026-10-14';

/** One weigh-in per day for `days` days ending today, gaining `perWeek` kg per week. */
function series(days: number, start: number, perWeek: number): WeightEntry[] {
  return Array.from({ length: days }, (_, i) => ({
    date: addDays(TODAY, i - days + 1),
    kg: start + (perWeek / 7) * i,
  }));
}

describe('weeklyChange', () => {
  it('compares this week’s average with the previous week’s', () => {
    const { delta } = weeklyChange(series(14, 62, 0.28), TODAY);
    expect(delta).toBeCloseTo(0.28, 5);
  });

  it('has no delta without two weeks of data', () => {
    expect(weeklyChange(series(5, 62, 0.3), TODAY).delta).toBeNull();
  });
});

describe('classifyPace', () => {
  const gaining = { min: 0.15, max: 0.3 };

  it.each([
    [null, 'unknown'],
    [0, 'below'],
    [0.1, 'on-track'],
    [0.25, 'on-track'],
    [0.7, 'above'],
  ] as const)('classifies %s kg/week against a gain target as %s', (delta, pace) => {
    expect(classifyPace(delta, gaining)).toBe(pace);
  });

  it('flags a cut that stalls', () => {
    expect(classifyPace(0, { min: -0.8, max: -0.4 })).toBe('above');
  });
});

describe('trend', () => {
  it('returns points in date order with a rolling average', () => {
    const entries: WeightEntry[] = [
      { date: '2026-10-03', kg: 63 },
      { date: '2026-10-01', kg: 62 },
    ];
    expect(trend(entries, '2026-10-01')).toEqual([
      { date: '2026-10-01', kg: 62, average: 62 },
      { date: '2026-10-03', kg: 63, average: 62.5 },
    ]);
  });
});
