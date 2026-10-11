import { useId, useState } from 'react';
import { useI18n } from '../i18n/i18n';
import { errorCode } from '../services/ai';
import { useToast } from './toast-context';

interface ManualAiProps {
  /** The full question, ready to paste into Claude. */
  prompt: string;
  /** Extra instruction, such as attaching a photo. */
  hint?: string;
  /** Handles the pasted reply; throws an AiError when it cannot be read. */
  onAnswer: (reply: string) => Promise<void>;
  onCancel: () => void;
}

/** Lets someone without an API key run a question through their own Claude app. */
export function ManualAi({ prompt, hint, onAnswer, onCancel }: ManualAiProps) {
  const { t } = useI18n();
  const toast = useToast();
  const id = useId();
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast(t.manual.copied);
    } catch {
      // Clipboard access can be blocked; the share sheet is the next best thing on phones.
      await navigator.share({ text: prompt }).catch(() => undefined);
    }
  };

  const use = async () => {
    setBusy(true);
    try {
      await onAnswer(reply);
    } catch (error) {
      toast(t.errors[errorCode(error)]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="review">
      <p className="small muted">{t.manual.intro}</p>
      <div className="row">
        <button type="button" className="button grow" onClick={() => void copy()}>
          {t.manual.copy}
        </button>
        <a
          className="button button--ghost"
          href="https://claude.ai/new"
          target="_blank"
          rel="noreferrer"
        >
          {t.manual.open}
        </a>
      </div>
      {hint && <p className="small">{hint}</p>}
      <label className="field" htmlFor={`${id}-reply`}>
        {t.manual.paste}
        <textarea
          id={`${id}-reply`}
          value={reply}
          onChange={(e) => {
            setReply(e.target.value);
          }}
        />
      </label>
      <div className="row">
        <button
          type="button"
          className="button button--primary grow"
          disabled={busy || !reply.trim()}
          onClick={() => void use()}
        >
          {t.manual.use}
        </button>
        <button type="button" className="button button--ghost" onClick={onCancel}>
          {t.manual.cancel}
        </button>
      </div>
    </div>
  );
}
