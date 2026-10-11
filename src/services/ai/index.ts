/**
 * Public entry point for the AI features. The Anthropic SDK and Zod are only
 * downloaded the first time one of these functions runs, which keeps them out
 * of the initial bundle.
 */
import type * as Client from './client';

export { AiError, errorCode, type AiErrorCode } from './errors';
export type { MealEstimate, MealSuggestion } from './schemas';

const load = () => import('./client');

export const estimateMeal: typeof Client.estimateMeal = async (...args) =>
  (await load()).estimateMeal(...args);

export const suggestMeals: typeof Client.suggestMeals = async (...args) =>
  (await load()).suggestMeals(...args);

export const analyzeProgress: typeof Client.analyzeProgress = async (...args) =>
  (await load()).analyzeProgress(...args);
