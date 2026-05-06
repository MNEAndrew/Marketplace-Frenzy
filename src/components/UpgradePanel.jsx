import { STAND_TYPES, incomeForStand, upgradeCostForStand } from '../utils/gameData.js';
import { formatCoins } from '../utils/helpers.js';

export function UpgradePanel({ coins, slots, selectedSlotId, onUpgrade }) {
  const slot = selectedSlotId ? slots[selectedSlotId] : null;
  const built = slot?.built;

  if (!selectedSlotId) {
    return (
      <div className="panel panel--upgrade">
        <div className="panel__header">
          <h3>Upgrade</h3>
          <p className="panel__hint">Tap a built stall on the lane to upgrade it.</p>
        </div>
      </div>
    );
  }

  if (!built) {
    return (
      <div className="panel panel--upgrade">
        <div className="panel__header">
          <h3>Upgrade</h3>
          <p className="panel__hint">This pad has no stall yet. Switch to Build.</p>
        </div>
      </div>
    );
  }

  const def = STAND_TYPES[slot.standType];
  const nextIncome = incomeForStand(slot.standType, slot.level + 1);
  const cost = upgradeCostForStand(slot.standType, slot.level);
  const canAfford = coins >= cost;

  return (
    <div className="panel panel--upgrade">
      <div className="panel__header">
        <h3>Upgrade {def.name}</h3>
        <p className="panel__hint">
          Level {slot.level} → {slot.level + 1}. Income grows with each level.
        </p>
      </div>
      <div className="upgrade-card">
        <div className="upgrade-card__row">
          <span>Next payout / visit</span>
          <strong>🪙 {formatCoins(nextIncome)}</strong>
        </div>
        <div className="upgrade-card__row">
          <span>Upgrade cost</span>
          <strong>🪙 {formatCoins(cost)}</strong>
        </div>
        <button
          type="button"
          className={`btn-primary btn-block ${!canAfford ? 'btn-disabled' : ''}`}
          disabled={!canAfford}
          onClick={() => onUpgrade(selectedSlotId)}
        >
          Upgrade for {formatCoins(cost)} coins
        </button>
      </div>
    </div>
  );
}
