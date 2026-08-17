import { cn } from "@/lib/utils";

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function toSmoothPath(points, minY, maxY) {
  if (points.length < 2) return "";

  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = clamp(p1[1] + (p2[1] - p0[1]) / 6, minY, maxY);
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = clamp(p2[1] - (p3[1] - p1[1]) / 6, minY, maxY);
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export function Sparkline({
  values = [],
  width = 160,
  height = 48,
  fill = false,
  className,
}) {
  const series = values.length > 0 ? values : [0, 0];
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const last = series.length - 1 || 1;
  const padX = 4;
  const top = 8;
  const bottom = height - 8;

  const points = series.map((value, index) => {
    const x = padX + (index / last) * (width - padX * 2);
    const y = bottom - ((value - min) / range) * (bottom - top);
    return [x, y];
  });

  const line = toSmoothPath(points, top, bottom);
  const firstX = points[0][0];
  const lastX = points[points.length - 1][0];
  const area = `${line} L ${lastX.toFixed(1)} ${bottom.toFixed(1)} L ${firstX.toFixed(1)} ${bottom.toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn(
        "block h-12 w-full text-[var(--landing-accent)]",
        className
      )}
      aria-hidden="true"
    >
      {fill && (
        <path d={area} fill="currentColor" opacity="0.14" />
      )}
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
