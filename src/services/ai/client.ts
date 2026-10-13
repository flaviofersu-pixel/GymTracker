import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import type { BetaContentBlockParam } from '@anthropic-ai/sdk/resources/beta/messages/messages';
import { AiError } from './errors';
import { encodePhoto } from './image';
import {
  mealEstimateSchema,
  suggestionSchema,
  type MealEstimate,
  type MealSuggestion,
} from './schemas';

/** Each task uses the cheapest model that handles it well. */
const MODELS = {
  /** Quick meal ideas that fill a calorie and protein gap. */
  suggestions: 'claude-haiku-5-5',
  /** Portion and calorie estimates from a description or photo. */
  meal: 'claude-sonnet-5-5',
  /** The weekly review reasons over weeks of logs, so it gets the strongest model. */
  review: 'claude-opus-5-5',
} as const;

/**
 * On a policy decline the API re-runs the request on a suitable fallback model.
 * Haiku has no server-side fallback, so suggestions are sent without it.
 */
const fallback = () => ({
  betas: ['server-side-fallback-2026-07-01'],
  fallbacks: 'default' as const,
});

function createClient(apiKey: string): Anthropic {
  if (!apiKey) throw new AiError('missingKey');
  // The key belongs to the person using the app and only ever travels to the Anthropic API.
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

function toAiError(error: unknown): AiError {
  if (error instanceof AiError) return error;
  const options = { cause: error };
  if (error instanceof Anthropic.AuthenticationError) return new AiError('invalidKey', options);
  if (error instanceof Anthropic.PermissionDeniedError) return new AiError('permission', options);
  if (error instanceof Anthropic.RateLimitError) return new AiError('rateLimited', options);
  if (error instanceof Anthropic.APIConnectionError) return new AiError('offline', options);
  if (error instanceof Anthropic.APIError) return new AiError('service', options);
  return new AiError('unknown', options);
}

/** Runs a request and rethrows any failure as an {@link AiError}. */
async function request<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    throw toAiError(error);
  }
}

export function estimateMeal(
  apiKey: string,
  prompt: string,
  photo: Blob | null,
): Promise<MealEstimate> {
  return request(async () => {
    const client = createClient(apiKey);
    const content: BetaContentBlockParam[] = [];
    if (photo) {
      const image = await encodePhoto(photo).catch((error: unknown) => {
        throw new AiError('photo', { cause: error });
      });
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: image.mediaType, data: image.base64 },
      });
    }
    content.push({ type: 'text', text: prompt });

    const response = await client.beta.messages.parse({
      ...fallback(),
      model: MODELS.meal,
      max_tokens: 16000,
      output_config: { effort: 'low', format: betaZodOutputFormat(mealEstimateSchema) },
      messages: [{ role: 'user', content }],
    });
    if (response.stop_reason === 'refusal' || !response.parsed_output) {
      throw new AiError('refused');
    }
    return response.parsed_output;
  });
}

export function suggestMeals(apiKey: string, prompt: string): Promise<MealSuggestion[]> {
  return request(async () => {
    const response = await createClient(apiKey).beta.messages.parse({
      model: MODELS.suggestions,
      max_tokens: 16000,
      output_config: { effort: 'low', format: betaZodOutputFormat(suggestionSchema) },
      messages: [{ role: 'user', content: prompt }],
    });
    if (response.stop_reason === 'refusal' || !response.parsed_output) {
      throw new AiError('refused');
    }
    return response.parsed_output.options;
  });
}

/** Streams the weekly review, calling `onText` with the full text so far. */
export function analyzeProgress(
  apiKey: string,
  prompt: string,
  onText: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  return request(async () => {
    const stream = createClient(apiKey).beta.messages.stream(
      {
        ...fallback(),
        model: MODELS.review,
        max_tokens: 64000,
        output_config: { effort: 'medium' },
        messages: [{ role: 'user', content: prompt }],
      },
      { signal },
    );
    stream.on('text', (_delta, snapshot) => {
      onText(snapshot);
    });
    const message = await stream.finalMessage();
    if (message.stop_reason === 'refusal') throw new AiError('refused');
    return message.content.flatMap((block) => (block.type === 'text' ? [block.text] : [])).join('');
  });
}
