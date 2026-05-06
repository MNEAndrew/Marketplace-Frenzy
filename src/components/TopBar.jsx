import { formatCoins } from '../utils/helpers.js';

export function TopBar({ coins, builtStands }) {
  return (
    <header className="top-bar">
      <div className="top-bar__brand">
        <span className="top-bar__emoji" aria-hidden="true">
          🏘️
        </span>
        <div>
          <div className="top-bar__title">Alley Market</div>
          <div className="top-bar__sub">Cozy lane sim</div>
        </div>
      </div>
      <div className="top-bar__stats">
        <div className="pill pill--gold">
          <span aria-hidden="true">🪙</span>
          <span className="pill__value">{formatCoins(coins)}</span>
        </div>
        <div className="pill pill--muted">
          <span>Stalls</span>
          <span className="pill__value">{builtStands}</span>
        </div>
      </div>
    </header>
  );
}
