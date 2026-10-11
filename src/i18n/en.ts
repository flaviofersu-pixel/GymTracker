import type { ExerciseId, PresetId } from '../data/plan';
import type { RoutineId } from '../types';

const plural = (n: number, one: string, many: string) => `${String(n)} ${n === 1 ? one : many}`;

export const en = {
  locale: 'en-GB',
  languageName: 'English',

  app: {
    tagline: (start: number, goal: number, height: number) =>
      `${String(start)} → ${String(goal)} kg · ${String(height)} cm`,
    tabs: { today: 'Today', weight: 'Weight', training: 'Training', progress: 'Progress' },
    language: 'Language',
  },

  today: {
    budgetTitle: "Today's calories",
    left: 'Left',
    protein: 'Protein',
    ofKcal: (eaten: number, target: number) => `${String(eaten)} of ${String(target)} kcal`,
    ofProtein: (eaten: number, target: number) => `${String(eaten)} of ${String(target)} g`,
    kcalEaten: 'Calories eaten',
    proteinEaten: 'Protein eaten',
    mealsTitle: "Today's meals",
    mealCount: (n: number) => plural(n, 'meal', 'meals'),
    empty:
      'Nothing logged yet today. Describe a meal, snap a photo or tap one of your plan’s quick adds.',
    delete: (name: string) => `Delete ${name}`,
    proteinShort: 'g protein',
  },

  composer: {
    title: 'Add a meal',
    describe: 'What’s in it (no scales needed)',
    placeholder: 'e.g. a plate of pasta with 2 cans of tuna, crushed tomato and a drizzle of oil',
    photo: 'Photo (optional)',
    photoPick: 'Take or choose a photo',
    estimate: 'Estimate with AI',
    estimating: 'Estimating…',
    manual: 'Enter manually',
    needInput: 'Describe the meal or add a photo',
    quickAdds: 'Quick adds from your plan',
    added: (kcal: number) => `Added: ${String(kcal)} kcal`,
    saved: 'Meal saved',
  },

  review: {
    name: 'Name',
    kcal: 'kcal',
    protein: 'Protein (g)',
    confidence: 'Estimate confidence:',
    confidenceLevel: { high: 'high', medium: 'medium', low: 'low' },
    save: 'Save meal',
    cancel: 'Cancel',
    needKcal: 'Enter the calories',
    defaultName: 'Meal',
  },

  suggestions: {
    ask: 'What should I eat to close the day?',
    loading: 'Thinking of options…',
    done: 'You’ve already hit today’s target.',
    add: 'Add',
    added: 'Added',
    summary: (kcal: number, protein: number, minutes: number) =>
      `${String(kcal)} kcal · ${String(protein)} g protein · ${String(minutes)} min`,
  },

  weight: {
    title: "Today's weight",
    kg: 'Fasted weight (kg)',
    waist: 'Waist (cm)',
    save: 'Save weight',
    invalid: 'Enter a valid weight',
    saved: 'Weight saved',
    trend: 'Weight trend',
    avg7: '7-day average',
    vsLastWeek: 'vs last week',
    toGo: 'To go',
    paceUnknown: 'Weigh in 3-4 mornings a week. After two weeks you’ll see whether you’re on pace.',
    pace: {
      slow: {
        label: 'Slow',
        text: 'Below +0.2 kg a week. If it happens again next week, add about 200 kcal (a glass of milk and a spoon of peanut butter).',
      },
      'on-track': { label: 'On track', text: 'A good pace for gaining muscle with little fat.' },
      fast: {
        label: 'Fast',
        text: 'More than +0.5 kg a week. Cut 150-200 kcal and watch your waist.',
      },
    },
    chartCaption: 'Dots: daily weight. Line: 7-day average. Plan target: +0.2 to +0.3 kg a week.',
    chartLabel: (weeks: number) => `Weight over the last ${String(weeks)} weeks`,
    chartEmpty: 'No data yet',
    log: 'Entries',
    logEmpty: 'Your first weigh-in will show up here.',
    delete: (day: string) => `Delete weight for ${day}`,
  },

  training: {
    nextUp: (name: string) => `Up next: ${name}`,
    pickRoutine: 'Choose a routine',
    rir: 'Leave 1-2 reps in reserve.',
    exercisesOf: (name: string) => `${name} exercises`,
    save: 'Save session',
    saved: 'Session saved',
    needSet: 'Log at least one set',
    historyTitle: 'Recent sessions',
    historyEmpty:
      'Once you save your first session, your history shows up here and the app tells you when to add weight.',
    sets: (n: number) => plural(n, 'set', 'sets'),
    deleteSession: (day: string) => `Delete session from ${day}`,
    last: (day: string, sets: string) => `Last (${day}): ${sets}.`,
    setLabel: (exercise: string, n: number, field: 'kg' | 'reps' | 'seconds') =>
      `${exercise}, set ${String(n)}, ${field === 'kg' ? 'kg' : field === 'reps' ? 'reps' : 'seconds'}`,
    seconds: 'sec',
    reps: 'reps',
    hint: {
      firstTime: (target: string) =>
        `First time: pick a weight you can do for ${target} with 1-2 reps in reserve.`,
      increaseLoad: (kg: string, reps: number) => [
        '',
        `Go up to ${kg} kg`,
        ` and drop back to ${String(reps)} reps.`,
      ],
      addRep: (target: number) => [
        'Same weight, aim for ',
        '+1 rep',
        ` until you reach ${String(target)}.`,
      ],
      addTime: (seconds: number) => ['Target: ', `${String(seconds)} s`, ' per set.'],
    },
  },

  progress: {
    weekTitle: 'Weekly check-in',
    checks: {
      weight: 'Average weight went up 0.2-0.3 kg',
      weightNoData: 'Need weigh-ins from two weeks',
      weightDetail: (delta: string) => `Change: ${delta} kg`,
      sessions: 'Trained 3-4 times',
      sessionsDetail: (n: number) => `${String(n)} this week`,
      improved: 'Added weight or reps on at least one exercise',
      improvedNone: 'No exercise improved yet',
      protein: (min: number) => `${String(min)} g of protein or more on most days`,
      proteinNoData: 'No meals logged',
      proteinDetail: (hit: number, logged: number) =>
        `${String(hit)} of ${String(logged)} logged days`,
      sleep: 'Slept 7+ hours most nights',
      sleepDetail: 'Only you know this one',
    },
  },

  analysis: {
    title: 'AI review',
    none: 'None yet',
    overdue: (days: number) => `${String(days)} days ago`,
    last: (days: number) =>
      days === 0 ? 'Last: today' : `Last: ${plural(days, 'day', 'days')} ago`,
    intro:
      'The AI looks at your weight, training and meals over the last few weeks and tells you what to adjust. Once a week works best.',
    run: 'Review my progress',
    running: 'Reviewing…',
    stop: 'Stop',
    thinking: 'Thinking… this can take a minute.',
    pastTitle: 'Past reviews',
    pastEmpty: 'Your reviews are kept here so you can compare week to week.',
  },

  settings: {
    title: 'Settings',
    kcal: 'Calories per day',
    protein: 'Protein per day (g)',
    goal: 'Goal weight (kg)',
    apiKey: 'Anthropic API key',
    apiKeyHelp:
      'The AI features use your own key. It’s stored only on this device and sent only to the Anthropic API. Create one at',
    save: 'Save settings',
    saved: 'Settings saved',
    invalid: 'Check the numbers',
  },

  backup: {
    title: 'Backup',
    intro:
      'Your data lives on this device. Download a copy now and then, or to move it to another phone. The API key is not included.',
    download: 'Download backup',
    restore: 'Restore backup',
    confirm: (file: string) => [`Restoring `, file, ` replaces all your current entries.`],
    replace: 'Replace my data',
    cancel: 'Cancel',
    restored: (weights: number, sessions: number) =>
      `Backup restored: ${plural(weights, 'weigh-in', 'weigh-ins')}, ${plural(sessions, 'session', 'sessions')}`,
    invalid: 'That file isn’t a valid Cuaderno 70 backup',
  },

  errors: {
    missingKey: 'Add your Anthropic API key in Progress → Settings.',
    invalidKey: 'The API key isn’t valid.',
    permission: 'Your key can’t use this model.',
    rateLimited: 'Too many requests, or no credit left. Try again later.',
    offline: 'You’re offline. Check your connection.',
    service: 'The AI service failed. Try again.',
    refused: 'The AI couldn’t handle that. Try describing it differently.',
    photo: 'Couldn’t read that photo. Try another one.',
    unknown: 'Something went wrong talking to the AI. Try again.',
  },

  routines: {
    push: { name: 'Push', focus: 'Chest, shoulders and triceps' },
    pull: { name: 'Pull', focus: 'Back and biceps' },
    legs: { name: 'Legs', focus: 'Your only leg day: don’t skip it' },
    arms: {
      name: 'Arms & shoulders',
      focus: 'Arms, shoulders and abs. Leave a day between Push and this',
    },
    fullA: { name: 'Full A', focus: 'Full body, 3-day week' },
    fullB: { name: 'Full B', focus: 'Full body, 3-day week' },
    fullC: { name: 'Full C', focus: 'Full body, 3-day week' },
  } satisfies Record<RoutineId, { name: string; focus: string }>,

  exercises: {
    benchPress: 'Bench press',
    inclineDumbbellPress: 'Incline dumbbell press',
    dumbbellShoulderPress: 'Dumbbell shoulder press',
    cableFly: 'Cable fly or pec deck',
    lateralRaise: 'Lateral raise',
    tricepsPushdown: 'Triceps pushdown',
    pullUp: 'Pull-up or lat pulldown',
    barbellRow: 'Barbell or machine row',
    oneArmDumbbellRow: 'One-arm dumbbell row',
    facePull: 'Face pull',
    barbellCurl: 'Barbell curl',
    squat: 'Squat or leg press',
    romanianDeadlift: 'Romanian deadlift',
    legPressOrSplitSquat: 'Leg press or Bulgarian split squat',
    legCurl: 'Leg curl',
    legExtension: 'Leg extension',
    calfRaise: 'Calf raise',
    overheadPress: 'Barbell or machine overhead press',
    rearDeltFly: 'Rear delt fly',
    inclineDumbbellCurl: 'Incline dumbbell curl',
    dipsOrSkullCrusher: 'Dips or skull crusher',
    hammerCurl: 'Hammer curl',
    overheadTricepsExtension: 'Overhead triceps extension',
    hangingLegRaise: 'Hanging leg raise',
    cableCrunch: 'Cable crunch',
    plank: 'Plank',
    lunge: 'Lunge',
    machineRow: 'Machine row',
  } satisfies Record<ExerciseId, string>,

  presets: {
    breakfastShake: {
      name: 'Breakfast shake',
      details: '400 ml whole milk, 60 g oats, 1 banana, 1 tbsp peanut butter',
    },
    breakfastShakeWhey: {
      name: 'Breakfast shake + whey',
      details: 'The usual shake plus 1 scoop of whey',
    },
    chickenRiceSkillet: {
      name: 'Chicken and rice skillet',
      details: '200 g chicken thigh or ground beef, rice, vegetables, 1 tbsp oil',
    },
    yogurtNuts: {
      name: 'Greek yogurt with nuts',
      details: '250 g yogurt or quark, a handful of nuts, fruit',
    },
    eggsBreadTuna: {
      name: 'Eggs, bread and tuna',
      details: '3 eggs, 2-3 slices of bread, 1 can of tuna, tomato with oil',
    },
    glassOfMilk: { name: 'Glass of whole milk', details: '250 ml' },
    banana: { name: 'Banana', details: '1 medium' },
    peanuts: { name: 'Peanuts', details: 'A handful, about 30 g' },
  } satisfies Record<PresetId, { name: string; details: string }>,
};

export type Messages = typeof en;
