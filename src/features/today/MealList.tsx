import { db } from '../../db/database';
import { useI18n } from '../../i18n/i18n';
import type { Meal } from '../../types';

export function MealList({ meals }: { meals: Meal[] }) {
  const { t } = useI18n();

  if (meals.length === 0) {
    return <p className="small muted">{t.today.empty}</p>;
  }

  return (
    <ul className="list">
      {meals.map((meal) => (
        <li key={meal.id} className="item">
          <div className="item__main">
            <div>{meal.name}</div>
            {meal.details && <div className="small muted">{meal.details}</div>}
          </div>
          <div className="item__value">
            <div className="num">{Math.round(meal.kcal)} kcal</div>
            <div className="small muted num">
              {Math.round(meal.proteinG)} {t.today.proteinShort}
            </div>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={t.today.delete(meal.name)}
            onClick={() => {
              if (meal.id !== undefined) void db.meals.delete(meal.id);
            }}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
