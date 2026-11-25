// Black Friday 2026. Typed in at Polar checkout, same pattern as JOB.
// Must exist as a Polar discount on the lifetime product.
export const BLACK_FRIDAY_CODE = "FRIDAY40";
export const BLACK_FRIDAY_PERCENT = 40;

// Cyber Monday end in Africa/Harare (UTC+2). Flip or remove after the sale.
export const BLACK_FRIDAY_ENDS_AT = new Date("2026-12-01T23:59:59+02:00");

export function isBlackFridayActive(now = Date.now()) {
  return now < BLACK_FRIDAY_ENDS_AT.getTime();
}

/** @returns {string|null} discounted amount with two decimals, or null */
export function applyPercentOff(priceStr, percent = BLACK_FRIDAY_PERCENT) {
  const n = Number(priceStr);
  if (!Number.isFinite(n)) return null;
  return (Math.round(n * (100 - percent)) / 100).toFixed(2);
}

export function msUntilBlackFridayEnds(now = Date.now()) {
  return Math.max(0, BLACK_FRIDAY_ENDS_AT.getTime() - now);
}

export function blackFridayCountdownParts(ms) {
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, ended: ms <= 0 };
}
