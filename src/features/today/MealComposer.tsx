import { useId, useRef, useState } from 'react';
import { useToast } from '../../components/toast-context';
import { MEAL_PRESETS, type MealPreset } from '../../data/plan';
import { logMeal } from '../../db/database';
import { useI18n } from '../../i18n/i18n';
import { errorCode, estimateMeal, type MealEstimate } from '../../services/ai';
import { mealEstimatePrompt } from '../../services/prompts';
import type { MealSource, Settings } from '../../types';
import { MealReview, type MealDraft } from './MealReview';

export function MealComposer({ settings }: { settings: Settings }) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const id = useId();
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [draft, setDraft] = useState<MealDraft | null>(null);
  // Remounts the review form whenever a new draft arrives, so it starts from fresh values.
  const [draftVersion, setDraftVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);

  const openDraft = (next: MealDraft) => {
    setDraft(next);
    setDraftVersion((v) => v + 1);
  };

  const reset = () => {
    setDescription('');
    setPhoto(null);
    setDraft(null);
    if (photoInput.current) photoInput.current.value = '';
  };

  const estimate = async () => {
    if (!description.trim() && !photo) {
      toast(t.composer.needInput);
      return;
    }
    setBusy(true);
    try {
      const prompt = mealEstimatePrompt(settings, description.trim(), photo !== null, locale);
      const result = await estimateMeal(settings.apiKey, prompt, photo);
      openDraft(fromEstimate(result, photo ? 'photo' : 'text'));
    } catch (error) {
      toast(t.errors[errorCode(error)]);
    } finally {
      setBusy(false);
    }
  };

  const addPreset = async (preset: MealPreset) => {
    const { name, details } = t.presets[preset.id];
    await logMeal({
      name,
      details,
      kcal: preset.kcal,
      proteinG: preset.proteinG,
      source: 'preset',
    });
    toast(t.composer.added(preset.kcal));
  };

  return (
    <section className="panel" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{t.composer.title}</h2>
      <label className="field" htmlFor={`${id}-text`}>
        {t.composer.describe}
        <textarea
          id={`${id}-text`}
          value={description}
          placeholder={t.composer.placeholder}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </label>
      <div className="field">
        {t.composer.photo}
        <label className="button button--ghost file-button" htmlFor={`${id}-photo`}>
          {photo ? photo.name : t.composer.photoPick}
          <input
            ref={photoInput}
            id={`${id}-photo`}
            className="visually-hidden"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              setPhoto(e.target.files?.[0] ?? null);
            }}
          />
        </label>
      </div>
      <div className="row">
        <button
          type="button"
          className="button button--primary grow"
          disabled={busy}
          onClick={() => void estimate()}
        >
          {busy ? t.composer.estimating : t.composer.estimate}
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => {
            openDraft({
              name: description.trim(),
              details: '',
              kcal: '',
              proteinG: '',
              source: 'manual',
            });
          }}
        >
          {t.composer.manual}
        </button>
      </div>

      {draft && (
        <MealReview
          key={draftVersion}
          draft={draft}
          onCancel={() => {
            setDraft(null);
          }}
          onSaved={() => {
            reset();
            toast(t.composer.saved);
          }}
        />
      )}

      <div className="stack-sm">
        <div className="eyebrow">{t.composer.quickAdds}</div>
        <div className="chips">
          {MEAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="chip"
              onClick={() => void addPreset(preset)}
            >
              {t.presets[preset.id].name} · <span className="num">{preset.kcal}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function fromEstimate(result: MealEstimate, source: MealSource): MealDraft {
  return {
    name: result.name,
    details: result.items.map((i) => `${i.food} (${i.amount})`).join(', '),
    kcal: String(Math.round(result.kcal)),
    proteinG: String(Math.round(result.proteinG)),
    carbsG: result.carbsG,
    fatG: result.fatG,
    confidence: result.confidence,
    note: result.note,
    items: result.items,
    source,
  };
}
