import { ALLEY_SLOTS } from '../utils/gameData.js';
import { StandSlot } from './StandSlot.jsx';
import { Customer } from './Customer.jsx';

export function AlleyView({ slots, decorations, customers, selectedSlotId, onSelectSlot }) {
  return (
    <div className="alley-scroll">
      <div className="alley-frame">
        <div className="alley-sky" aria-hidden="true" />
        <div className="alley-root">
          <div className="alley-buildings alley-buildings--left">
            <FacadeWindows decorations={decorations} side="left" />
          </div>
          <div className="alley-path">
            <div className="alley-path__stones" />
            <div className="alley-path__centerline" />
            {decorations.lights && <div className="alley-path__lights" aria-hidden="true" />}
            {customers.map((c) => (
              <Customer key={c.id} customer={c} />
            ))}
          </div>
          <div className="alley-buildings alley-buildings--right">
            <FacadeWindows decorations={decorations} side="right" />
          </div>

          <div className="alley-slots-layer">
            {ALLEY_SLOTS.map((slot) => (
              <StandSlot
                key={slot.id}
                slotDef={slot}
                slotState={slots[slot.id]}
                selected={selectedSlotId === slot.id}
                onSelect={() => onSelectSlot(slot.id)}
              />
            ))}
          </div>

          {decorations.bench && (
            <div className="alley-prop alley-prop--bench" aria-hidden="true">
              🪑
            </div>
          )}
        </div>
        <div className="alley-entrance" aria-hidden="true">
          <span>Enter</span>
        </div>
      </div>
    </div>
  );
}

function FacadeWindows({ decorations, side }) {
  const rows = [8, 22, 38, 54, 70, 86];
  return (
    <>
      {rows.map((pct, i) => (
        <div
          key={`${side}-${i}`}
          className={`facade-window facade-window--${side}`}
          style={{ top: `${pct}%` }}
        />
      ))}
      {decorations.lanterns && (
        <div className={`facade-lantern facade-lantern--${side}`} aria-hidden="true">
          🏮
        </div>
      )}
      {decorations.plants && (
        <div className={`facade-plant facade-plant--${side}`} aria-hidden="true">
          🪴
        </div>
      )}
    </>
  );
}
