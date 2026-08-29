const STORAGE_KEY = "fitmycv:recent-job-urls";
const MAX_RECENT = 5;

export function getRecentJobUrls() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.url === "string")
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
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
}
