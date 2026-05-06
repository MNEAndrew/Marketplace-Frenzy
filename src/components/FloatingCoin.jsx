import { formatCoins } from '../utils/helpers.js';

export function FloatingCoin({ xPct, yPct, amount, bonus }) {
  return (
    <div
      className={`floating-coin ${bonus ? 'floating-coin--bonus' : ''}`}
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
      }}
    >
      +{formatCoins(amount)}
      {bonus ? ' ★' : ''}
    </div>
  );
}
