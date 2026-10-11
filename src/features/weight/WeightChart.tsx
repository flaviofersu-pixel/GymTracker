import { addDays, daysBetween, formatShortDate } from '../../domain/dates';
import type { TrendPoint } from '../../domain/weight';
import { useI18n } from '../../i18n/i18n';
import type { DateKey } from '../../types';

const WIDTH = 340;
const HEIGHT = 190;
const PAD = { left: 34, right: 8, top: 10, bottom: 24 };

interface WeightChartProps {
  points: TrendPoint[];
  from: DateKey;
  days: number;
}

export function WeightChart({ points, from, days }: WeightChartProps) {
  const { t } = useI18n();
  if (points.length === 0) {
    return (
      <svg
        className="chart"
        viewBox={`0 0 ${String(WIDTH)} ${String(HEIGHT)}`}
        role="img"
        aria-label={t.weight.chartEmpty}
      >
        <text x={WIDTH / 2} y={HEIGHT / 2} textAnchor="middle">
          {t.weight.chartEmpty}
        </text>
      </svg>
    );
  }

  const values = points.flatMap((p) => [p.kg, p.average]);
  const min = Math.floor(Math.min(...values) - 0.5);
  const max = Math.max(Math.ceil(Math.max(...values) + 0.5), min + 2);
  const step = max - min > 6 ? 2 : 1;

  const x = (date: DateKey) =>
    PAD.left + ((WIDTH - PAD.left - PAD.right) * daysBetween(from, date)) / (days - 1);
  const y = (kg: number) =>
    PAD.top + (HEIGHT - PAD.top - PAD.bottom) * (1 - (kg - min) / (max - min));

  const gridValues: number[] = [];
  for (let v = min; v <= max; v += step) gridValues.push(v);
  const dateTicks = [0, 14, 28, 42, days - 1].map((offset) => addDays(from, offset));

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.date).toFixed(1)} ${y(p.average).toFixed(1)}`)
    .join(' ');
  const first = points[0];
  const last = points[points.length - 1];
  const baseline = HEIGHT - PAD.bottom;
  const area =
    first && last && points.length > 1
      ? `${line} L${x(last.date).toFixed(1)} ${String(baseline)} L${x(first.date).toFixed(1)} ${String(baseline)} Z`
      : null;

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${String(WIDTH)} ${String(HEIGHT)}`}
      role="img"
      aria-label={t.weight.chartLabel(Math.round(days / 7))}
    >
      {gridValues.map((v) => (
        <g key={v}>
          <line className="chart__grid" x1={PAD.left} x2={WIDTH - PAD.right} y1={y(v)} y2={y(v)} />
          <text x={PAD.left - 6} y={y(v) + 4} textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      {dateTicks.map((date, i) => (
        <text
          key={date}
          x={x(date)}
          y={HEIGHT - 6}
          // Keep the outermost labels inside the drawing.
          textAnchor={i === 0 ? 'start' : i === dateTicks.length - 1 ? 'end' : 'middle'}
        >
          {formatShortDate(date, t.locale)}
        </text>
      ))}
      {area && <path className="chart__area" d={area} />}
      {points.map((p) => (
        <circle key={p.date} className="chart__dot" cx={x(p.date)} cy={y(p.kg)} r={2.6} />
      ))}
      <path className="chart__line" d={line} />
      {last && <circle className="chart__end" cx={x(last.date)} cy={y(last.average)} r={4.5} />}
    </svg>
  );
}
