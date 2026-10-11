import { useI18n } from '../../i18n/i18n';
import type { Settings } from '../../types';
import { ProfileForm } from './ProfileForm';

/** First-run setup: the profile every target and routine is derived from. */
export function Onboarding({ settings }: { settings: Settings }) {
  const { t } = useI18n();
  return (
    <section className="panel" aria-labelledby="onboarding-title">
      <h2 id="onboarding-title">{t.profile.welcome}</h2>
      <p className="small muted">{t.profile.intro}</p>
      <ProfileForm
        settings={settings}
        submitLabel={t.profile.start}
        onSaved={() => {
          window.location.hash = 'today';
        }}
      />
    </section>
  );
}
