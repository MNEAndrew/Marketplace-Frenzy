export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function formatCoins(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.floor(n / 1000)}k`;
  return String(Math.floor(n));
}

/** Pseudo-stable hue from string for customer tint */
export function hueFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % 360;
  return h;
}
