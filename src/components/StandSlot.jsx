import { STAND_TYPES } from '../utils/gameData.js';
import { Stand } from './Stand.jsx';

export function StandSlot({ slotDef, slotState, selected, onSelect }) {
  const built = slotState?.built;
  const sideClass = slotDef.side === 'left' ? 'stand-slot--left' : 'stand-slot--right';
  const style = { top: `${slotDef.rowPct}%` };

  return (
    <button
      type="button"
      className={`stand-slot ${sideClass} ${built ? 'stand-slot--built' : 'stand-slot--empty'} ${
        selected ? 'stand-slot--selected' : ''
      }`}
      style={style}
      onClick={onSelect}
      aria-label={
        built
          ? `${STAND_TYPES[slotState.standType].name}, level ${slotState.level}. Tap to select.`
          : 'Empty market pad. Tap to select for building.'
      }
    >
      {!built && (
        <div className="stand-slot__pad">
          <span className="stand-slot__hint">Build</span>
        </div>
      )}
      {built && (
        <Stand standTypeId={slotState.standType} level={slotState.level} side={slotDef.side} />
      )}
    </button>
  );
}
