const STORAGE_KEY = "fitmycv:recent-job-urls";
const MAX_RECENT = 5;
const EMPTY = [];

const listeners = new Set();
let cachedRaw = null;
let cachedList = EMPTY;

function parse(raw) {
  try {
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed
      .filter((item) => item && typeof item.url === "string")
      .slice(0, MAX_RECENT);
  } catch {
    return EMPTY;
  }
}

// Returns the same array until storage changes, so it works as a
// useSyncExternalStore snapshot.
export function getRecentJobUrls() {
  if (typeof window === "undefined") return EMPTY;
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parse(raw);
  }
  return cachedList;
}

// The server has no localStorage. Hydration starts from an empty list.
export function getServerRecentJobUrls() {
  return EMPTY;
}

export function subscribeRecentJobUrls(callback) {
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY || event.key === null) callback();
  };
  listeners.add(callback);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function rememberJobUrl(url, title = "") {
  if (typeof window === "undefined" || !url) return;
  const next = [
    { url, title: title || "" },
    ...getRecentJobUrls().filter((item) => item.url !== url),
  ].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private-mode failures.
  }
  listeners.forEach((listener) => listener());
}
