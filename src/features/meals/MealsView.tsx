import { useState } from 'react';
import { useToast } from '../../components/toast-context';
import { MEAL_CATEGORIES, MEAL_IDEAS, type MealCategory, type MealIdea } from '../../data/meals';
import { logMeal } from '../../db/database';
import { toDateKey } from '../../domain/dates';
import { dayTotals, remaining } from '../../domain/nutrition';
import { useMeals, useSettings } from '../../hooks/useData';
import { useI18n } from '../../i18n/i18n';

/** A browsable list of ready-made meals, grouped by when you would eat them. */
export function MealsView() {
  const { t } = useI18n();
  const toast = useToast();
  const settings = useSettings();
  const meals = useMeals();
  const [category, setCategory] = useState<MealCategory>('breakfast');
  const left = remaining(dayTotals(meals, toDateKey()), settings);

  const add = async (idea: MealIdea) => {
    const { name, ingredients } = t.mealIdeas[idea.id];
    await logMeal({
      name,
      details: ingredients.join(', '),
      kcal: idea.kcal,
      proteinG: idea.proteinG,
      source: 'preset',
    });
    toast(t.composer.added(idea.kcal));
  };

  return (
    <section className="panel" aria-labelledby="meals-title">
      <h2 id="meals-title">{t.meals.title}</h2>
      <p className="small muted">{t.meals.intro}</p>
      <p className="small num">{t.meals.left(left.kcal, left.proteinG)}</p>
      <div className="segmented" role="group" aria-label={t.meals.title}>
        {MEAL_CATEGORIES.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === category}
            onClick={() => {
              setCategory(id);
            }}
          >
            {t.meals.categories[id]}
          </button>
        ))}
      </div>
      <ul className="list">
        {MEAL_IDEAS.filter((idea) => idea.category === category).map((idea) => (
          <MealIdeaCard key={idea.id} idea={idea} onAdd={() => void add(idea)} />
        ))}
      </ul>
    </section>
  );
}

function MealIdeaCard({ idea, onAdd }: { idea: MealIdea; onAdd: () => void }) {
  const { t } = useI18n();
  const copy = t.mealIdeas[idea.id];
  return (
    <li className="meal-idea">
      <MealPhoto idea={idea} />
      <div className="item__main">
        <strong>{copy.name}</strong>
        <div className="small muted num">{t.meals.summary(idea.kcal, idea.proteinG)}</div>
        <ul className="small meal-idea__ingredients" aria-label={t.meals.ingredients}>
          {copy.ingredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="chip"
        aria-label={t.meals.addLabel(copy.name)}
        onClick={onAdd}
      >
        {t.meals.add}
      </button>
    </li>
  );
}

/** The meal's photo from `public/meals/<id>.jpg`, or its emoji until a photo is added. */
function MealPhoto({ idea }: { idea: MealIdea }) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div className="meal-idea__photo meal-idea__photo--emoji" aria-hidden="true">
        {idea.emoji}
      </div>
    );
  }
  return (
    <img
      className="meal-idea__photo"
      src={`${import.meta.env.BASE_URL}meals/${idea.id}.jpg`}
      alt=""
      loading="lazy"
      onError={() => {
        setMissing(true);
      }}
    />
  );
}
