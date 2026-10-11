import { useId, useState } from 'react';
import { parseDecimal } from '../../components/format';
import { useToast } from '../../components/toast-context';
import { logMeal } from '../../db/database';
import { useI18n } from '../../i18n/i18n';
import type { MealEstimate } from '../../services/ai';
import type { MealSource } from '../../types';

/** A meal being reviewed before it is saved. Numbers stay strings while the person edits them. */
export interface MealDraft {
  name: string;
  details: string;
  kcal: string;
  proteinG: string;
  carbsG?: number;
  fatG?: number;
  confidence?: MealEstimate['confidence'];
  note?: string;
  items?: MealEstimate['items'];
  source: MealSource;
}

const CONFIDENCE_TONE = { high: 'ok', medium: 'warn', low: 'bad' } as const;

interface MealReviewProps {
  draft: MealDraft;
  onCancel: () => void;
  onSaved: () => void;
}

export function MealReview({ draft: initial, onCancel, onSaved }: MealReviewProps) {
  const { t } = useI18n();
  const toast = useToast();
  const id = useId();
  const [draft, setDraft] = useState(initial);

  const save = async () => {
    const kcal = parseDecimal(draft.kcal);
    if (kcal === null) {
      toast(t.review.needKcal);
      return;
    }
    await logMeal({
      name: draft.name.trim() || t.review.defaultName,
      details: draft.details,
      kcal,
      proteinG: parseDecimal(draft.proteinG) ?? 0,
      carbsG: draft.carbsG,
      fatG: draft.fatG,
      source: draft.source,
    });
    onSaved();
  };

  return (
    <div className="review">
      {draft.items && draft.items.length > 0 && (
        <ul className="small review__items">
          {draft.items.map((item) => (
            <li key={item.food}>
              {item.food} <span className="muted">({item.amount})</span> ·{' '}
              <span className="num">{Math.round(item.kcal)}</span> kcal
            </li>
          ))}
        </ul>
      )}
      {draft.note && <p className="small muted">{draft.note}</p>}
      <label className="field" htmlFor={`${id}-name`}>
        {t.review.name}
        <input
          id={`${id}-name`}
          value={draft.name}
          onChange={(e) => {
            setDraft({ ...draft, name: e.target.value });
          }}
        />
      </label>
      <div className="row">
        <label className="field grow" htmlFor={`${id}-kcal`}>
          {t.review.kcal}
          <input
            id={`${id}-kcal`}
            inputMode="numeric"
            value={draft.kcal}
            onChange={(e) => {
              setDraft({ ...draft, kcal: e.target.value });
            }}
          />
        </label>
        <label className="field grow" htmlFor={`${id}-protein`}>
          {t.review.protein}
          <input
            id={`${id}-protein`}
            inputMode="numeric"
            value={draft.proteinG}
            onChange={(e) => {
              setDraft({ ...draft, proteinG: e.target.value });
            }}
          />
        </label>
      </div>
      {draft.confidence && (
        <p className="small">
          {t.review.confidence}{' '}
          <span className={`pill ${CONFIDENCE_TONE[draft.confidence]}`}>
            {t.review.confidenceLevel[draft.confidence]}
          </span>
        </p>
      )}
      <div className="row">
        <button type="button" className="button button--primary grow" onClick={() => void save()}>
          {t.review.save}
        </button>
        <button type="button" className="button button--ghost" onClick={onCancel}>
          {t.review.cancel}
        </button>
      </div>
    </div>
  );
}
