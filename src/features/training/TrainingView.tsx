import { useState } from 'react';
import { parseDecimal } from '../../components/format';
import { useToast } from '../../components/toast-context';
import { ROTATION, ROUTINE_IDS, ROUTINES } from '../../data/plan';
import { db, logWorkout } from '../../db/database';
import { formatDay, toDateKey } from '../../domain/dates';
import { heaviest, lastPerformance, nextRoutineInRotation } from '../../domain/progression';
import { useWorkouts } from '../../hooks/useData';
import { useI18n } from '../../i18n/i18n';
import type { ExerciseLog, RoutineId, Workout } from '../../types';
import { ExerciseCard } from './ExerciseCard';
import { useWorkoutDraft, type WorkoutDraft } from './useWorkoutDraft';

export function TrainingView() {
  const { t } = useI18n();
  const toast = useToast();
  const workouts = useWorkouts();
  const today = toDateKey();
  const suggested = nextRoutineInRotation(workouts, ROTATION);
  const [picked, setPicked] = useState<RoutineId | null>(null);
  const routineId = picked ?? suggested;
  const routine = ROUTINES[routineId];
  const copy = t.routines[routineId];
  const { draft, update, clear } = useWorkoutDraft(routineId, today);

  const save = async () => {
    const exercises = toExerciseLogs(routineId, draft, workouts);
    if (exercises.length === 0) {
      toast(t.training.needSet);
      return;
    }
    await logWorkout({ routine: routineId, exercises });
    clear();
    setPicked(null);
    window.scrollTo(0, 0);
    toast(t.training.saved);
  };

  return (
    <>
      <section className="panel" aria-labelledby="routine-title">
        <div className="row row--between">
          <h2 id="routine-title">{copy.name}</h2>
          <span className="small muted">{t.training.nextUp(t.routines[suggested].name)}</span>
        </div>
        <div className="segmented" role="group" aria-label={t.training.pickRoutine}>
          {ROUTINE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={id === routineId}
              onClick={() => {
                setPicked(id);
              }}
            >
              {t.routines[id].name}
            </button>
          ))}
        </div>
        <p className="small muted">
          {copy.focus}. {t.training.rir}
        </p>
      </section>

      <section className="panel" aria-label={t.training.exercisesOf(copy.name)}>
        {routine.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            previous={lastPerformance(workouts, exercise.id)}
            sets={draft[exercise.id] ?? []}
            onChange={(setIndex, field, value) => {
              update(exercise.id, setIndex, field, value);
            }}
          />
        ))}
      </section>

      <button type="button" className="button button--primary" onClick={() => void save()}>
        {t.training.save}
      </button>

      <section className="panel" aria-labelledby="history-title">
        <h3 id="history-title">{t.training.historyTitle}</h3>
        <WorkoutHistory workouts={workouts.slice(0, 8)} />
      </section>
    </>
  );
}

/**
 * Converts typed inputs into logged sets. A set needs reps; an empty kg field
 * means "same as last time", which is what its placeholder shows.
 */
function toExerciseLogs(
  routineId: RoutineId,
  draft: WorkoutDraft,
  history: Workout[],
): ExerciseLog[] {
  return ROUTINES[routineId].exercises.flatMap((exercise) => {
    const previous = lastPerformance(history, exercise.id);
    const fallbackKg = previous ? heaviest(previous.sets) : 0;
    const sets = (draft[exercise.id] ?? []).slice(0, exercise.sets).flatMap((set) => {
      const reps = parseDecimal(set.reps);
      if (reps === null) return [];
      return [{ kg: parseDecimal(set.kg) ?? fallbackKg, reps }];
    });
    return sets.length > 0 ? [{ exerciseId: exercise.id, range: exercise.range, sets }] : [];
  });
}

function WorkoutHistory({ workouts }: { workouts: Workout[] }) {
  const { t } = useI18n();

  if (workouts.length === 0) {
    return <p className="small muted">{t.training.historyEmpty}</p>;
  }
  return (
    <ul className="list">
      {workouts.map((workout) => {
        const day = formatDay(workout.date, t.locale);
        const totalSets = workout.exercises.reduce((n, e) => n + e.sets.length, 0);
        return (
          <li key={workout.id} className="item">
            <div className="item__main">
              {day} · <strong>{t.routines[workout.routine].name}</strong>
              <div className="small muted">
                {workout.exercises
                  .map(
                    (e) =>
                      `${t.exercises[e.exerciseId]}: ` +
                      e.sets.map((s) => `${String(s.kg)}×${String(s.reps)}`).join('/'),
                  )
                  .join(' · ')}
              </div>
            </div>
            <div className="item__value small num">{t.training.sets(totalSets)}</div>
            <button
              type="button"
              className="icon-button"
              aria-label={t.training.deleteSession(day)}
              onClick={() => {
                if (workout.id !== undefined) void db.workouts.delete(workout.id);
              }}
            >
              ×
            </button>
          </li>
        );
      })}
    </ul>
  );
}
