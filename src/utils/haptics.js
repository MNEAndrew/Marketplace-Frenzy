/** Light haptics for web; mirrors a future React Native API shape. */

export const HapticImpact = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
};

/**
 * @param {'light'|'medium'|'heavy'|'success'} style
 */
export function triggerHaptic(style) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  const map = {
    light: [12],
    medium: [22],
    heavy: [35],
    success: [10, 40, 12],
  };
  const pattern = map[style] || map.light;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}
