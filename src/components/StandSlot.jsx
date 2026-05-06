import { STAND_TYPES } from '../utils/gameData.js';
import { Stand } from './Stand.jsx';

export function StandSlot({ slotDef, slotState, locked, builtCount, selected, onSelect }) {
  const built = slotState?.built;
  const sideClass = slotDef.side === 'left' ? 'stand-slot--left' : 'stand-slot--right';
  const style = { top: `${slotDef.rowPct}%` };
  const unlockNeed = Math.max(0, (slotDef.unlockAtBuilt ?? 0) - builtCount);

  return (
    <button
      type="button"
      className={`stand-slot ${sideClass} ${built ? 'stand-slot--built' : 'stand-slot--empty'} ${
        locked ? 'stand-slot--locked' : ''
      } ${selected ? 'stand-slot--selected' : ''}`}
      style={style}
      onClick={onSelect}
      aria-disabled={locked && !built}
      aria-label={
        built
          ? `${STAND_TYPES[slotState.standType].name}, level ${slotState.level}. Tap to select.`
          : locked
            ? `Locked market pad. Build ${unlockNeed} more stall${unlockNeed === 1 ? '' : 's'} to unlock.`
          : 'Empty market pad. Tap to select for building.'
      }
    >
      {!built && (
        <div className="stand-slot__pad">
          <span className="stand-slot__hint">
            {locked ? `Locked ${Math.max(1, unlockNeed)}` : 'Build'}
          </span>
        </div>
      )}
      {built && (
        <Stand standTypeId={slotState.standType} level={slotState.level} side={slotDef.side} />
      )}
    </button>
  );
}
