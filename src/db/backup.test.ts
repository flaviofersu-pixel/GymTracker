import { afterEach, describe, expect, it } from 'vitest';
import { exportBackup, importBackup } from './backup';
import { CuadernoDB, saveSettings } from './database';

const created: CuadernoDB[] = [];
const freshDb = () => {
  const database = new CuadernoDB(`test-${crypto.randomUUID()}`);
  created.push(database);
  return database;
};

afterEach(async () => {
  await Promise.all(created.splice(0).map((d) => d.delete()));
});

describe('backup', () => {
  it('round-trips every log into an empty database', async () => {
    const source = freshDb();
    await source.weights.add({ date: '2026-10-14', kg: 62.4, waistCm: 74 });
    await source.meals.add({
      date: '2026-10-14',
      loggedAt: 1,
      name: 'Shake',
      details: '',
      kcal: 850,
      proteinG: 30,
      source: 'preset',
    });
    await source.workouts.add({
      date: '2026-10-14',
      loggedAt: 2,
      routine: 'push',
      exercises: [{ exerciseId: 'benchPress', range: '6-8', sets: [{ kg: 60, reps: 8 }] }],
    });

    const target = freshDb();
    await importBackup(JSON.parse(JSON.stringify(await exportBackup(source))), target);

    expect(await target.weights.toArray()).toEqual([{ date: '2026-10-14', kg: 62.4, waistCm: 74 }]);
    expect(await target.meals.count()).toBe(1);
    expect((await target.workouts.toArray())[0]?.exercises[0]?.exerciseId).toBe('benchPress');
  });

  it('never exports the API key', async () => {
    const source = freshDb();
    await saveSettings({ apiKey: 'sk-ant-secret' }, source);
    expect(JSON.stringify(await exportBackup(source))).not.toContain('sk-ant-secret');
  });

  it('rejects files that are not backups and leaves data untouched', async () => {
    const target = freshDb();
    await target.weights.add({ date: '2026-10-14', kg: 62 });
    await expect(importBackup({ hello: 'world' }, target)).rejects.toThrow();
    expect(await target.weights.count()).toBe(1);
  });
});
