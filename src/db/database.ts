import Dexie, { type EntityTable } from 'dexie';
import { DEFAULT_SETTINGS } from '../data/plan';
import { toDateKey } from '../domain/dates';
import type { Analysis, Meal, Settings, WeightEntry, Workout } from '../types';

interface SettingsRow extends Settings {
  id: 'main';
}

export class CuadernoDB extends Dexie {
  weights!: EntityTable<WeightEntry, 'date'>;
  meals!: EntityTable<Meal, 'id'>;
  workouts!: EntityTable<Workout, 'id'>;
  analyses!: EntityTable<Analysis, 'id'>;
  settings!: EntityTable<SettingsRow, 'id'>;

  constructor(name = 'cuaderno-70') {
    super(name);
    this.version(1).stores({
      weights: 'date',
      meals: '++id, date, loggedAt',
      workouts: '++id, date, routine',
      analyses: '++id, createdAt',
      settings: 'id',
    });
  }
}

export const db = new CuadernoDB();

export async function loadSettings(database: CuadernoDB = db): Promise<Settings> {
  const row = await database.settings.get('main');
  return { ...DEFAULT_SETTINGS, ...row };
}

export async function saveSettings(
  patch: Partial<Settings>,
  database: CuadernoDB = db,
): Promise<void> {
  const current = await loadSettings(database);
  await database.settings.put({ ...current, ...patch, id: 'main' });
}

/** Logs a meal as eaten now. */
export async function logMeal(meal: Omit<Meal, 'id' | 'date' | 'loggedAt'>): Promise<void> {
  await db.meals.add({ ...meal, date: toDateKey(), loggedAt: Date.now() });
}

/** Logs a training session as done now. */
export async function logWorkout(
  workout: Omit<Workout, 'id' | 'date' | 'loggedAt'>,
): Promise<void> {
  await db.workouts.add({ ...workout, date: toDateKey(), loggedAt: Date.now() });
}

/** Saves an AI review written now. */
export async function logAnalysis(text: string): Promise<void> {
  await db.analyses.add({ text, date: toDateKey(), createdAt: Date.now() });
}
