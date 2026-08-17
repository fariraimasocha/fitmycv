function toDayKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonday(date) {
  const d = startOfDay(date);
  const weekday = d.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  d.setDate(d.getDate() + offset);
  return d;
}

export function buildDailyCounts(items = [], dayCount, now, getDate = (item) => item.createdAt) {
  const end = startOfDay(now);
  const start = new Date(end);
  start.setDate(start.getDate() - (dayCount - 1));

  const map = new Map();
  for (let i = 0; i < dayCount; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    map.set(toDayKey(day), 0);
  }

  items.forEach((item) => {
    const key = toDayKey(getDate(item));
    if (map.has(key)) map.set(key, map.get(key) + 1);
  });

  return [...map.entries()].map(([date, count]) => ({ date, count }));
}

export function buildWeeklyCounts(items = [], weekCount, now, getDate = (item) => item.createdAt) {
  const thisMonday = startOfMonday(now);
  const start = new Date(thisMonday);
  start.setDate(start.getDate() - (weekCount - 1) * 7);

  const map = new Map();
  for (let i = 0; i < weekCount; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + i * 7);
    map.set(toDayKey(weekStart), 0);
  }

  items.forEach((item) => {
    const monday = startOfMonday(getDate(item));
    const key = toDayKey(monday);
    if (map.has(key)) map.set(key, map.get(key) + 1);
  });

  return [...map.values()];
}

export function buildHeatmapCells(items = [], weekCount, now, getDate = (item) => item.createdAt) {
  const thisMonday = startOfMonday(now);
  const start = new Date(thisMonday);
  start.setDate(start.getDate() - (weekCount - 1) * 7);
  const dayCount = weekCount * 7;

  const counts = new Map();
  items.forEach((item) => {
    const key = toDayKey(getDate(item));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  const cells = [];
  for (let i = 0; i < dayCount; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const key = toDayKey(day);
    cells.push({
      date: key,
      count: counts.get(key) ?? 0,
      label: day.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      month: day.toLocaleDateString("en-GB", { month: "short" }),
      weekIndex: Math.floor(i / 7),
      dayIndex: i % 7,
      isWeekStart: i % 7 === 0,
    });
  }

  return cells;
}
