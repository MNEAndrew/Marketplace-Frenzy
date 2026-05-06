# Alley Market

Cozy, portrait-first web game: manage a narrow lane of market stands, watch shoppers stroll by, earn coins, build new stalls, upgrade them, and decorate the alley. Built with **React** and **Vite** for easy **Vercel** deployment and a clear path to **React Native** later (pure JS logic in `src/utils` + `src/hooks`, UI as separate components).

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Use browser dev tools device toolbar for a phone-sized portrait view.

## Build

```bash
npm run build
npm run preview   # optional: test production build
```

Output is in `dist/`.

## Deploy on Vercel

**Repository:** [github.com/MNEAndrew/Marketplace-Frenzy](https://github.com/MNEAndrew/Marketplace-Frenzy)

1. The app code is in the GitHub repo above.
2. In [Vercel](https://vercel.com), **Import** `MNEAndrew/Marketplace-Frenzy` from GitHub.
3. Framework preset: **Vite** (or “Other” with **Build Command** `npm run build` and **Output Directory** `dist`).
4. Deploy. No extra config is required for this single-page app.

Environment variables are not required for the MVP (save data uses `localStorage`).

## Project layout

| Path | Purpose |
|------|---------|
| `src/App.jsx` | Shell: tabs, tutorial overlay, wires hooks + alley |
| `src/components/AlleyView.jsx` | Bird’s-eye lane: buildings, path, slots, customers |
| `src/components/StandSlot.jsx` | Empty dotted pads vs built stalls |
| `src/components/Stand.jsx` | Stylized stand (awning, level badge) |
| `src/components/Customer.jsx` | Walking shoppers + speech bubbles |
| `src/components/FloatingCoin.jsx` | Coin popups |
| `src/components/TopBar.jsx` / `BottomMenu.jsx` | Stats + Build / Upgrade / Decorate |
| `src/components/BuildPanel.jsx` | Pick stand type for selected empty slot |
| `src/components/UpgradePanel.jsx` | Upgrade selected built stall |
| `src/components/DecorationPanel.jsx` | Lane decorations |
| `src/hooks/useGameState.js` | Coins, slots, decorations, save debounce |
| `src/hooks/useCustomers.js` | Spawn + movement + purchases |
| `src/utils/gameData.js` | **Balance & map:** stand stats, slot positions, decoration list |
| `src/utils/saveSystem.js` | `localStorage` load/save |
| `src/utils/haptics.js` | `navigator.vibrate` wrapper |
| `src/utils/helpers.js` | Formatting helpers |
| `src/styles/global.css` | Cozy visual system |

## Expanding the game

- **New stand type:** add an entry to `STAND_TYPES` and its id to `BUILD_MENU_ORDER` in `src/utils/gameData.js`.
- **More / different pads:** edit `ALLEY_SLOTS` (`rowPct` = vertical position % down the lane, `side` = `left` \| `right`).
- **Economy:** tweak `buildCost`, `baseIncome`, `baseUpgradeCost`, `UPGRADE_INCOME_PER_LEVEL`, and starting coins in `createInitialState` inside `src/utils/saveSystem.js`.
- **React Native:** reuse `gameData`, `saveSystem` (swap `localStorage` for `AsyncStorage`), `useGameState`, and `useCustomers`; reimplement components with RN views / StyleSheet.

## Reset save (development)

In the browser console: `localStorage.removeItem('alley-market-save-v1')` then reload.
