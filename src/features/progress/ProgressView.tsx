import { formatNumber } from '../../components/format';
import { MIN_PROTEIN_DAY_G } from '../../data/plan';
import { toDateKey } from '../../domain/dates';
import { weeklyReview, type CheckState } from '../../domain/weekly';
import { useMeals, useWeights, useWorkouts } from '../../hooks/useData';
import { useI18n } from '../../i18n/i18n';
import { AnalysisPanel } from './AnalysisPanel';
import { BackupPanel } from './BackupPanel';
import { SettingsPanel } from './SettingsPanel';

const MARK: Record<CheckState, { symbol: string; tone: string }> = {
  done: { symbol: '✓', tone: 'ok' },
  missed: { symbol: '✗', tone: 'bad' },
  'no-data': { symbol: '·', tone: 'muted' },
};

function Check({ state, label, detail }: { state: CheckState; label: string; detail: string }) {
  return (
    <li>
      <span className={`checklist__mark ${MARK[state].tone}`} aria-hidden="true">
        {MARK[state].symbol}
      </span>
      <div>
        {label}
        <div className="small muted">{detail}</div>
      </div>
    </li>
  );
}

export function ProgressView() {
  const { t } = useI18n();
  const c = t.progress.checks;
  const weights = useWeights();
  const workouts = useWorkouts();
  const meals = useMeals();
  const review = weeklyReview(toDateKey(), { weights, workouts, meals });
  const { delta } = review.weight;

  return (
    <>
      <section className="panel" aria-labelledby="week-title">
        <h2 id="week-title">{t.progress.weekTitle}</h2>
        <ul className="checklist">
          <Check
            state={review.weight.state}
            label={c.weight}
            detail={
              delta === null
                ? c.weightNoData
                : c.weightDetail(`${delta >= 0 ? '+' : ''}${formatNumber(delta, t.locale, 2)}`)
            }
          />
          <Check
            state={review.sessions.state}
            label={c.sessions}
            detail={c.sessionsDetail(review.sessions.count)}
          />
          <Check
            state={review.progression.state}
            label={c.improved}
            detail={
              review.progression.improved.length > 0
                ? review.progression.improved.map((id) => t.exercises[id]).join(', ')
                : c.improvedNone
            }
          />
          <Check
            state={review.protein.state}
            label={c.protein(MIN_PROTEIN_DAY_G)}
            detail={
              review.protein.loggedDays === 0
                ? c.proteinNoData
                : c.proteinDetail(review.protein.hitDays, review.protein.loggedDays)
            }
          />
          <Check state="no-data" label={c.sleep} detail={c.sleepDetail} />
        </ul>
      </section>
      <AnalysisPanel weights={weights} workouts={workouts} meals={meals} />
      <SettingsPanel />
      <BackupPanel />
    </>
  );
}
