import type { ExerciseId } from './data/plan';

/** A calendar day in local time, formatted as `YYYY-MM-DD`. */
export type DateKey = string;

export interface WeightEntry {
  date: DateKey;
  kg: number;
  waistCm?: number;
}

export type MealSource = 'photo' | 'text' | 'manual' | 'preset' | 'suggestion';

export interface Meal {
  id?: number;
  date: DateKey;
  /** Epoch milliseconds, used to order meals within a day. */
  loggedAt: number;
  name: string;
  details: string;
  kcal: number;
  proteinG: number;
  carbsG?: number;
  fatG?: number;
  source: MealSource;
}

export interface SetLog {
  kg: number;
  /** Repetitions, or seconds for timed exercises such as the plank. */
  reps: number;
}

export interface ExerciseLog {
  exerciseId: ExerciseId;
  range: string;
  sets: SetLog[];
}

export type RoutineId = 'push' | 'pull' | 'legs' | 'arms' | 'fullA' | 'fullB' | 'fullC';

export interface Workout {
  id?: number;
  date: DateKey;
  loggedAt: number;
  routine: RoutineId;
  exercises: ExerciseLog[];
}

export interface Analysis {
  id?: number;
  date: DateKey;
  createdAt: number;
  text: string;
}

export type Locale = 'en' | 'es';

export interface Settings {
  kcalTarget: number;
  proteinTarget: number;
  startWeightKg: number;
  goalWeightKg: number;
  heightCm: number;
  /** Anthropic API key. Stored only in this browser's IndexedDB. */
  apiKey: string;
}
