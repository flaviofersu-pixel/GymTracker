import type { DateKey, Meal, Settings } from '../types';

export interface DayTotals {
  kcal: number;
  proteinG: number;
}

export function dayTotals(meals: readonly Meal[], date: DateKey): DayTotals {
  return meals
    .filter((m) => m.date === date)
    .reduce<DayTotals>(
      (acc, m) => ({ kcal: acc.kcal + m.kcal, proteinG: acc.proteinG + m.proteinG }),
      { kcal: 0, proteinG: 0 },
    );
}

export interface Remaining {
  kcal: number;
  proteinG: number;
  /** Share of the calorie target already eaten, from 0 upwards (can exceed 1). */
  kcalProgress: number;
  proteinProgress: number;
}

export function remaining(
  totals: DayTotals,
  settings: Pick<Settings, 'kcalTarget' | 'proteinTarget'>,
): Remaining {
  return {
    kcal: Math.round(settings.kcalTarget - totals.kcal),
    proteinG: Math.max(0, Math.round(settings.proteinTarget - totals.proteinG)),
    kcalProgress: totals.kcal / settings.kcalTarget,
    proteinProgress: totals.proteinG / settings.proteinTarget,
  };
}
