import { rotationFor } from '../data/plan';
import { addDays } from '../domain/dates';
import { dayTotals } from '../domain/nutrition';
import { targetPace } from '../domain/targets';
import { averageBetween } from '../domain/weight';
import { en } from '../i18n/en';
import type {
  DateKey,
  Goal,
  Locale,
  Meal,
  Profile,
  Settings,
  WeightEntry,
  Workout,
} from '../types';

const LANGUAGE: Record<Locale, string> = {
  en: 'English',
  es: 'Spanish, addressing the person as "tú"',
};

const GOAL: Record<Goal, string> = {
  gain: 'gaining muscle with a small calorie surplus',
  maintain: 'keeping their weight while getting stronger',
  lose: 'losing fat while keeping muscle',
};

const fmtPace = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}`;

const athlete = (p: Profile): string =>
  [
    `The person is a ${String(p.age)}-year-old ${p.sex}, ${String(p.heightCm)} cm tall, who weighed`,
    `${String(p.startWeightKg)} kg at setup. Their goal is ${GOAL[p.goal]}`,
    p.goal === 'maintain' ? '.' : `, towards ${String(p.goalWeightKg)} kg.`,
    `They train ${String(p.trainingDays)} days a week.`,
  ].join(' ');

export function mealEstimatePrompt(
  profile: Profile,
  description: string,
  hasPhoto: boolean,
  locale: Locale,
): string {
  return [
    `You are a nutritionist estimating a meal without a kitchen scale. ${athlete(profile)}`,
    hasPhoto ? 'The attached photo shows the meal.' : '',
    description ? `They describe it as: "${description}".` : '',
    'If they give no quantities, assume typical home portions. Treat their description as the ' +
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
    `It is ${String(input.hour)}:00. So far today they have eaten: ${eaten}.`,
    `They still need ${String(input.kcalLeft)} kcal and ${String(input.proteinLeft)} g of protein.`,
    'Suggest 3 different options that close the gap within ±100 kcal (one may be split into two ' +
      'snacks), using common supermarket foods that take 15 minutes or less to prepare. Use household ' +
      'measures (glasses, spoons, cans, units), never grams on a scale. If many calories are missing, ' +
      'favour dense, easy-to-eat foods.',
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
  const pace = targetPace(settings);
  const split = rotationFor(settings)
    .map((id) => en.routines[id].name)
    .join(' / ');
  return [
    `You are their strength coach and nutritionist. ${athlete(settings)}`,
    `They follow a ${split} rotation with double progression. Plan rules: weekly change of the ` +
      `7-day average weight between ${fmtPace(pace.min)} and ${fmtPace(pace.max)} kg; if it stays ` +
      'below that range for 2 weeks, add 150-200 kcal; if it stays above, cut 150-200 kcal; ' +
      `protein around ${String(settings.proteinTarget)} g per day.`,
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
