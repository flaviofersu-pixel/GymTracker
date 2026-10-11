import { useId, useState } from 'react';
import { Choice } from '../../components/Choice';
import { parseDecimal } from '../../components/format';
import { useToast } from '../../components/toast-context';
import { SPLITS, TRAINING_DAY_OPTIONS } from '../../data/plan';
import { saveProfile } from '../../db/database';
import { recommendedTargets } from '../../domain/targets';
import { useI18n } from '../../i18n/i18n';
import type { Activity, Goal, Profile, Settings, Sex } from '../../types';

const SEXES: readonly Sex[] = ['male', 'female'];
const GOALS: readonly Goal[] = ['gain', 'maintain', 'lose'];
const ACTIVITIES: readonly Activity[] = ['low', 'moderate', 'high'];

type NumberField = 'age' | 'heightCm' | 'startWeightKg' | 'goalWeightKg';
type Choices = Pick<Profile, 'sex' | 'goal' | 'activity' | 'trainingDays'>;

/** Form values: choices as typed values, numbers as the strings being edited. */
interface Form extends Choices, Record<NumberField | 'kcalTarget' | 'proteinTarget', string> {}

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
    await saveProfile({
      ...profile,
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
            change({ trainingDays });
          }}
        />
        <p className="small muted">
          {p.split(SPLITS[form.trainingDays].map((r) => t.routines[r].name).join(' → '))}
        </p>
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
