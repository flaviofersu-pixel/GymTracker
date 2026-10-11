import { describe, expect, it } from 'vitest';
import { AiError } from './errors';
import { parseReply, replyFormat } from './manual';

const meal = {
  name: 'Tuna pasta',
  items: [{ food: 'pasta', amount: '1 plate', kcal: 600, proteinG: 20 }],
  kcal: 820,
  proteinG: 48,
  carbsG: 90,
  fatG: 25,
  confidence: 'medium',
  note: 'The oil matters most.',
};

describe('manual replies', () => {
  it('asks for JSON that matches the schema', () => {
    expect(replyFormat('meal')).toContain('"confidence"');
  });

  it('reads JSON wrapped in a code fence and prose', () => {
    const reply = `Here you go:\n\`\`\`json\n${JSON.stringify(meal)}\n\`\`\`\nEnjoy!`;
    expect(parseReply('meal', reply).kcal).toBe(820);
  });

  it('rejects replies that are not the expected shape', () => {
    expect(() => parseReply('suggestions', '{"options": "none"}')).toThrow(AiError);
    expect(() => parseReply('meal', 'Sorry, I cannot see the photo.')).toThrow(AiError);
  });
});
