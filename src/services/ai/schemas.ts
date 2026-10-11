import { z } from 'zod';

export const mealEstimateSchema = z.object({
  name: z.string().describe('Short name of the dish'),
  items: z.array(
    z.object({
      food: z.string(),
      amount: z.string().describe('Household measure, e.g. "1 plate" or "~150 g"'),
      kcal: z.number(),
      proteinG: z.number(),
    }),
  ),
  kcal: z.number(),
  proteinG: z.number(),
  carbsG: z.number(),
  fatG: z.number(),
  confidence: z.enum(['high', 'medium', 'low']),
  note: z.string(),
});
export type MealEstimate = z.infer<typeof mealEstimateSchema>;

export const suggestionSchema = z.object({
  options: z.array(
    z.object({
      name: z.string(),
      how: z.string().describe('One or two sentences with household quantities'),
      kcal: z.number(),
      proteinG: z.number(),
      minutes: z.number(),
    }),
  ),
});
export type MealSuggestion = z.infer<typeof suggestionSchema>['options'][number];
