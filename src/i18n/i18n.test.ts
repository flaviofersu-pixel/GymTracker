import { describe, expect, it } from 'vitest';
import { en } from './en';
import { es } from './es';
import { nl } from './nl';

/** Every key path in a messages object, e.g. `today.left`. */
function keyPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('translations', () => {
  it.each([
    ['Spanish', es],
    ['Dutch', nl],
  ])('%s covers exactly the same keys as English', (_name, messages) => {
    expect(keyPaths(messages).sort()).toEqual(keyPaths(en).sort());
  });

  it('has no empty strings', () => {
    for (const messages of [en, es, nl]) {
      const empty = keyPaths(messages).filter((path) => {
        const value = path
          .split('.')
          .reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], messages);
        return value === '';
      });
      expect(empty).toEqual([]);
    }
  });
});
