import { describe, expect, it } from 'vitest';
import type { Meal } from '../types';
import { dayTotals, remaining } from './nutrition';
import { weeklyReview } from './weekly';

const meal = (date: string, kcal: number, proteinG: number): Meal => ({
  date,
  kcal,
  proteinG,
  loggedAt: 0,
  name: 'Test',
  details: '',
  source: 'manual',
});

const settings = {
  goal: 'gain',
  startWeightKg: 62,
  trainingDays: 3,
  proteinTarget: 125,
} as const;

describe('nutrition', () => {
  it('adds up one day only', () => {
    const meals = [
      meal('2026-10-14', 800, 40),
      meal('2026-10-14', 450, 22),
      meal('2026-10-13', 999, 99),
    ];
    expect(dayTotals(meals, '2026-10-14')).toEqual({ kcal: 1250, proteinG: 62 });
  });

  it('reports what is left, never negative protein', () => {
    const left = remaining({ kcal: 2900, proteinG: 150 }, { kcalTarget: 2750, proteinTarget: 130 });
    expect(left.kcal).toBe(-150);
    expect(left.proteinG).toBe(0);
  });
});

describe('weeklyReview', () => {
  it('reports missing data instead of failing checks', () => {
    const review = weeklyReview('2026-10-14', settings, { weights: [], workouts: [], meals: [] });
    expect(review.weight.state).toBe('no-data');
    expect(review.protein.state).toBe('no-data');
    expect(review.sessions).toEqual({ state: 'missed', count: 0 });
  });

  it('passes protein when most logged days get close to the target', () => {
    const meals = [
      meal('2026-10-14', 2700, 130),
      meal('2026-10-13', 2600, 115),
      meal('2026-10-12', 2500, 90),
    ];
    const review = weeklyReview('2026-10-14', settings, { weights: [], workouts: [], meals });
    expect(review.protein).toEqual({ state: 'done', hitDays: 2, loggedDays: 3 });
  });
});
