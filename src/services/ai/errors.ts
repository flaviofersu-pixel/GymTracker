export type AiErrorCode =
  | 'missingKey'
  | 'invalidKey'
  | 'permission'
  | 'rateLimited'
  | 'offline'
  | 'service'
  | 'refused'
  | 'photo'
  | 'unknown';

/** Every AI failure reaches the UI as one of these, so it can show a translated, actionable message. */
export class AiError extends Error {
  readonly code: AiErrorCode;

  constructor(code: AiErrorCode, options?: ErrorOptions) {
    super(code, options);
    this.name = 'AiError';
    this.code = code;
  }
}

export const errorCode = (error: unknown): AiErrorCode =>
  error instanceof AiError ? error.code : 'unknown';
