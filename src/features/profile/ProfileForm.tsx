import { useId, useState } from 'react';
import { Choice } from '../../components/Choice';
import { parseDecimal } from '../../components/format';
import { useToast } from '../../components/toast-context';
import {
  ROUTINE_IDS,
  SPLITS,
  SPLIT_PRESETS,
  SPLIT_PRESET_IDS,
  TRAINING_DAY_OPTIONS,
  rotationFor,
  type SplitPresetId,
} from '../../data/plan';
import { saveProfile } from '../../db/database';
import { recommendedTargets } from '../../domain/targets';
import { useI18n } from '../../i18n/i18n';
import type { Activity, Goal, Profile, RoutineId, Settings, Sex } from '../../types';

const SEXES: readonly Sex[] = ['male', 'female'];
const GOALS: readonly Goal[] = ['gain', 'maintain', 'lose'];
const ACTIVITIES: readonly Activity[] = ['low', 'moderate', 'high'];

/** Follow the recommendation for the training days, pick a common split, or build one. */
type RotationMode = 'recommended' | SplitPresetId | 'custom';
/** Only splits that train each routine at least once a week, so nothing waits over a week. */
const rotationModesFor = (days: number): RotationMode[] => [
  'recommended',
  ...SPLIT_PRESET_IDS.filter((id) => SPLIT_PRESETS[id].length <= days),
  'custom',
];

type NumberField = 'age' | 'heightCm' | 'startWeightKg' | 'goalWeightKg';
type Choices = Pick<Profile, 'sex' | 'goal' | 'activity' | 'trainingDays'>;

/** Form values: choices as typed values, numbers as the strings being edited. */
interface Form extends Choices, Record<NumberField | 'kcalTarget' | 'proteinTarget', string> {
  rotationMode: RotationMode;
  /** The routines picked so far for a custom split, in training order. */
  customRotation: RoutineId[];
}

const sameRoutines = (a: readonly RoutineId[], b: readonly RoutineId[]) =>
  a.length === b.length && a.every((id, i) => id === b[i]);

function toRotationMode(rotation: readonly RoutineId[] | undefined): RotationMode {
  if (!rotation?.length) return 'recommended';
  return SPLIT_PRESET_IDS.find((id) => sameRoutines(SPLIT_PRESETS[id], rotation)) ?? 'custom';
}

/** The routines the form's split choice rotates through, which may be empty while building one. */
function formRotation(form: Form): readonly RoutineId[] {
  switch (form.rotationMode) {
    case 'recommended':
      return SPLITS[form.trainingDays];
    case 'custom':
      return form.customRotation;
    default:
      return SPLIT_PRESETS[form.rotationMode];
  }
}

/** Plausible ranges, so a typo cannot produce nonsense targets. */
const LIMITS: Record<NumberField, [number, number]> = {
  age: [14, 100],
  heightCm: [120, 230],
  startWeightKg: [35, 250],
  goalWeightKg: [35, 250],
};

function toForm(s: Settings): Form {
  return {
    sex: s.sex,
    goal: s.goal,
    activity: s.activity,
    trainingDays: s.trainingDays,
    age: String(s.age),
    heightCm: String(s.heightCm),
    startWeightKg: String(s.startWeightKg),
    goalWeightKg: String(s.goalWeightKg),
    kcalTarget: String(s.kcalTarget),
    proteinTarget: String(s.proteinTarget),
    rotationMode: toRotationMode(s.rotation),
    customRotation: [...rotationFor(s)],
  };
}

/** The profile the form describes, or null while any number is missing or out of range. */
function toProfile(form: Form): Profile | null {
  const numbers = {} as Record<NumberField, number>;
  for (const field of Object.keys(LIMITS) as NumberField[]) {
    const value = parseDecimal(form[field]);
    const [min, max] = LIMITS[field];
    if (value === null || value < min || value > max) return null;
    numbers[field] = value;
  }
  const { sex, goal, activity, trainingDays } = form;
  return {
    sex,
    goal,
    activity,
    trainingDays,
    ...numbers,
    goalWeightKg: goal === 'maintain' ? numbers.startWeightKg : numbers.goalWeightKg,
  };
}

/** Recomputes the recommended targets whenever a profile field changes. */
function withTargets(form: Form): Form {
  const profile = toProfile(form);
  if (!profile) return form;
  const targets = recommendedTargets(profile);
  return {
    ...form,
    kcalTarget: String(targets.kcalTarget),
    proteinTarget: String(targets.proteinTarget),
  };
}

interface ProfileFormProps {
  settings: Settings;
  submitLabel: string;
  onSaved?: () => void;
}

export function ProfileForm({ settings, submitLabel, onSaved }: ProfileFormProps) {
  const { t } = useI18n();
  const p = t.profile;
  const toast = useToast();
  const id = useId();
  const [form, setForm] = useState(() => toForm(settings));
  const routineNames = (ids: readonly RoutineId[]) =>
    ids.map((r) => t.routines[r].name).join(' → ');

  const change = (patch: Partial<Form>) => {
    setForm((prev) => withTargets({ ...prev, ...patch }));
  };

  const numberField = (name: NumberField | 'kcalTarget' | 'proteinTarget', label: string) => (
    <label className="field grow" htmlFor={`${id}-${name}`}>
      {label}
      <input
        id={`${id}-${name}`}
        inputMode={name === 'startWeightKg' || name === 'goalWeightKg' ? 'decimal' : 'numeric'}
        value={form[name]}
        onChange={(e) => {
          const value = e.target.value;
          // Targets are the person's own override, so editing them does not trigger a recompute.
          if (name === 'kcalTarget' || name === 'proteinTarget') {
            setForm((prev) => ({ ...prev, [name]: value }));
          } else {
            change({ [name]: value });
          }
        }}
      />
    </label>
  );

  const save = async () => {
    const profile = toProfile(form);
    const kcalTarget = parseDecimal(form.kcalTarget);
    const proteinTarget = parseDecimal(form.proteinTarget);
    if (!profile || !kcalTarget || kcalTarget < 1000 || !proteinTarget) {
      toast(p.invalid);
      return;
    }
    const rotation = formRotation(form);
    if (rotation.length === 0) {
      toast(p.customEmpty);
      return;
    }
    await saveProfile({
      ...profile,
      // Left unset, the split keeps following the recommendation if the training days change.
      rotation: form.rotationMode === 'recommended' ? undefined : [...rotation],
      kcalTarget: Math.round(kcalTarget),
      proteinTarget: Math.round(proteinTarget),
    });
    toast(p.saved);
    onSaved?.();
  };

  return (
    <>
      <div className="row">
        {numberField('age', p.age)}
        {numberField('heightCm', p.height)}
        {numberField('startWeightKg', p.weight)}
      </div>
      <Choice
        label={p.sex}
        options={SEXES}
        value={form.sex}
        render={(sex) => p.sexes[sex]}
        onChange={(sex) => {
          change({ sex });
        }}
      />
      <Choice
        label={p.goal}
        options={GOALS}
        value={form.goal}
        render={(goal) => p.goals[goal]}
        onChange={(goal) => {
          change({ goal });
        }}
      />
      {form.goal !== 'maintain' && (
        <div className="row">{numberField('goalWeightKg', p.goalWeight)}</div>
      )}
      <div className="stack-sm">
        <Choice
          label={p.activity}
          options={ACTIVITIES}
          value={form.activity}
          render={(activity) => p.activities[activity]}
          onChange={(activity) => {
            change({ activity });
          }}
        />
        <p className="small muted">{p.activityHint[form.activity]}</p>
      </div>
      <div className="stack-sm">
        <Choice
          label={p.days}
          options={TRAINING_DAY_OPTIONS}
          value={form.trainingDays}
          render={String}
          onChange={(trainingDays) => {
            // A split with more routines than training days no longer fits, so go back to the recommendation.
            const fits = formRotation(form).length <= trainingDays;
            change({ trainingDays, ...(!fits && { rotationMode: 'recommended' as const }) });
          }}
        />
        <p className="small muted">
          {p.recommendedSplit(form.trainingDays, routineNames(SPLITS[form.trainingDays]))}
        </p>
      </div>
      <div className="stack-sm">
        <Choice
          label={p.rotation}
          options={rotationModesFor(form.trainingDays)}
          value={form.rotationMode}
          render={(mode) => p.rotations[mode]}
          wrap
          onChange={(rotationMode) => {
            // Start a custom split from the one shown, so it can be tweaked rather than rebuilt.
            setForm((prev) => ({
              ...prev,
              rotationMode,
              ...(rotationMode === 'custom' && { customRotation: [...formRotation(prev)] }),
            }));
          }}
        />
        {form.rotationMode === 'custom' && (
          <>
            <p className="small muted">{p.customHint(form.trainingDays)}</p>
            <div className="chips" role="group" aria-label={p.rotations.custom}>
              {ROUTINE_IDS.map((routine) => (
                <button
                  key={routine}
                  type="button"
                  className="chip"
                  aria-pressed={form.customRotation.includes(routine)}
                  disabled={
                    !form.customRotation.includes(routine) &&
                    form.customRotation.length >= form.trainingDays
                  }
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      customRotation: prev.customRotation.includes(routine)
                        ? prev.customRotation.filter((r) => r !== routine)
                        : [...prev.customRotation, routine],
                    }));
                  }}
                >
                  {t.routines[routine].name}
                </button>
              ))}
            </div>
          </>
        )}
        {form.rotationMode !== 'recommended' && formRotation(form).length > 0 && (
          <p className="small">{p.split(routineNames(formRotation(form)))}</p>
        )}
      </div>

      <h3>{p.targets}</h3>
      <div className="row">
        {numberField('kcalTarget', p.kcal)}
        {numberField('proteinTarget', p.protein)}
      </div>
      <p className="small muted">{p.targetsHint}</p>

      <button type="button" className="button button--primary" onClick={() => void save()}>
        {submitLabel}
      </button>
    </>
  );
}
