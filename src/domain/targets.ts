import type { Activity, Goal, Profile } from '../types';

/** Daily movement outside the gym, as a multiplier on resting energy. */
const ACTIVITY_FACTOR: Record<Activity, number> = { low: 1.2, moderate: 1.35, high: 1.5 };
/** Extra multiplier per weekly training session. */
const PER_SESSION_FACTOR = 0.025;

const KCAL_ADJUSTMENT: Record<Goal, number> = { gain: 300, maintain: 0, lose: -450 };
/** Grams of protein per kg of body weight. */
const PROTEIN_PER_KG: Record<Goal, number> = { gain: 2, maintain: 1.8, lose: 2.2 };

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

/** Resting energy expenditure with the Mifflin-St Jeor equation, in kcal. */
export function restingEnergy(p: Pick<Profile, 'sex' | 'age' | 'heightCm' | 'startWeightKg'>) {
  const base = 10 * p.startWeightKg + 6.25 * p.heightCm - 5 * p.age;
  return base + (p.sex === 'male' ? 5 : -161);
}

export function maintenanceCalories(p: Profile): number {
  const factor = ACTIVITY_FACTOR[p.activity] + PER_SESSION_FACTOR * p.trainingDays;
  return restingEnergy(p) * factor;
}

export interface Targets {
  kcalTarget: number;
  proteinTarget: number;
}

/** When losing, protein is based on the goal weight so extra body fat does not inflate it. */
function proteinReferenceWeight(p: Pick<Profile, 'goal' | 'startWeightKg' | 'goalWeightKg'>) {
  return p.goal === 'lose' ? Math.min(p.startWeightKg, p.goalWeightKg) : p.startWeightKg;
}

/** A starting point; the weekly weight trend tells the person how to adjust it. */
export function recommendedTargets(p: Profile): Targets {
  const kcal = maintenanceCalories(p) + KCAL_ADJUSTMENT[p.goal];
  return {
    kcalTarget: roundTo(Math.max(kcal, 1200), 50),
    proteinTarget: roundTo(proteinReferenceWeight(p) * PROTEIN_PER_KG[p.goal], 5),
  };
}

export interface PaceRange {
  /** Lowest weekly change in kg that counts as on track. */
  min: number;
  max: number;
}

/**
 * Healthy weekly weight change for the goal: 0.25-0.5% of body weight when
 * gaining, 0.5-1% when losing, and within ±0.2 kg when maintaining.
 */
export function targetPace(p: Pick<Profile, 'goal' | 'startWeightKg'>): PaceRange {
  const w = p.startWeightKg;
  const round = (n: number) => Math.round(n * 20) / 20;
  switch (p.goal) {
    case 'gain':
      return { min: round(w * 0.0025), max: round(w * 0.005) };
    case 'lose':
      return { min: round(-w * 0.01), max: round(-w * 0.005) };
    case 'maintain':
      return { min: -0.2, max: 0.2 };
  }
}
