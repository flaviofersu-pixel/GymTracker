import { useCallback, useState } from 'react';
import type { ExerciseId } from '../../data/plan';
import type { DateKey, RoutineId } from '../../types';

export interface DraftSet {
  kg: string;
  reps: string;
}

/** Inputs typed so far, keyed by exercise, then by set index. */
export type WorkoutDraft = Partial<Record<ExerciseId, DraftSet[]>>;

const storageKey = (routine: RoutineId, date: DateKey) => `workout-draft:${routine}:${date}`;

function read(key: string): WorkoutDraft {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as WorkoutDraft) : {};
  } catch {
    return {};
  }
}

function write(key: string, draft: WorkoutDraft): void {
  try {
    localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Storage can be full or blocked; the draft then only lives in memory.
  }
}

/**
 * Keeps half-finished sessions across reloads, so closing the app between
 * sets never loses what was typed.
 */
export function useWorkoutDraft(routine: RoutineId, date: DateKey) {
  const key = storageKey(routine, date);
  const [state, setState] = useState(() => ({ key, draft: read(key) }));
  // Switching routine swaps in that routine's saved draft during render.
  const current = state.key === key ? state : { key, draft: read(key) };
  if (current !== state) setState(current);

  const update = useCallback(
    (exercise: ExerciseId, setIndex: number, field: keyof DraftSet, value: string) => {
      setState((prev) => {
        const sets = [...(prev.draft[exercise] ?? [])];
        sets[setIndex] = { ...(sets[setIndex] ?? { kg: '', reps: '' }), [field]: value };
        const draft = { ...prev.draft, [exercise]: sets };
        write(prev.key, draft);
        return { ...prev, draft };
      });
    },
    [],
  );

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
    setState({ key, draft: {} });
  }, [key]);

  return { draft: current.draft, update, clear };
}
