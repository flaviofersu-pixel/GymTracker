import { describe, expect, it } from 'vitest';
import {
  ROUTINES,
  SPLITS,
  SPLIT_PRESETS,
  TRAINING_DAY_OPTIONS,
  rotationFor,
  type PlannedExercise,
} from '../data/plan';
import type { Workout } from '../types';
import {
  improvedExercises,
  isImprovement,
  lastPerformance,
  nextRoutineInRotation,
  parseRange,
  recommend,
} from './progression';

const bench: PlannedExercise = { id: 'benchPress', sets: 3, range: '6-8' };
const lateral: PlannedExercise = { id: 'lateralRaise', sets: 3, range: '12-15' };
const plank: PlannedExercise = { id: 'plank', sets: 2, range: '45 s' };

const workout = (date: string, overrides: Partial<Workout> = {}): Workout => ({
  date,
  loggedAt: 0,
  routine: 'push',
  exercises: [],
  ...overrides,
});

describe('parseRange', () => {
  it('reads rep ranges', () => {
    expect(parseRange('6-8')).toEqual({ min: 6, max: 8, unit: 'reps' });
  });

  it('reads timed sets', () => {
    expect(parseRange('45 s')).toEqual({ min: 45, max: 45, unit: 'seconds' });
  });
});

describe('recommend', () => {
  it('asks for a starting weight the first time', () => {
    expect(recommend(bench, null).kind).toBe('first-time');
  });

  it('adds 2.5 kg on compound lifts once every set hits the top of the range', () => {
    const previous = { date: '2026-10-01', sets: [8, 8, 8].map((reps) => ({ kg: 60, reps })) };
    expect(recommend(bench, previous)).toEqual({
      kind: 'increase-load',
      fromKg: 60,
      toKg: 62.5,
      resetTo: 6,
    });
  });

  it('adds 1 kg on isolation work', () => {
    const previous = { date: '2026-10-01', sets: [15, 15, 15].map((reps) => ({ kg: 8, reps })) };
    expect(recommend(lateral, previous)).toMatchObject({ kind: 'increase-load', toKg: 9 });
  });

  it('keeps the load while any set is short of the top', () => {
    const previous = { date: '2026-10-01', sets: [8, 7, 6].map((reps) => ({ kg: 60, reps })) };
    expect(recommend(bench, previous)).toEqual({ kind: 'add-rep', kg: 60, target: 8 });
  });

  it('keeps the load when fewer sets than planned were done', () => {
    const previous = { date: '2026-10-01', sets: [8, 8].map((reps) => ({ kg: 60, reps })) };
    expect(recommend(bench, previous).kind).toBe('add-rep');
  });

  it('adds time to timed exercises once the target is held', () => {
    const previous = { date: '2026-10-01', sets: [45, 45].map((reps) => ({ kg: 0, reps })) };
    expect(recommend(plank, previous)).toEqual({ kind: 'add-time', seconds: 60 });
  });
});

describe('lastPerformance', () => {
  const history = [
    workout('2026-10-01', {
      id: 1,
      exercises: [{ exerciseId: 'benchPress', range: '6-8', sets: [{ kg: 55, reps: 8 }] }],
    }),
    workout('2026-10-05', {
      id: 2,
      exercises: [{ exerciseId: 'benchPress', range: '6-8', sets: [{ kg: 60, reps: 6 }] }],
    }),
    workout('2026-10-06', { id: 3, routine: 'pull' }),
  ];

  it('returns the most recent session that logged the exercise', () => {
    expect(lastPerformance(history, 'benchPress')?.date).toBe('2026-10-05');
  });

  it('can look only before a given day', () => {
    expect(lastPerformance(history, 'benchPress', { before: '2026-10-05' })?.date).toBe(
      '2026-10-01',
    );
  });

  it('returns null for exercises never logged', () => {
    expect(lastPerformance(history, 'squat')).toBeNull();
  });
});

describe('isImprovement', () => {
  it('counts heavier load', () => {
    expect(isImprovement([{ kg: 62.5, reps: 6 }], [{ kg: 60, reps: 8 }])).toBe(true);
  });

  it('counts more reps at the same load', () => {
    expect(
      isImprovement(
        [
          { kg: 60, reps: 8 },
          { kg: 60, reps: 7 },
        ],
        [
          { kg: 60, reps: 8 },
          { kg: 60, reps: 6 },
        ],
      ),
    ).toBe(true);
  });

  it('does not count a repeat', () => {
    expect(isImprovement([{ kg: 60, reps: 8 }], [{ kg: 60, reps: 8 }])).toBe(false);
  });
});

describe('improvedExercises', () => {
  it('lists exercises that beat their previous session', () => {
    const history = [
      workout('2026-09-28', {
        exercises: [{ exerciseId: 'benchPress', range: '6-8', sets: [{ kg: 60, reps: 6 }] }],
      }),
      workout('2026-10-08', {
        exercises: [{ exerciseId: 'benchPress', range: '6-8', sets: [{ kg: 60, reps: 8 }] }],
      }),
    ];
    expect(improvedExercises(history, '2026-10-05')).toEqual(['benchPress']);
  });
});

describe('nextRoutineInRotation', () => {
  const rotation = ['push', 'pull', 'legs', 'arms'] as const;

  it('starts with the first routine', () => {
    expect(nextRoutineInRotation([], rotation)).toBe('push');
  });

  it('follows the last routine trained and wraps around', () => {
    expect(nextRoutineInRotation([workout('2026-10-01', { routine: 'arms' })], rotation)).toBe(
      'push',
    );
    expect(nextRoutineInRotation([workout('2026-10-01', { routine: 'pull' })], rotation)).toBe(
      'legs',
    );
  });

  it('ignores full-body sessions', () => {
    const history = [
      workout('2026-10-01', { routine: 'pull' }),
      workout('2026-10-03', { routine: 'fullA' }),
    ];
    expect(nextRoutineInRotation(history, rotation)).toBe('legs');
  });
});

describe('training splits', () => {
  it('has a rotation for every training-day option and only known routines', () => {
    for (const days of TRAINING_DAY_OPTIONS) {
      expect(SPLITS[days].every((id) => id in ROUTINES)).toBe(true);
    }
  });

  it('uses the chosen split over the recommended one', () => {
    expect(rotationFor({ trainingDays: 4 })).toEqual(['upper', 'lower']);
    expect(rotationFor({ trainingDays: 4, rotation: [...SPLIT_PRESETS.pplArms] })).toEqual([
      'push',
      'pull',
      'legs',
      'arms',
    ]);
  });

  it('falls back to the recommended split when the chosen one is empty', () => {
    expect(rotationFor({ trainingDays: 3, rotation: [] })).toEqual(SPLITS[3]);
  });

  it('only uses known routines in presets', () => {
    for (const split of Object.values(SPLIT_PRESETS)) {
      expect(split.every((id) => id in ROUTINES)).toBe(true);
    }
  });

  it('alternates upper and lower on four days', () => {
    const done = [{ routine: 'upper', date: '2026-10-13', loggedAt: 1 }];
    expect(nextRoutineInRotation(done, SPLITS[4])).toBe('lower');
  });
});
