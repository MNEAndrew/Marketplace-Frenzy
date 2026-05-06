import { decorationDefs } from '../utils/gameData.js';
import { formatCoins } from '../utils/helpers.js';

export function DecorationPanel({ coins, decorations, onBuy }) {
  const defs = decorationDefs();

  return (
    <div className="panel panel--decorate">
      <div className="panel__header">
        <h3>Decorate</h3>
        <p className="panel__hint">Soft touches that make the lane feel lived-in.</p>
      </div>
      <ul className="decor-list">
        {defs.map((d) => {
          const owned = decorations[d.id];
          const affordable = coins >= d.cost;
          return (
            <li key={d.id}>
              <button
                type="button"
                className={`decor-row ${owned ? 'decor-row--owned' : ''} ${
                  !owned && !affordable ? 'decor-row--disabled' : ''
                }`}
                disabled={owned || !affordable}
                onClick={() => !owned && onBuy(d.id, d.cost)}
              >
                <span className="decor-row__emoji" aria-hidden="true">
                  {d.emoji}
                </span>
                <div className="decor-row__text">
                  <div className="decor-row__title">{d.name}</div>
                  <div className="decor-row__meta">
                    {owned ? 'Placed' : `🪙 ${formatCoins(d.cost)}`}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
