import { PANTRY } from '../data/plan';
import { addDays } from '../domain/dates';
import { dayTotals } from '../domain/nutrition';
import { averageBetween } from '../domain/weight';
import { en } from '../i18n/en';
import type { DateKey, Locale, Meal, Settings, WeightEntry, Workout } from '../types';

type Profile = Pick<Settings, 'heightCm' | 'startWeightKg' | 'goalWeightKg'>;

const LANGUAGE: Record<Locale, string> = {
  en: 'English',
  es: 'Spanish (Spain), addressing him as "tú"',
};

const athlete = (p: Profile): string =>
  `He is ${String(p.heightCm)} cm tall, started at ${String(p.startWeightKg)} kg and is lean bulking ` +
  `towards ~${String(p.goalWeightKg)} kg. He struggles to eat large amounts and does not meal prep: ` +
  'every meal is made on the spot in 15 minutes or less.';

export function mealEstimatePrompt(
  profile: Profile,
  description: string,
  hasPhoto: boolean,
  locale: Locale,
): string {
  return [
    `You are a nutritionist estimating a meal without a kitchen scale. ${athlete(profile)}`,
    hasPhoto ? 'The attached photo shows the meal.' : '',
    description ? `He describes it as: "${description}".` : '',
    'If he gives no quantities, assume typical home portions in Spain. Treat his description as the ' +
      'truth about ingredients, for example oil that cannot be seen in the photo.',
    'Give amounts in household measures ("1 plate", "~150 g", "1 tablespoon") and use "note" for one ' +
      'sentence on what would change the estimate most.',
    `Write every text field in ${LANGUAGE[locale]}.`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function suggestionsPrompt(input: {
  profile: Profile;
  hour: number;
  eatenToday: readonly Meal[];
  kcalLeft: number;
  proteinLeft: number;
  locale: Locale;
}): string {
  const eaten =
    input.eatenToday.map((m) => `${m.name} (${String(Math.round(m.kcal))} kcal)`).join('; ') ||
    'nothing yet';
  return [
    athlete(input.profile),
    `It is ${String(input.hour)}:00. So far today he has eaten: ${eaten}.`,
    `He still needs ${String(input.kcalLeft)} kcal and ${String(input.proteinLeft)} g of protein.`,
    `Foods he has at home: ${PANTRY.join(', ')}.`,
    'Suggest 3 different options that close the gap within ±100 kcal (one may be split into two ' +
      'snacks). Use household measures (glasses, spoons, cans, units), never grams on a scale. If many ' +
      'calories are missing, favour dense, easy-to-eat foods.',
    `Write every text field in ${LANGUAGE[input.locale]}.`,
  ].join('\n');
}

/** A compact, plain-text summary of recent logs for the weekly review. */
export function progressDigest(
  today: DateKey,
  settings: Settings,
  data: { weights: readonly WeightEntry[]; meals: readonly Meal[]; workouts: readonly Workout[] },
): string {
  const lines = [
    `Targets: ${String(settings.kcalTarget)} kcal/day, ${String(settings.proteinTarget)} g protein/day.`,
    '',
    'Weekly average weight (week ending on the date):',
  ];
  for (let week = 7; week >= 0; week--) {
    const end = addDays(today, -7 * week);
    const avg = averageBetween(data.weights, addDays(end, -6), end);
    if (avg !== null) lines.push(`${end}: ${avg.toFixed(2)} kg`);
  }
  const waist = data.weights.filter((w) => w.waistCm !== undefined).slice(-4);
  if (waist.length > 0) {
    lines.push(`Waist: ${waist.map((w) => `${w.date} ${String(w.waistCm)} cm`).join(', ')}`);
  }

  lines.push('', 'Logged calories and protein (last 14 days):');
  for (let i = 13; i >= 0; i--) {
    const date = addDays(today, -i);
    const t = dayTotals(data.meals, date);
    lines.push(
      `${date}: ${t.kcal > 0 ? `${String(Math.round(t.kcal))} kcal, ${String(Math.round(t.proteinG))} g protein` : 'not logged'}`,
    );
  }

  lines.push('', 'Training sessions (last 4 weeks, kg×reps):');
  const since = addDays(today, -28);
  [...data.workouts]
    .filter((w) => w.date >= since)
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((w) => {
      const exercises = w.exercises
        .map(
          (e) =>
            `${en.exercises[e.exerciseId]} [${e.range}] ` +
            e.sets.map((s) => `${String(s.kg)}×${String(s.reps)}`).join(', '),
        )
        .join(' | ');
      lines.push(`${w.date} ${en.routines[w.routine].name}: ${exercises}`);
    });

  return lines.join('\n');
}

export function analysisPrompt(
  today: DateKey,
  settings: Settings,
  digest: string,
  locale: Locale,
): string {
  return [
    `You are his strength coach and nutritionist. ${athlete(settings)}`,
    'He follows a Push / Pull / Legs / Arms-Shoulders-Abs split with double progression. Plan rules: ' +
      'gain 0.2-0.3 kg per week; if weight does not rise for 2 weeks, add 200 kcal; if it rises more ' +
      'than 0.5 kg per week or the waist grows more than 1 cm per month, cut 150-200 kcal; protein ' +
      '120-140 g per day.',
    `Today is ${today}.`,
    '',
    'Data:',
    digest,
    '',
    `Write in ${LANGUAGE[locale]}, direct and concrete, 250 words at most, using these Markdown ` +
      'sections (## Heading): Summary, Weight, Training (name exercises that stall or progress), ' +
      'Food, What to change this week (2-4 actionable bullets with numbers). Translate the headings. ' +
      'If data is missing, say so in one line and say what to log.',
  ].join('\n');
}
