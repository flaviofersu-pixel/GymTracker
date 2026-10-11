import { useState } from 'react';
import { ManualAi } from '../../components/ManualAi';
import { useToast } from '../../components/toast-context';
import { logMeal } from '../../db/database';
import { useI18n } from '../../i18n/i18n';
import {
  errorCode,
  parseReply,
  replyFormat,
  suggestMeals,
  type AiErrorCode,
  type MealSuggestion,
} from '../../services/ai';
import { suggestionsPrompt } from '../../services/prompts';
import type { Meal, Settings } from '../../types';

interface SuggestionsProps {
  settings: Settings;
  todaysMeals: Meal[];
  kcalLeft: number;
  proteinLeft: number;
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'manual'; prompt: string }
  | { status: 'target-reached' }
  | { status: 'done'; options: MealSuggestion[] }
  | { status: 'error'; code: AiErrorCode };

export function Suggestions({ settings, todaysMeals, kcalLeft, proteinLeft }: SuggestionsProps) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const [state, setState] = useState<State>({ status: 'idle' });

  const ask = async () => {
    if (kcalLeft < 100) {
      setState({ status: 'target-reached' });
      return;
    }
    const prompt = suggestionsPrompt({
      profile: settings,
      hour: new Date().getHours(),
      eatenToday: todaysMeals,
      kcalLeft,
      proteinLeft,
      locale,
    });
    if (!settings.apiKey) {
      setState({ status: 'manual', prompt: `${prompt}\n\n${await replyFormat('suggestions')}` });
      return;
    }
    setState({ status: 'loading' });
    try {
      setState({ status: 'done', options: await suggestMeals(settings.apiKey, prompt) });
    } catch (error) {
      setState({ status: 'error', code: errorCode(error) });
    }
  };

  const add = async (option: MealSuggestion) => {
    await logMeal({
      name: option.name,
      details: option.how,
      kcal: option.kcal,
      proteinG: option.proteinG,
      source: 'suggestion',
    });
    setState({ status: 'idle' });
    toast(t.suggestions.added);
  };

  return (
    <>
      <button
        type="button"
        className="button button--primary"
        disabled={state.status === 'loading'}
        onClick={() => void ask()}
      >
        {state.status === 'loading' ? t.suggestions.loading : t.suggestions.ask}
      </button>
      {state.status === 'manual' && (
        <ManualAi
          prompt={state.prompt}
          onAnswer={async (reply) => {
            const { options } = await parseReply('suggestions', reply);
            setState({ status: 'done', options });
          }}
          onCancel={() => {
            setState({ status: 'idle' });
          }}
        />
      )}
      {state.status === 'target-reached' && <p className="small">{t.suggestions.done}</p>}
      {state.status === 'error' && <p className="small bad">{t.errors[state.code]}</p>}
      {state.status === 'done' && (
        <ul className="list">
          {state.options.map((option) => (
            <li key={option.name} className="item">
              <div className="item__main">
                <strong>{option.name}</strong>
                <div className="small">{option.how}</div>
                <div className="small muted num">
                  {t.suggestions.summary(
                    Math.round(option.kcal),
                    Math.round(option.proteinG),
                    option.minutes,
                  )}
                </div>
              </div>
              <button type="button" className="chip" onClick={() => void add(option)}>
                {t.suggestions.add}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
