import { ProgressBar } from '../../components/ProgressBar';
import { toDateKey } from '../../domain/dates';
import { dayTotals, remaining } from '../../domain/nutrition';
import { useMeals, useSettings } from '../../hooks/useData';
import { useI18n } from '../../i18n/i18n';
import { MealComposer } from './MealComposer';
import { MealList } from './MealList';
import { Suggestions } from './Suggestions';

export function TodayView() {
  const { t } = useI18n();
  const settings = useSettings();
  const meals = useMeals();
  const today = toDateKey();
  const todaysMeals = meals.filter((m) => m.date === today).sort((a, b) => a.loggedAt - b.loggedAt);
  const totals = dayTotals(meals, today);
  const left = remaining(totals, settings);

  return (
    <>
      <section className="panel" aria-labelledby="today-budget">
        <h2 id="today-budget" className="visually-hidden">
          {t.today.budgetTitle}
        </h2>
        <div className="meter">
          <div>
            <div className="eyebrow">{t.today.left}</div>
            <div className="meter__big num">{left.kcal}</div>
            <div className="small muted num">
              {t.today.ofKcal(Math.round(totals.kcal), settings.kcalTarget)}
            </div>
            <ProgressBar
              value={left.kcalProgress}
              tone={left.kcal < -150 ? 'over' : 'accent'}
              label={t.today.kcalEaten}
            />
          </div>
          <div>
            <div className="eyebrow">{t.today.protein}</div>
            <div className="meter__big num">{left.proteinG}</div>
            <div className="small muted num">
              {t.today.ofProtein(Math.round(totals.proteinG), settings.proteinTarget)}
            </div>
            <ProgressBar value={left.proteinProgress} tone="protein" label={t.today.proteinEaten} />
          </div>
        </div>
        <Suggestions
          settings={settings}
          todaysMeals={todaysMeals}
          kcalLeft={left.kcal}
          proteinLeft={left.proteinG}
        />
      </section>

      <MealComposer settings={settings} />

      <section className="panel" aria-labelledby="meals-title">
        <div className="row row--between">
          <h2 id="meals-title">{t.today.mealsTitle}</h2>
          {todaysMeals.length > 0 && (
            <span className="small muted num">{t.today.mealCount(todaysMeals.length)}</span>
          )}
        </div>
        <MealList meals={todaysMeals} />
      </section>
    </>
  );
}
