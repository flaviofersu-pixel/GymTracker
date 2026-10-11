import { useCallback, useRef, useState, type ReactNode } from 'react';
import { ToastContext } from './toast-context';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    setMessage(text);
    timer.current = window.setTimeout(() => {
      setMessage(null);
    }, 2600);
  }, []);

  return (
    <ToastContext value={show}>
      {children}
      <div className="toast" role="status" aria-live="polite" hidden={message === null}>
        {message}
      </div>
    </ToastContext>
  );
}
