import { recommendedTargets } from '../domain/targets';
import type { Profile, RoutineId, Settings, TrainingDays } from '../types';

export type ExerciseId =
  | 'benchPress'
  | 'inclineDumbbellPress'
  | 'dumbbellShoulderPress'
  | 'cableFly'
  | 'lateralRaise'
  | 'tricepsPushdown'
  | 'pullUp'
  | 'barbellRow'
  | 'oneArmDumbbellRow'
  | 'facePull'
  | 'barbellCurl'
  | 'squat'
  | 'romanianDeadlift'
  | 'legPressOrSplitSquat'
  | 'legCurl'
  | 'legExtension'
  | 'calfRaise'
  | 'overheadPress'
  | 'rearDeltFly'
  | 'inclineDumbbellCurl'
  | 'dipsOrSkullCrusher'
  | 'hammerCurl'
  | 'overheadTricepsExtension'
  | 'hangingLegRaise'
  | 'cableCrunch'
  | 'plank'
  | 'lunge'
  | 'machineRow';

/** Load step for double progression: 2.5 kg on compound lifts, 1 kg on isolation work. */
export const LOAD_INCREMENT_KG: Record<ExerciseId, number> = {
  benchPress: 2.5,
  inclineDumbbellPress: 1,
  dumbbellShoulderPress: 1,
  cableFly: 1,
  lateralRaise: 1,
  tricepsPushdown: 1,
  pullUp: 2.5,
  barbellRow: 2.5,
  oneArmDumbbellRow: 1,
  facePull: 1,
  barbellCurl: 1,
  squat: 2.5,
  romanianDeadlift: 2.5,
  legPressOrSplitSquat: 2.5,
  legCurl: 2.5,
  legExtension: 2.5,
  calfRaise: 2.5,
  overheadPress: 2.5,
  rearDeltFly: 1,
  inclineDumbbellCurl: 1,
  dipsOrSkullCrusher: 2.5,
  hammerCurl: 1,
  overheadTricepsExtension: 1,
  hangingLegRaise: 2.5,
  cableCrunch: 2.5,
  plank: 0,
  lunge: 2.5,
  machineRow: 2.5,
};

export interface PlannedExercise {
  id: ExerciseId;
  sets: number;
  /** Rep range such as `6-8`, or a duration such as `45 s`. */
  range: string;
}

export interface Routine {
  id: RoutineId;
  exercises: PlannedExercise[];
}

const ex = (id: ExerciseId, sets: number, range: string): PlannedExercise => ({ id, sets, range });

export const ROUTINES: Record<RoutineId, Routine> = {
  push: {
    id: 'push',
    exercises: [
      ex('benchPress', 4, '6-8'),
      ex('inclineDumbbellPress', 3, '8-10'),
      ex('dumbbellShoulderPress', 3, '8-10'),
      ex('cableFly', 2, '12-15'),
      ex('lateralRaise', 3, '12-15'),
      ex('tricepsPushdown', 3, '10-12'),
    ],
  },
  pull: {
    id: 'pull',
    exercises: [
      ex('pullUp', 4, '6-10'),
      ex('barbellRow', 3, '8-10'),
      ex('oneArmDumbbellRow', 3, '10-12'),
      ex('facePull', 3, '12-15'),
      ex('barbellCurl', 3, '8-12'),
    ],
  },
  legs: {
    id: 'legs',
    exercises: [
      ex('squat', 4, '6-8'),
      ex('romanianDeadlift', 3, '8-10'),
      ex('legPressOrSplitSquat', 3, '10-12'),
      ex('legCurl', 3, '10-12'),
      ex('legExtension', 2, '12-15'),
      ex('calfRaise', 4, '12-15'),
    ],
  },
  arms: {
    id: 'arms',
    exercises: [
      ex('overheadPress', 3, '6-8'),
      ex('lateralRaise', 4, '12-15'),
      ex('rearDeltFly', 3, '12-15'),
      ex('inclineDumbbellCurl', 3, '10-12'),
      ex('dipsOrSkullCrusher', 3, '8-12'),
      ex('hammerCurl', 2, '10-12'),
      ex('overheadTricepsExtension', 2, '10-12'),
      ex('hangingLegRaise', 3, '10-15'),
      ex('cableCrunch', 3, '12-15'),
      ex('plank', 2, '45 s'),
    ],
  },
  upper: {
    id: 'upper',
    exercises: [
      ex('benchPress', 3, '6-8'),
      ex('barbellRow', 3, '8-10'),
      ex('overheadPress', 3, '8-10'),
      ex('pullUp', 3, '6-10'),
      ex('lateralRaise', 3, '12-15'),
      ex('barbellCurl', 2, '10-12'),
      ex('tricepsPushdown', 2, '10-12'),
    ],
  },
  lower: {
    id: 'lower',
    exercises: [
      ex('squat', 4, '6-8'),
      ex('romanianDeadlift', 3, '8-10'),
      ex('lunge', 2, '10-10'),
      ex('legCurl', 3, '10-12'),
      ex('calfRaise', 4, '12-15'),
      ex('hangingLegRaise', 3, '10-15'),
    ],
  },
  fullA: {
    id: 'fullA',
    exercises: [
      ex('squat', 3, '6-8'),
      ex('benchPress', 3, '6-8'),
      ex('barbellRow', 3, '8-10'),
      ex('lateralRaise', 3, '12-15'),
      ex('barbellCurl', 2, '10-12'),
      ex('calfRaise', 3, '12-15'),
    ],
  },
  fullB: {
    id: 'fullB',
    exercises: [
      ex('romanianDeadlift', 3, '8-10'),
      ex('overheadPress', 3, '6-8'),
      ex('pullUp', 3, '6-10'),
      ex('lunge', 2, '10-10'),
      ex('tricepsPushdown', 2, '10-12'),
      ex('plank', 3, '40 s'),
    ],
  },
  fullC: {
    id: 'fullC',
    exercises: [
      ex('legPressOrSplitSquat', 3, '10-12'),
      ex('inclineDumbbellPress', 3, '8-10'),
      ex('machineRow', 3, '10-12'),
      ex('legCurl', 3, '10-12'),
      ex('hammerCurl', 2, '12-12'),
      ex('calfRaise', 3, '12-15'),
    ],
  },
};

export const ROUTINE_IDS = Object.keys(ROUTINES) as RoutineId[];

type Split = readonly [RoutineId, ...RoutineId[]];

/**
 * The routines to rotate through for each number of training days per week, in order.
 * Every split hits legs at least twice a week.
 */
export const SPLITS: Record<TrainingDays, Split> = {
  2: ['fullA', 'fullB'],
  3: ['fullA', 'fullB', 'fullC'],
  4: ['upper', 'lower'],
  5: ['push', 'pull', 'legs', 'upper', 'lower'],
  6: ['push', 'pull', 'legs', 'arms', 'upper', 'lower'],
};

export const TRAINING_DAY_OPTIONS = Object.keys(SPLITS).map(Number) as TrainingDays[];

export type PresetId =
  | 'breakfastShake'
  | 'breakfastShakeWhey'
  | 'chickenRiceSkillet'
  | 'yogurtNuts'
  | 'eggsBreadTuna'
  | 'glassOfMilk'
  | 'banana'
  | 'peanuts';

export interface MealPreset {
  id: PresetId;
  kcal: number;
  proteinG: number;
}

export const MEAL_PRESETS: readonly MealPreset[] = [
  { id: 'breakfastShake', kcal: 850, proteinG: 30 },
  { id: 'breakfastShakeWhey', kcal: 970, proteinG: 55 },
  { id: 'chickenRiceSkillet', kcal: 800, proteinG: 45 },
  { id: 'yogurtNuts', kcal: 450, proteinG: 22 },
  { id: 'eggsBreadTuna', kcal: 650, proteinG: 40 },
  { id: 'glassOfMilk', kcal: 160, proteinG: 8 },
  { id: 'banana', kcal: 105, proteinG: 1 },
  { id: 'peanuts', kcal: 170, proteinG: 8 },
];

const DEFAULT_PROFILE: Profile = {
  sex: 'male',
  age: 30,
  heightCm: 175,
  startWeightKg: 70,
  goal: 'maintain',
  goalWeightKg: 70,
  activity: 'moderate',
  trainingDays: 3,
};

export const DEFAULT_SETTINGS: Settings = {
  ...DEFAULT_PROFILE,
  ...recommendedTargets(DEFAULT_PROFILE),
  onboarded: false,
  apiKey: '',
};
