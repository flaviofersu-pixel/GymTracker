import { useSettings } from '../../hooks/useData';
import { useI18n } from '../../i18n/i18n';
import { ProfileForm } from '../profile/ProfileForm';

export function ProfilePanel() {
  const { t } = useI18n();
  const settings = useSettings();
  return (
    <section className="panel" aria-labelledby="profile-title">
      <h2 id="profile-title">{t.profile.title}</h2>
      {/* Remount when stored settings change, so the form always starts from saved values. */}
      <ProfileForm
        key={JSON.stringify(settings)}
        settings={settings}
        submitLabel={t.profile.save}
      />
    </section>
  );
}
