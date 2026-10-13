interface ChoiceProps<T extends string | number> {
  label: string;
  options: readonly T[];
  value: T;
  /** Text shown on each option's button. */
  render: (option: T) => string;
  onChange: (option: T) => void;
  /** Wrap onto several lines instead of scrolling sideways, for long option lists. */
  wrap?: boolean;
}

/** A row of toggle buttons for picking one value, labelled for assistive tech as a group. */
export function Choice<T extends string | number>({
  label,
  options,
  value,
  render,
  onChange,
  wrap = false,
}: ChoiceProps<T>) {
  return (
    <div className="field">
      <span>{label}</span>
      <div
        className={wrap ? 'segmented segmented--wrap' : 'segmented'}
        role="group"
        aria-label={label}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => {
              onChange(option);
            }}
          >
            {render(option)}
          </button>
        ))}
      </div>
    </div>
  );
}
