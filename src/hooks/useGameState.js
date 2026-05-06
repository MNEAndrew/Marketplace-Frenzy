import { useCallback, useEffect, useRef, useState } from 'react';
import { ALLEY_SLOTS, STAND_TYPES, isSlotUnlocked, upgradeCostForStand } from '../utils/gameData.js';
import { loadGameState, saveGameState } from '../utils/saveSystem.js';
import { triggerHaptic } from '../utils/haptics.js';

const SAVE_DEBOUNCE_MS = 400;

export function useGameState() {
  const [state, setState] = useState(() => loadGameState());
  const saveTimer = useRef(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveGameState(state), SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);

  const addCoins = useCallback((amount, kind = 'earn') => {
    setState((s) => ({
      ...s,
      coins: s.coins + amount,
      lifetimeEarned: s.lifetimeEarned + Math.max(0, amount),
    }));
    if (kind === 'earn') triggerHaptic('light');
  }, []);

  const selectSlot = useCallback((slotId) => {
    setState((s) => ({ ...s, selectedSlotId: slotId }));
  }, []);

  const buildStand = useCallback((slotId, standTypeId) => {
    const def = STAND_TYPES[standTypeId];
    if (!def) return { ok: false, reason: 'unknown' };
    let success = false;
    let failure = 'unknown';
    let shortfall = 0;
    setState((s) => {
      const slot = s.slots[slotId];
      const slotDef = ALLEY_SLOTS.find((item) => item.id === slotId);
      if (!slotDef || !isSlotUnlocked(slotDef, s.slots)) {
        failure = 'locked';
        return s;
      }
      if (slot?.built) {
        failure = 'built';
        return s;
      }
      if (s.coins < def.buildCost) {
        failure = 'coins';
        shortfall = def.buildCost - s.coins;
        return s;
      }
      success = true;
      return {
        ...s,
        coins: s.coins - def.buildCost,
        slots: {
          ...s.slots,
          [slotId]: { built: true, standType: standTypeId, level: 1 },
        },
      };
    });
    if (success) triggerHaptic('success');
    if (!success) triggerHaptic('light');
    return {
      ok: success,
      reason: success ? 'built' : failure,
      cost: def.buildCost,
      shortfall,
    };
  }, []);

  const upgradeStand = useCallback((slotId) => {
    let success = false;
    setState((s) => {
      const slot = s.slots[slotId];
      if (!slot?.built) return s;
      const cost = upgradeCostForStand(slot.standType, slot.level);
      if (s.coins < cost) return s;
      success = true;
      return {
        ...s,
        coins: s.coins - cost,
        slots: {
          ...s.slots,
          [slotId]: { ...slot, level: slot.level + 1 },
        },
      };
    });
    if (success) triggerHaptic('medium');
    if (!success) triggerHaptic('light');
    return success;
  }, []);

  const buyDecoration = useCallback((decorationId, cost) => {
    let success = false;
    setState((s) => {
      if (s.decorations[decorationId]) return s;
      if (s.coins < cost) return s;
      success = true;
      return {
        ...s,
        coins: s.coins - cost,
        decorations: { ...s.decorations, [decorationId]: true },
      };
    });
    if (success) triggerHaptic('light');
    return success;
  }, []);

  const dismissTutorial = useCallback(() => {
    setState((s) => ({ ...s, tutorialSeen: true }));
  }, []);

  return {
    state,
    addCoins,
    selectSlot,
    buildStand,
    upgradeStand,
    buyDecoration,
    dismissTutorial,
  };
}
