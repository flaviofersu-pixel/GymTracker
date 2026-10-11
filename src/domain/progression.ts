import { LOAD_INCREMENT_KG, type ExerciseId, type PlannedExercise } from '../data/plan';
import type { DateKey, SetLog, Workout } from '../types';

export interface RepRange {
  min: number;
  max: number;
  unit: 'reps' | 'seconds';
}

export function parseRange(range: string): RepRange {
  const unit = /s$/i.test(range.trim()) ? 'seconds' : 'reps';
  const [min = 0, max = min] = range
    .replace(/\s*s$/i, '')
    .split('-')
    .map((part) => Number(part.trim()));
  return { min, max, unit };
}

export interface PreviousPerformance {
  date: DateKey;
  sets: SetLog[];
}

/** The most recent logged sets for an exercise, across every routine that includes it. */
export function lastPerformance(
  workouts: readonly Workout[],
  exerciseId: ExerciseId,
  options: { before?: DateKey; excludeId?: number } = {},
): PreviousPerformance | null {
  const sorted = [...workouts].sort(
    (a, b) => b.date.localeCompare(a.date) || b.loggedAt - a.loggedAt,
  );
  for (const workout of sorted) {
    if (workout.id !== undefined && workout.id === options.excludeId) continue;
    if (options.before !== undefined && workout.date >= options.before) continue;
    const log = workout.exercises.find((e) => e.exerciseId === exerciseId && e.sets.length > 0);
    if (log) return { date: workout.date, sets: log.sets };
  }
  return null;
}

export const heaviest = (sets: readonly SetLog[]): number => Math.max(0, ...sets.map((s) => s.kg));
const totalReps = (sets: readonly SetLog[]): number => sets.reduce((sum, s) => sum + s.reps, 0);

export type Recommendation =
  | { kind: 'first-time'; range: RepRange }
  | { kind: 'increase-load'; fromKg: number; toKg: number; resetTo: number }
  | { kind: 'add-rep'; kg: number; target: number }
  | { kind: 'add-time'; seconds: number };

/**
 * Double progression: once every planned set reaches the top of the range,
 * add load and drop back to the bottom of the range. Otherwise keep the load
 * and chase one more rep.
 */
export function recommend(
  exercise: PlannedExercise,
  previous: PreviousPerformance | null,
): Recommendation {
  const range = parseRange(exercise.range);
  if (!previous) return { kind: 'first-time', range };

  const planned = previous.sets.slice(0, exercise.sets);
  const toppedOut = planned.length >= exercise.sets && planned.every((s) => s.reps >= range.max);

  if (range.unit === 'seconds') {
    return { kind: 'add-time', seconds: toppedOut ? range.max + 15 : range.max };
  }
  const kg = heaviest(previous.sets);
  if (toppedOut) {
    return {
      kind: 'increase-load',
      fromKg: kg,
      toKg: kg + LOAD_INCREMENT_KG[exercise.id],
      resetTo: range.min,
    };
  }
  return { kind: 'add-rep', kg, target: range.max };
}

/** True when a session beat the previous one: more load, or the same load for more reps. */
export function isImprovement(current: readonly SetLog[], previous: readonly SetLog[]): boolean {
  const now = heaviest(current);
  const before = heaviest(previous);
  return now > before || (now === before && totalReps(current) > totalReps(previous));
}

/** Exercises that improved in sessions logged on or after `from`. */
export function improvedExercises(workouts: readonly Workout[], from: DateKey): ExerciseId[] {
  const improved = new Set<ExerciseId>();
  for (const workout of workouts.filter((w) => w.date >= from)) {
    for (const log of workout.exercises) {
      const previous = lastPerformance(workouts, log.exerciseId, { before: workout.date });
      if (previous && isImprovement(log.sets, previous.sets)) improved.add(log.exerciseId);
    }
  }
  return [...improved];
}

/** The routine after the most recent one from `rotation`; sessions outside it are skipped. */
export function nextRoutineInRotation<T extends string>(
  workouts: readonly { routine: string; date: DateKey; loggedAt: number }[],
  rotation: readonly [T, ...T[]],
): T {
  const [first] = rotation;
  const lastIndex = [...workouts]
    .sort((a, b) => b.date.localeCompare(a.date) || b.loggedAt - a.loggedAt)
    .map((w) => (rotation as readonly string[]).indexOf(w.routine))
    .find((index) => index >= 0);
  if (lastIndex === undefined) return first;
  return rotation[(lastIndex + 1) % rotation.length] ?? first;
}
