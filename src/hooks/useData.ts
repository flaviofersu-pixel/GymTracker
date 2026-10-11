import { useLiveQuery } from 'dexie-react-hooks';
import { DEFAULT_SETTINGS } from '../data/plan';
import { db, loadSettings } from '../db/database';
import type { Analysis, Meal, Settings, WeightEntry, Workout } from '../types';

const EMPTY: never[] = [];

export const useSettings = (): Settings => useLiveQuery(() => loadSettings(), [], DEFAULT_SETTINGS);

export const useWeights = (): WeightEntry[] =>
  useLiveQuery(() => db.weights.orderBy('date').toArray(), [], EMPTY);

export const useMeals = (): Meal[] => useLiveQuery(() => db.meals.toArray(), [], EMPTY);

export const useWorkouts = (): Workout[] =>
  useLiveQuery(() => db.workouts.orderBy('date').reverse().toArray(), [], EMPTY);

export const useAnalyses = (): Analysis[] =>
  useLiveQuery(() => db.analyses.orderBy('createdAt').reverse().toArray(), [], EMPTY);
