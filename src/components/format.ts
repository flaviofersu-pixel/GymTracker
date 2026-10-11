export function formatNumber(value: number, locale: string, digits = 1): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Parses user input that may use a comma as the decimal separator. */
export function parseDecimal(input: string): number | null {
  const value = Number.parseFloat(input.replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}
