"use client";

export default function FormattedDate({ date, options, locale, className }) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return (
    <time
      dateTime={d.toISOString()}
      suppressHydrationWarning
      className={className}
    >
      {d.toLocaleDateString(locale, options)}
    </time>
  );
}
