import { z } from 'zod';
import { AiError } from './errors';
import { mealEstimateSchema, suggestionSchema } from './schemas';

/**
 * Support for using the AI without an API key: the person pastes the prompt into
 * Claude themselves (for example with a Claude Pro plan) and pastes the reply back.
 */
const SCHEMAS = { meal: mealEstimateSchema, suggestions: suggestionSchema } as const;

export type ManualKind = keyof typeof SCHEMAS;
export type ManualReply<K extends ManualKind> = z.infer<(typeof SCHEMAS)[K]>;

/** Asks for a reply the app can read back, since there is no structured-output guarantee here. */
export function replyFormat(kind: ManualKind): string {
  const schema = JSON.stringify(z.toJSONSchema(SCHEMAS[kind]));
  return (
    'Reply with only one JSON object, no other text, that matches this JSON Schema ' +
    `(numbers as plain numbers): ${schema}`
  );
}

/** Reads the JSON object out of a pasted reply, tolerating code fences or text around it. */
export function parseReply<K extends ManualKind>(kind: K, reply: string): ManualReply<K> {
  const start = reply.indexOf('{');
  const end = reply.lastIndexOf('}');
  try {
    if (start < 0 || end < start) throw new Error('No JSON object in the reply');
    return SCHEMAS[kind].parse(JSON.parse(reply.slice(start, end + 1))) as ManualReply<K>;
  } catch (error) {
    throw new AiError('badReply', { cause: error });
  }
}
