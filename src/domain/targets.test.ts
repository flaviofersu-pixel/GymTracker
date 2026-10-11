import { describe, expect, it } from 'vitest';
import type { Profile } from '../types';
import { recommendedTargets, restingEnergy, targetPace } from './targets';

const profile: Profile = {
  sex: 'male',
  age: 25,
  heightCm: 178,
  startWeightKg: 62,
  goal: 'gain',
  goalWeightKg: 70,
  activity: 'moderate',
  trainingDays: 4,
};

describe('restingEnergy', () => {
  it('uses Mifflin-St Jeor', () => {
    expect(restingEnergy(profile)).toBe(1612.5);
    expect(restingEnergy({ ...profile, sex: 'female' })).toBe(1446.5);
  });
});

describe('recommendedTargets', () => {
  it('adds a surplus and enough protein to gain muscle', () => {
    expect(recommendedTargets(profile)).toEqual({ kcalTarget: 2650, proteinTarget: 125 });
  });

  it('bases protein on the goal weight when losing', () => {
    const lose = { ...profile, goal: 'lose', startWeightKg: 90, goalWeightKg: 75 } as const;
    expect(recommendedTargets(lose).proteinTarget).toBe(165);
  });

  it('eats less to lose fat and more when training more', () => {
    const lose = recommendedTargets({ ...profile, goal: 'lose' });
    const maintain = recommendedTargets({ ...profile, goal: 'maintain' });
    const moreDays = recommendedTargets({ ...profile, goal: 'maintain', trainingDays: 6 });
    expect(lose.kcalTarget).toBeLessThan(maintain.kcalTarget);
    expect(moreDays.kcalTarget).toBeGreaterThan(maintain.kcalTarget);
  });

  it('never goes below a safe floor', () => {
    const small = { ...profile, sex: 'female', age: 70, heightCm: 150, startWeightKg: 40 } as const;
    expect(recommendedTargets({ ...small, goal: 'lose', activity: 'low' }).kcalTarget).toBe(1200);
  });
});

describe('targetPace', () => {
  it('scales with body weight and points the right way', () => {
    expect(targetPace({ goal: 'gain', startWeightKg: 62 })).toEqual({ min: 0.15, max: 0.3 });
    expect(targetPace({ goal: 'lose', startWeightKg: 90 })).toEqual({ min: -0.9, max: -0.45 });
    expect(targetPace({ goal: 'maintain', startWeightKg: 90 })).toEqual({ min: -0.2, max: 0.2 });
  });
});
