import { useId, useState } from 'react';
import { useToast } from '../../components/toast-context';
import { saveSettings } from '../../db/database';
import { useSettings } from '../../hooks/useData';
import { useI18n } from '../../i18n/i18n';

/** The Anthropic API key that enables the AI features. */
export function ApiKeyPanel() {
  const { apiKey } = useSettings();
  // Remount when the stored key changes, so the field always starts from the saved value.
  return <ApiKeyForm key={apiKey} saved={apiKey} />;
}

function ApiKeyForm({ saved }: { saved: string }) {
  const { t } = useI18n();
  const toast = useToast();
  const id = useId();
  const [apiKey, setApiKey] = useState(saved);

  const save = async () => {
    await saveSettings({ apiKey: apiKey.trim() });
    toast(t.settings.saved);
  };

  return (
    <section className="panel" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{t.settings.title}</h2>
      <label className="field" htmlFor={`${id}-apiKey`}>
        {t.settings.apiKey}
        <input
          id={`${id}-apiKey`}
          type="password"
          autoComplete="off"
          placeholder="sk-ant-..."
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
        />
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
