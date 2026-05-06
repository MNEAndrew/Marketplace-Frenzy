import { INITIAL_BUILT_SLOT } from './gameData.js';

const STORAGE_KEY = 'alley-market-save-v1';

const defaultDecorations = () => ({
  lanterns: false,
  lights: false,
  bench: false,
  plants: false,
});

/** Fresh game state when no save exists */
export function createInitialState() {
  return {
    version: 1,
    coins: 42,
    lifetimeEarned: 0,
    slots: {
      [INITIAL_BUILT_SLOT]: { built: true, standType: 'fruit', level: 1 },
    },
    decorations: defaultDecorations(),
    selectedSlotId: null,
    tutorialSeen: false,
  };
}

export function loadGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1 || typeof parsed.coins !== 'number') return createInitialState();
    return mergeWithDefaults(parsed);
  } catch {
    return createInitialState();
  }
}

function mergeWithDefaults(saved) {
  const initial = createInitialState();
  const slots = { ...initial.slots, ...(saved.slots || {}) };
  const decorations = { ...defaultDecorations(), ...(saved.decorations || {}) };
  return {
    ...initial,
    ...saved,
    slots,
    decorations,
    selectedSlotId: saved.selectedSlotId ?? null,
    lifetimeEarned: saved.lifetimeEarned ?? 0,
  };
}

export function saveGameState(state) {
  try {
    const { coins, lifetimeEarned, slots, decorations, tutorialSeen } = state;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        coins,
        lifetimeEarned,
        slots,
        decorations,
        tutorialSeen,
      })
    );
  } catch {
    /* quota / private mode */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
