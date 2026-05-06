/**
 * Stand definitions, alley slot layout, upgrade scaling.
 * Edit STAND_TYPES / ALLEY_SLOTS to add stands or change map layout.
 */

export const UPGRADE_INCOME_PER_LEVEL = 0.28;
export const UPGRADE_COST_BASE_MULT = 1.35;

/** @typedef {'fruit'|'flower'|'tea'|'bakery'|'boba'|'book'} StandTypeId */

/** @type {Record<string, { id: string, name: string, emoji: string, buildCost: number, baseIncome: number, baseUpgradeCost: number, description: string, colors: { awning: string, body: string, accent: string } }>} */
export const STAND_TYPES = {
  fruit: {
    id: 'fruit',
    name: 'Fruit Stand',
    emoji: '🍊',
    buildCost: 28,
    baseIncome: 4,
    baseUpgradeCost: 12,
    description: 'Fresh picks every morning.',
    colors: { awning: '#e8a87c', body: '#fff5eb', accent: '#c9764e' },
  },
  flower: {
    id: 'flower',
    name: 'Flower Stand',
    emoji: '🌸',
    buildCost: 55,
    baseIncome: 7,
    baseUpgradeCost: 18,
    description: 'Petals, pollen, and perfume.',
    colors: { awning: '#f4b8d5', body: '#fff8fb', accent: '#d4729c' },
  },
  tea: {
    id: 'tea',
    name: 'Tea Stall',
    emoji: '🍵',
    buildCost: 110,
    baseIncome: 11,
    baseUpgradeCost: 26,
    description: 'Steam, spice, and calm.',
    colors: { awning: '#a8d4c8', body: '#f2faf7', accent: '#5a9b87' },
  },
  bakery: {
    id: 'bakery',
    name: 'Bakery',
    emoji: '🥐',
    buildCost: 185,
    baseIncome: 14,
    baseUpgradeCost: 32,
    description: 'Butter layers and warm ovens.',
    colors: { awning: '#e8d4a8', body: '#fffbf2', accent: '#b8925a' },
  },
  boba: {
    id: 'boba',
    name: 'Boba Booth',
    emoji: '🧋',
    buildCost: 320,
    baseIncome: 18,
    baseUpgradeCost: 40,
    description: 'Chewy pearls, silky tea.',
    colors: { awning: '#c9b8e8', body: '#faf8ff', accent: '#8b6fc7' },
  },
  book: {
    id: 'book',
    name: 'Book Nook',
    emoji: '📚',
    buildCost: 480,
    baseIncome: 22,
    baseUpgradeCost: 48,
    description: 'Stories between covers.',
    colors: { awning: '#b8c9e8', body: '#f7f9ff', accent: '#5a7ab8' },
  },
};

/** Vertical position along alley (0 = top entrance, 100 = bottom). Side placement. */
export const ALLEY_SLOTS = [
  { id: 'a1', side: 'left', rowPct: 11 },
  { id: 'a2', side: 'right', rowPct: 18 },
  { id: 'a3', side: 'left', rowPct: 28 },
  { id: 'a4', side: 'right', rowPct: 36 },
  { id: 'a5', side: 'left', rowPct: 46 },
  { id: 'a6', side: 'right', rowPct: 54 },
  { id: 'a7', side: 'left', rowPct: 64 },
  { id: 'a8', side: 'right', rowPct: 72 },
  { id: 'a9', side: 'left', rowPct: 82 },
  { id: 'a10', side: 'right', rowPct: 90 },
];

/** Slot id -> initial stand on first load only (see saveSystem merge). */
export const INITIAL_BUILT_SLOT = 'a2';

/** Ordered list of stand ids available in Build panel */
export const BUILD_MENU_ORDER = ['fruit', 'flower', 'tea', 'bakery', 'boba', 'book'];

export function incomeForStand(standTypeId, level) {
  const def = STAND_TYPES[standTypeId];
  if (!def || level < 1) return 0;
  const bonus = 1 + (level - 1) * UPGRADE_INCOME_PER_LEVEL;
  return Math.max(1, Math.round(def.baseIncome * bonus));
}

export function upgradeCostForStand(standTypeId, currentLevel) {
  const def = STAND_TYPES[standTypeId];
  if (!def || currentLevel < 1) return Infinity;
  return Math.ceil(def.baseUpgradeCost * Math.pow(UPGRADE_COST_BASE_MULT, currentLevel - 1));
}

export function decorationDefs() {
  return [
    { id: 'lanterns', name: 'Lanterns', cost: 45, emoji: '🏮' },
    { id: 'lights', name: 'String lights', cost: 72, emoji: '✨' },
    { id: 'bench', name: 'Garden bench', cost: 38, emoji: '🪑' },
    { id: 'plants', name: 'Extra plants', cost: 52, emoji: '🪴' },
  ];
}
