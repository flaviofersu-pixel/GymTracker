import { MIN_PROTEIN_DAY_G, type ExerciseId } from '../data/plan';
import type { DateKey, Meal, WeightEntry, Workout } from '../types';
import { addDays } from './dates';
import { dayTotals } from './nutrition';
import { improvedExercises } from './progression';
import { weeklyChange } from './weight';

export type CheckState = 'done' | 'missed' | 'no-data';

export interface WeeklyReview {
  weight: { state: CheckState; delta: number | null };
  sessions: { state: CheckState; count: number };
  progression: { state: CheckState; improved: ExerciseId[] };
  protein: { state: CheckState; hitDays: number; loggedDays: number };
}

/** The plan's weekly self-check, computed from the last 7 days of logs. */
export function weeklyReview(
  today: DateKey,
  data: { weights: readonly WeightEntry[]; workouts: readonly Workout[]; meals: readonly Meal[] },
): WeeklyReview {
  const from = addDays(today, -6);
  const { delta } = weeklyChange(data.weights, today);
  const sessions = data.workouts.filter((w) => w.date >= from).length;
  const improved = improvedExercises(data.workouts, from);

  let loggedDays = 0;
  let hitDays = 0;
  for (let i = 0; i < 7; i++) {
    const totals = dayTotals(data.meals, addDays(today, -i));
    if (totals.kcal > 0) {
      loggedDays++;
      if (totals.proteinG >= MIN_PROTEIN_DAY_G) hitDays++;
    }
  }

  return {
    weight: {
      state: delta === null ? 'no-data' : delta >= 0.15 && delta <= 0.5 ? 'done' : 'missed',
      delta,
    },
    sessions: { state: sessions >= 3 ? 'done' : 'missed', count: sessions },
    progression: {
      state: sessions === 0 ? 'no-data' : improved.length > 0 ? 'done' : 'missed',
      improved,
    },
    protein: {
      state: loggedDays === 0 ? 'no-data' : hitDays * 2 > loggedDays ? 'done' : 'missed',
      hitDays,
      loggedDays,
    },
  };
}
