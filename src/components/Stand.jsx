import { STAND_TYPES } from '../utils/gameData.js';

export function Stand({ standTypeId, level, side }) {
  const def = STAND_TYPES[standTypeId];
  if (!def) return null;
  const scale = 1 + Math.min(6, level - 1) * 0.04;
  const awningLift = Math.min(8, (level - 1) * 1.5);

  return (
    <div
      className={`stand stand--${side}`}
      style={{
        transform: `scale(${scale})`,
        '--stand-awning': def.colors.awning,
        '--stand-body': def.colors.body,
        '--stand-accent': def.colors.accent,
        '--stand-lift': `${awningLift}px`,
      }}
    >
      <div className="stand__awning">
        <span className="stand__emoji" aria-hidden="true">
          {def.emoji}
        </span>
      </div>
      <div className="stand__counter">
        <span className="stand__crates" aria-hidden="true">
          📦
        </span>
        <span className="stand__basket" aria-hidden="true">
          🧺
        </span>
      </div>
      <div className="stand__sign">{def.name}</div>
      <div className="stand__level">Lv.{level}</div>
    </div>
  );
}
