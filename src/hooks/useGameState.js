import { useCallback, useEffect, useRef, useState } from 'react';
import { STAND_TYPES, upgradeCostForStand } from '../utils/gameData.js';
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
    if (!def) return false;
    let success = false;
    setState((s) => {
      const slot = s.slots[slotId];
      if (slot?.built) return s;
      if (s.coins < def.buildCost) return s;
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
    return success;
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
