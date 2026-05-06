import { BUILD_MENU_ORDER, STAND_TYPES } from '../utils/gameData.js';
import { STAND_ART } from '../assets/standArt.js';
import { formatCoins } from '../utils/helpers.js';

export function BuildPanel({ coins, slots, selectedSlotId, onBuild }) {
  const selected = selectedSlotId ? slots[selectedSlotId] : null;
  const emptySelected = Boolean(selectedSlotId && !selected?.built);

  return (
    <div className="panel panel--build">
      <div className="panel__header">
        <h3>Build</h3>
        <p className="panel__hint">
          {emptySelected
            ? 'Choose a stand for the selected pad.'
            : 'Tap an empty dotted pad on the lane, then pick a stand.'}
        </p>
      </div>
      <ul className="build-list">
        {BUILD_MENU_ORDER.map((typeId) => {
          const def = STAND_TYPES[typeId];
          const art = STAND_ART[typeId];
          const affordable = coins >= def.buildCost;
          const disabled = !emptySelected || !affordable;
          const canAttempt = Boolean(emptySelected);
          return (
            <li key={typeId}>
              <button
                type="button"
                className={`build-row ${disabled ? 'build-row--disabled' : ''}`}
                disabled={!canAttempt}
                aria-disabled={disabled}
                onClick={() => canAttempt && onBuild(selectedSlotId, typeId)}
              >
                <span className="build-row__thumb" aria-hidden="true">
                  {art ? (
                    <img
                      src={art}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      draggable="false"
                    />
                  ) : (
                    def.emoji
                  )}
                </span>
                <div className="build-row__text">
                  <div className="build-row__title">{def.name}</div>
                  <div className="build-row__desc">{def.description}</div>
                </div>
                <div className="build-row__cost">
                  <span className="coin-xs">🪙</span> {formatCoins(def.buildCost)}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
