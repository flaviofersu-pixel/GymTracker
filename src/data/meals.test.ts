import { describe, expect, it } from 'vitest';
import { en } from '../i18n/en';
import { MEAL_CATEGORIES, MEAL_IDEAS } from './meals';

describe('meal ideas', () => {
  it('has 20 options in every category', () => {
    for (const category of MEAL_CATEGORIES) {
      expect(MEAL_IDEAS.filter((idea) => idea.category === category)).toHaveLength(20);
    }
  });

  it('uses each id once, so photos and translations match one meal', () => {
    const ids = MEAL_IDEAS.map((idea) => idea.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('lists the ingredients of every meal', () => {
    for (const idea of MEAL_IDEAS) {
      expect(en.mealIdeas[idea.id].ingredients.length).toBeGreaterThan(0);
    }
  });
});
