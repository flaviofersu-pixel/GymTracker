import type { ExerciseId } from '../data/plan';
import type { DateKey, Meal, Settings, WeightEntry, Workout } from '../types';
import { addDays } from './dates';
import { dayTotals } from './nutrition';
import { improvedExercises } from './progression';
import { targetPace } from './targets';
import { classifyPace, weeklyChange } from './weight';

export type CheckState = 'done' | 'missed' | 'no-data';

export interface WeeklyReview {
  weight: { state: CheckState; delta: number | null };
  sessions: { state: CheckState; count: number };
  progression: { state: CheckState; improved: ExerciseId[] };
  protein: { state: CheckState; hitDays: number; loggedDays: number };
}

/** A day counts as meeting protein when it reaches this share of the target. */
const PROTEIN_HIT_SHARE = 0.9;

/** The weekly self-check, computed from the last 7 days of logs. */
export function weeklyReview(
  today: DateKey,
  settings: Pick<Settings, 'goal' | 'startWeightKg' | 'trainingDays' | 'proteinTarget'>,
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
      if (totals.proteinG >= settings.proteinTarget * PROTEIN_HIT_SHARE) hitDays++;
    }
  }

  return {
    weight: {
      state:
        delta === null
          ? 'no-data'
          : classifyPace(delta, targetPace(settings)) === 'on-track'
            ? 'done'
            : 'missed',
      delta,
    },
    sessions: { state: sessions >= settings.trainingDays ? 'done' : 'missed', count: sessions },
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
