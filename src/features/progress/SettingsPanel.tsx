import { useId, useState, type ChangeEvent } from 'react';
import { parseDecimal } from '../../components/format';
import { useToast } from '../../components/toast-context';
import { saveSettings } from '../../db/database';
import { useSettings } from '../../hooks/useData';
import { useI18n } from '../../i18n/i18n';
import type { Settings } from '../../types';

type Form = Record<'kcalTarget' | 'proteinTarget' | 'goalWeightKg' | 'apiKey', string>;

const toForm = (s: Settings): Form => ({
  kcalTarget: String(s.kcalTarget),
  proteinTarget: String(s.proteinTarget),
  goalWeightKg: String(s.goalWeightKg),
  apiKey: s.apiKey,
});

export function SettingsPanel() {
  const settings = useSettings();
  // Remount the form when stored settings change, so it always starts from saved values.
  return <SettingsForm key={JSON.stringify(toForm(settings))} settings={settings} />;
}

function SettingsForm({ settings }: { settings: Settings }) {
  const { t } = useI18n();
  const toast = useToast();
  const id = useId();
  const [form, setForm] = useState(() => toForm(settings));

  const field = (name: keyof Form) => ({
    id: `${id}-${name}`,
    value: form[name],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [name]: e.target.value });
    },
  });

  const save = async () => {
    const kcalTarget = parseDecimal(form.kcalTarget);
    const proteinTarget = parseDecimal(form.proteinTarget);
    const goalWeightKg = parseDecimal(form.goalWeightKg);
    if (!kcalTarget || !proteinTarget || !goalWeightKg) {
      toast(t.settings.invalid);
      return;
    }
    await saveSettings({
      kcalTarget: Math.round(kcalTarget),
      proteinTarget: Math.round(proteinTarget),
      goalWeightKg,
      apiKey: form.apiKey.trim(),
    });
    toast(t.settings.saved);
  };

  return (
    <section className="panel" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{t.settings.title}</h3>
      <div className="row">
        <label className="field grow" htmlFor={`${id}-kcalTarget`}>
          {t.settings.kcal}
          <input inputMode="numeric" {...field('kcalTarget')} />
        </label>
        <label className="field grow" htmlFor={`${id}-proteinTarget`}>
          {t.settings.protein}
          <input inputMode="numeric" {...field('proteinTarget')} />
        </label>
        <label className="field grow" htmlFor={`${id}-goalWeightKg`}>
          {t.settings.goal}
          <input inputMode="decimal" {...field('goalWeightKg')} />
        </label>
      </div>
      <label className="field" htmlFor={`${id}-apiKey`}>
        {t.settings.apiKey}
        <input type="password" autoComplete="off" placeholder="sk-ant-..." {...field('apiKey')} />
      </label>
      <p className="small muted">
        {t.settings.apiKeyHelp}{' '}
        <a href="https://platform.claude.com/settings/keys" target="_blank" rel="noreferrer">
          platform.claude.com
        </a>
        .
      </p>
      <button type="button" className="button" onClick={() => void save()}>
        {t.settings.save}
      </button>
    </section>
  );
}
