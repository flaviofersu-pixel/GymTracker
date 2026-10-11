import { useId, useState } from 'react';
import { formatNumber, parseDecimal } from '../../components/format';
import { useToast } from '../../components/toast-context';
import { db } from '../../db/database';
import { addDays, formatDay, toDateKey } from '../../domain/dates';
import { classifyPace, trend, weeklyChange } from '../../domain/weight';
import { useSettings, useWeights } from '../../hooks/useData';
import { useI18n } from '../../i18n/i18n';
import { WeightChart } from './WeightChart';

const CHART_DAYS = 56;
const PACE_TONE = { slow: 'warn', 'on-track': 'ok', fast: 'bad' } as const;

export function WeightView() {
  const { t } = useI18n();
  const fmt = (n: number, digits?: number) => formatNumber(n, t.locale, digits);
  const toast = useToast();
  const id = useId();
  const settings = useSettings();
  const weights = useWeights();
  const [kg, setKg] = useState('');
  const [waist, setWaist] = useState('');

  const today = toDateKey();
  const chartFrom = addDays(today, -(CHART_DAYS - 1));
  const change = weeklyChange(weights, today);
  const pace = classifyPace(change.delta);

  const save = async () => {
    const value = parseDecimal(kg);
    if (value === null || value < 35 || value > 200) {
      toast(t.weight.invalid);
      return;
    }
    // Keep a waist measurement already logged today if this entry leaves the field blank.
    const waistCm = parseDecimal(waist) ?? (await db.weights.get(today))?.waistCm;
    await db.weights.put({ date: today, kg: value, ...(waistCm !== undefined && { waistCm }) });
    setKg('');
    setWaist('');
    toast(t.weight.saved);
  };

  return (
    <>
      <section className="panel" aria-labelledby={`${id}-title`}>
        <h2 id={`${id}-title`}>{t.weight.title}</h2>
        <div className="row">
          <label className="field grow" htmlFor={`${id}-kg`}>
            {t.weight.kg}
            <input
              id={`${id}-kg`}
              inputMode="decimal"
              placeholder={fmt(62.4)}
              value={kg}
              onChange={(e) => {
                setKg(e.target.value);
              }}
            />
          </label>
          <label className="field grow" htmlFor={`${id}-waist`}>
            {t.weight.waist}
            <input
              id={`${id}-waist`}
              inputMode="decimal"
              placeholder="74"
              value={waist}
              onChange={(e) => {
                setWaist(e.target.value);
              }}
            />
          </label>
        </div>
        <button type="button" className="button button--primary" onClick={() => void save()}>
          {t.weight.save}
        </button>
      </section>

      <section className="panel" aria-label={t.weight.trend}>
        <div className="stats">
          <Stat
            label={t.weight.avg7}
            value={change.current === null ? '–' : `${fmt(change.current)} kg`}
          />
          <Stat
            label={t.weight.vsLastWeek}
            value={
              change.delta === null ? '–' : `${change.delta >= 0 ? '+' : ''}${fmt(change.delta, 2)}`
            }
          />
          <Stat
            label={t.weight.toGo}
            value={
              change.current === null
                ? '–'
                : `${fmt(Math.max(0, settings.goalWeightKg - change.current))} kg`
            }
          />
        </div>
        <p className="small">
          {pace === 'unknown' ? (
            <span className="muted">{t.weight.paceUnknown}</span>
          ) : (
            <>
              <span className={`pill ${PACE_TONE[pace]}`}>{t.weight.pace[pace].label}</span>{' '}
              {t.weight.pace[pace].text}
            </>
          )}
        </p>
        <WeightChart points={trend(weights, chartFrom)} from={chartFrom} days={CHART_DAYS} />
        <p className="small muted">{t.weight.chartCaption}</p>
      </section>

      <section className="panel" aria-labelledby={`${id}-log`}>
        <h3 id={`${id}-log`}>{t.weight.log}</h3>
        {weights.length === 0 ? (
          <p className="small muted">{t.weight.logEmpty}</p>
        ) : (
          <ul className="list">
            {[...weights]
              .reverse()
              .slice(0, 30)
              .map((entry) => (
                <li key={entry.date} className="item">
                  <div className="item__main">{formatDay(entry.date, t.locale)}</div>
                  <div className="item__value num">
                    {fmt(entry.kg)} kg
                    {entry.waistCm !== undefined && ` · ${fmt(entry.waistCm, 0)} cm`}
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={t.weight.delete(formatDay(entry.date, t.locale))}
                    onClick={() => void db.weights.delete(entry.date)}
                  >
                    ×
                  </button>
                </li>
              ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="stat num">{value}</div>
    </div>
  );
}
