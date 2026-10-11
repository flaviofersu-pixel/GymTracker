import { useId, useRef, useState } from 'react';
import { useToast } from '../../components/toast-context';
import { toDateKey } from '../../domain/dates';
import { useI18n } from '../../i18n/i18n';

export function BackupPanel() {
  const { t } = useI18n();
  const toast = useToast();
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<File | null>(null);

  const download = async () => {
    const { exportBackup } = await import('../../db/backup');
    const backup = await exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cuaderno-70-${toDateKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const restore = async (file: File) => {
    try {
      const { importBackup } = await import('../../db/backup');
      const backup = await importBackup(JSON.parse(await file.text()));
      toast(t.backup.restored(backup.weights.length, backup.workouts.length));
    } catch {
      toast(t.backup.invalid);
    } finally {
      setPending(null);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const [before, fileName, after] = pending ? t.backup.confirm(pending.name) : [];

  return (
    <section className="panel" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{t.backup.title}</h3>
      <p className="small muted">{t.backup.intro}</p>
      <div className="row">
        <button type="button" className="button grow" onClick={() => void download()}>
          {t.backup.download}
        </button>
        <label className="button button--ghost grow" htmlFor={`${id}-file`}>
          {t.backup.restore}
          <input
            ref={fileInput}
            id={`${id}-file`}
            className="visually-hidden"
            type="file"
            accept="application/json"
            onChange={(e) => {
              setPending(e.target.files?.[0] ?? null);
            }}
          />
        </label>
      </div>
      {pending && (
        <div className="review">
          <p className="small">
            {before}
            <strong>{fileName}</strong>
            {after}
          </p>
          <div className="row">
            <button
              type="button"
              className="button button--danger grow"
              onClick={() => void restore(pending)}
            >
              {t.backup.replace}
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                setPending(null);
              }}
            >
              {t.backup.cancel}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
