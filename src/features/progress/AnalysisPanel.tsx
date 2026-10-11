import { useRef, useState } from 'react';
import { ManualAi } from '../../components/ManualAi';
import { Markdown } from '../../components/Markdown';
import { logAnalysis } from '../../db/database';
import { daysBetween, formatDay, toDateKey } from '../../domain/dates';
import { useAnalyses, useSettings } from '../../hooks/useData';
import { useI18n } from '../../i18n/i18n';
import { analyzeProgress, errorCode, type AiErrorCode } from '../../services/ai';
import { analysisPrompt, progressDigest } from '../../services/prompts';
import type { Meal, WeightEntry, Workout } from '../../types';

const REVIEW_EVERY_DAYS = 7;

interface AnalysisPanelProps {
  weights: WeightEntry[];
  workouts: Workout[];
  meals: Meal[];
}

export function AnalysisPanel({ weights, workouts, meals }: AnalysisPanelProps) {
  const { t, locale } = useI18n();
  const settings = useSettings();
  const analyses = useAnalyses();
  const [text, setText] = useState('');
  const [error, setError] = useState<AiErrorCode | null>(null);
  const [running, setRunning] = useState(false);
  const controller = useRef<AbortController | null>(null);
  /** The question to run through the person's own Claude app when there is no API key. */
  const [manualPrompt, setManualPrompt] = useState<string | null>(null);

  const latest = analyses[0];
  const daysSince = latest ? daysBetween(latest.date, toDateKey()) : null;

  const run = async () => {
    const today = toDateKey();
    const digest = progressDigest(today, settings, { weights, meals, workouts });
    const prompt = analysisPrompt(today, settings, digest, locale);
    setError(null);
    setText('');
    if (!settings.apiKey) {
      setManualPrompt(prompt);
      return;
    }
    const abort = new AbortController();
    controller.current = abort;
    setRunning(true);
    try {
      const result = await analyzeProgress(settings.apiKey, prompt, setText, abort.signal);
      setText(result);
      await logAnalysis(result);
    } catch (e) {
      if (!abort.signal.aborted) setError(errorCode(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <section className="panel" aria-labelledby="analysis-title">
        <div className="row row--between">
          <h2 id="analysis-title">{t.analysis.title}</h2>
          {daysSince === null ? (
            <span className="small muted">{t.analysis.none}</span>
          ) : daysSince >= REVIEW_EVERY_DAYS ? (
            <span className="pill warn">{t.analysis.overdue(daysSince)}</span>
          ) : (
            <span className="small muted">{t.analysis.last(daysSince)}</span>
          )}
        </div>
        <p className="small muted">{t.analysis.intro}</p>
        <div className="row">
          <button
            type="button"
            className="button button--primary grow"
            disabled={running}
            onClick={() => void run()}
          >
            {running ? t.analysis.running : t.analysis.run}
          </button>
          {running && (
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                controller.current?.abort();
              }}
            >
              {t.analysis.stop}
            </button>
          )}
        </div>
        {manualPrompt && (
          <ManualAi
            prompt={manualPrompt}
            onAnswer={async (reply) => {
              const result = reply.trim();
              setText(result);
              setManualPrompt(null);
              await logAnalysis(result);
            }}
            onCancel={() => {
              setManualPrompt(null);
            }}
          />
        )}
        {running && !text && <p className="small muted">{t.analysis.thinking}</p>}
        {text && <Markdown text={text} />}
        {error && <p className="small bad">{t.errors[error]}</p>}
      </section>

      <section className="panel" aria-labelledby="past-title">
        <h3 id="past-title">{t.analysis.pastTitle}</h3>
        {analyses.length === 0 ? (
          <p className="small muted">{t.analysis.pastEmpty}</p>
        ) : (
          <div className="list">
            {analyses.slice(0, 10).map((analysis) => (
              <details key={analysis.id} className="item item--block">
                <summary>{formatDay(analysis.date, t.locale)}</summary>
                <Markdown text={analysis.text} />
              </details>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
