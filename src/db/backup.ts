import { z } from 'zod';
import { LOAD_INCREMENT_KG, ROUTINE_IDS, type ExerciseId } from '../data/plan';
import { db, type CuadernoDB } from './database';

const BACKUP_VERSION = 1;

const EXERCISE_IDS = Object.keys(LOAD_INCREMENT_KG) as [ExerciseId, ...ExerciseId[]];

const setSchema = z.object({ kg: z.number(), reps: z.number() });

const backupSchema = z.object({
  version: z.literal(BACKUP_VERSION),
  exportedAt: z.string(),
  weights: z.array(z.object({ date: z.string(), kg: z.number(), waistCm: z.number().optional() })),
  meals: z.array(
    z.object({
      date: z.string(),
      loggedAt: z.number(),
      name: z.string(),
      details: z.string(),
      kcal: z.number(),
      proteinG: z.number(),
      carbsG: z.number().optional(),
      fatG: z.number().optional(),
      source: z.enum(['photo', 'text', 'manual', 'preset', 'suggestion']),
    }),
  ),
  workouts: z.array(
    z.object({
      date: z.string(),
      loggedAt: z.number(),
      routine: z.enum(ROUTINE_IDS),
      exercises: z.array(
        z.object({ exerciseId: z.enum(EXERCISE_IDS), range: z.string(), sets: z.array(setSchema) }),
      ),
    }),
  ),
  analyses: z.array(z.object({ date: z.string(), createdAt: z.number(), text: z.string() })),
});

export type Backup = z.infer<typeof backupSchema>;

const withoutId = <T extends { id?: number }>({ id: _id, ...rest }: T): Omit<T, 'id'> => rest;

/** Everything except settings, so the API key never ends up in a shared file. */
export async function exportBackup(database: CuadernoDB = db): Promise<Backup> {
  const [weights, meals, workouts, analyses] = await Promise.all([
    database.weights.toArray(),
    database.meals.toArray(),
    database.workouts.toArray(),
    database.analyses.toArray(),
  ]);
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    weights,
    meals: meals.map(withoutId),
    workouts: workouts.map(withoutId),
    analyses: analyses.map(withoutId),
  };
}

/** Replaces all logged data with the backup's contents. Throws if the file is not a valid backup. */
export async function importBackup(raw: unknown, database: CuadernoDB = db): Promise<Backup> {
  const backup = backupSchema.parse(raw);
  await database.transaction(
    'rw',
    [database.weights, database.meals, database.workouts, database.analyses],
    async () => {
      await Promise.all([
        database.weights.clear(),
        database.meals.clear(),
        database.workouts.clear(),
        database.analyses.clear(),
      ]);
      await database.weights.bulkAdd(backup.weights);
      await database.meals.bulkAdd(backup.meals);
      await database.workouts.bulkAdd(backup.workouts);
      await database.analyses.bulkAdd(backup.analyses);
    },
  );
  return backup;
}
