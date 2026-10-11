import { formatNumber } from '../../components/format';
import type { PlannedExercise } from '../../data/plan';
import { formatDay } from '../../domain/dates';
import {
  heaviest,
  parseRange,
  recommend,
  type PreviousPerformance,
  type Recommendation,
} from '../../domain/progression';
import { useI18n } from '../../i18n/i18n';
import type { Messages } from '../../i18n/en';
import type { DraftSet } from './useWorkoutDraft';

interface ExerciseCardProps {
  exercise: PlannedExercise;
  previous: PreviousPerformance | null;
  sets: DraftSet[];
  onChange: (setIndex: number, field: keyof DraftSet, value: string) => void;
}

/** Renders a `[before, emphasis, after]` message with the middle part in bold. */
function Emphasis({ parts }: { parts: string[] }) {
  const [before, strong, after] = parts;
  return (
    <>
      {before}
      <strong>{strong}</strong>
      {after}
    </>
  );
}

function hint(t: Messages, recommendation: Recommendation, kg: (n: number) => string) {
  switch (recommendation.kind) {
    case 'first-time': {
      const { min, max, unit } = recommendation.range;
      return t.training.hint.firstTime(
        unit === 'seconds'
          ? `${String(max)} s`
          : `${String(min)}-${String(max)} ${t.training.reps}`,
      );
    }
    case 'increase-load':
      return (
        <Emphasis
          parts={t.training.hint.increaseLoad(kg(recommendation.toKg), recommendation.resetTo)}
        />
      );
    case 'add-rep':
      return <Emphasis parts={t.training.hint.addRep(recommendation.target)} />;
    case 'add-time':
      return <Emphasis parts={t.training.hint.addTime(recommendation.seconds)} />;
  }
}

export function ExerciseCard({ exercise, previous, sets, onChange }: ExerciseCardProps) {
  const { t } = useI18n();
  const name = t.exercises[exercise.id];
  const timed = parseRange(exercise.range).unit === 'seconds';
  const lastKg = previous ? heaviest(previous.sets) : 0;
  const kg = (n: number) => formatNumber(n, t.locale, Number.isInteger(n) ? 0 : 1);

  const lastSummary =
    previous &&
    t.training.last(
      formatDay(previous.date, t.locale),
      previous.sets
        .map((s) => (s.kg ? `${kg(s.kg)}×${String(s.reps)}` : String(s.reps)))
        .join(', '),
    );

  return (
    <div className="exercise">
      <div className="exercise__head">
        <h3>{name}</h3>
        <span className="small muted num">
          {exercise.sets} × {exercise.range}
        </span>
      </div>
      <p className="hint">
        {lastSummary && <>{lastSummary} </>}
        {hint(t, recommend(exercise, previous), kg)}
      </p>
      <div className="sets">
        {Array.from({ length: exercise.sets }, (_, i) => {
          const value = sets[i] ?? { kg: '', reps: '' };
          return (
            <div key={i} className="sets__row">
              <span className="sets__n">{i + 1}</span>
              <input
                id={`${exercise.id}-${String(i)}-kg`}
                aria-label={t.training.setLabel(name, i + 1, 'kg')}
                inputMode="decimal"
                disabled={timed}
                placeholder={timed ? '—' : lastKg ? `${kg(lastKg)} kg` : 'kg'}
                value={value.kg}
                onChange={(e) => {
                  onChange(i, 'kg', e.target.value);
                }}
              />
              <input
                id={`${exercise.id}-${String(i)}-reps`}
                aria-label={t.training.setLabel(name, i + 1, timed ? 'seconds' : 'reps')}
                inputMode="numeric"
                placeholder={timed ? t.training.seconds : t.training.reps}
                value={value.reps}
                onChange={(e) => {
                  onChange(i, 'reps', e.target.value);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
