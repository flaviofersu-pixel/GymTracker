import { useEffect, useState } from 'react';
import { ToastProvider } from './components/Toast';
import { MealsView } from './features/meals/MealsView';
import { ProgressView } from './features/progress/ProgressView';
import { TodayView } from './features/today/TodayView';
import { TrainingView } from './features/training/TrainingView';
import { WeightView } from './features/weight/WeightView';
import { Onboarding } from './features/profile/Onboarding';
import { useStoredSettings } from './hooks/useData';
import { LOCALES, MESSAGES, useI18n } from './i18n/i18n';

const TABS = {
  today: TodayView,
  meals: MealsView,
  weight: WeightView,
  training: TrainingView,
  progress: ProgressView,
} as const;

type Tab = keyof typeof TABS;
const TAB_IDS = Object.keys(TABS) as Tab[];

const isTab = (value: string): value is Tab => (TAB_IDS as string[]).includes(value);

/** The current tab lives in the URL hash so reloads and the back button keep it. */
function useHashTab(): [Tab, (tab: Tab) => void] {
  const read = () => {
    const hash = window.location.hash.slice(1);
    return isTab(hash) ? hash : 'today';
  };
  const [tab, setTab] = useState<Tab>(read);

  useEffect(() => {
    const onChange = () => {
      setTab(read());
    };
    window.addEventListener('hashchange', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
    };
  }, []);

  const navigate = (next: Tab) => {
    window.location.hash = next;
    window.scrollTo(0, 0);
  };
  return [tab, navigate];
}

export function App() {
  const { t } = useI18n();
  const settings = useStoredSettings();
  const [tab, navigate] = useHashTab();
  const View = TABS[tab];

  // Render nothing for the moment it takes to read settings, so onboarding never flashes.
  if (!settings) return null;

  const today = new Date().toLocaleDateString(t.locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <ToastProvider>
      <main className="app">
        <header className="app__header">
          <div>
            <div className="eyebrow">{today}</div>
            <h1>{t.app.name}</h1>
          </div>
          <div className="app__meta">
            {settings.onboarded && (
              <span className="small muted">
                {t.app.tagline(t.profile.goals[settings.goal], settings.trainingDays)}
              </span>
            )}
            <LanguageToggle />
          </div>
        </header>
        {settings.onboarded ? <View /> : <Onboarding settings={settings} />}
      </main>

      {settings.onboarded && <TabBar tab={tab} navigate={navigate} />}
    </ToastProvider>
  );
}

function LanguageToggle() {
  const { t, locale, setLocale } = useI18n();
  return (
    <div className="lang" role="group" aria-label={t.app.language}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={code === locale}
          aria-label={MESSAGES[code].languageName}
          onClick={() => {
            setLocale(code);
          }}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function TabBar({ tab, navigate }: { tab: Tab; navigate: (tab: Tab) => void }) {
  const { t } = useI18n();
  return (
    <nav className="tabs" aria-label={t.app.name}>
      {TAB_IDS.map((id) => (
        <button
          key={id}
          type="button"
          aria-current={id === tab ? 'page' : undefined}
          onClick={() => {
            navigate(id);
          }}
        >
          {t.app.tabs[id]}
        </button>
      ))}
    </nav>
  );
}
