interface ProgressBarProps {
  /** Fraction completed; values above 1 are drawn as full. */
  value: number;
  tone?: 'accent' | 'protein' | 'over';
  label: string;
}

export function ProgressBar({ value, tone = 'accent', label }: ProgressBarProps) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      className={`bar bar--${tone}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <i style={{ width: `${String(percent)}%` }} />
    </div>
  );
}
