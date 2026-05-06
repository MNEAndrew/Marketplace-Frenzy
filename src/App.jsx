import { useCallback, useMemo, useState } from 'react';
import { TopBar } from './components/TopBar.jsx';
import { AlleyView } from './components/AlleyView.jsx';
import { BottomMenu } from './components/BottomMenu.jsx';
import { BuildPanel } from './components/BuildPanel.jsx';
import { UpgradePanel } from './components/UpgradePanel.jsx';
import { DecorationPanel } from './components/DecorationPanel.jsx';
import { FloatingCoin } from './components/FloatingCoin.jsx';
import { useGameState } from './hooks/useGameState.js';
import { useCustomers } from './hooks/useCustomers.js';
import { builtStandCount, STAND_TYPES, upgradeCostForStand } from './utils/gameData.js';
import { formatCoins } from './utils/helpers.js';

let popupSeq = 0;

export default function App() {
  const game = useGameState();
  const { state, addCoins, selectSlot, buildStand, upgradeStand, buyDecoration, dismissTutorial } =
    game;

  const [tab, setTab] = useState('build');
  const [popups, setPopups] = useState([]);
  const [notice, setNotice] = useState(null);

  const pushPopup = useCallback((payload) => {
    popupSeq += 1;
    const id = `p-${popupSeq}`;
    setPopups((p) => [...p, { ...payload, id }]);
    setTimeout(() => {
      setPopups((p) => p.filter((x) => x.id !== id));
    }, 900);
  }, []);

  const pushNotice = useCallback((message, tone = 'good') => {
    const id = Date.now();
    setNotice({ id, message, tone });
    setTimeout(() => {
      setNotice((current) => (current?.id === id ? null : current));
    }, 1600);
  }, []);

  const onPurchase = useCallback(
    (e) => {
      addCoins(e.amount, 'earn');
      pushPopup({
        xPct: e.xPct,
        yPct: e.yPct,
        amount: e.amount,
        bonus: e.bonus,
      });
    },
    [addCoins, pushPopup]
  );

  const { customers } = useCustomers({ slots: state.slots, onPurchase });

  const builtCount = useMemo(() => builtStandCount(state.slots), [state.slots]);

  const handleBuild = useCallback(
    (slotId, typeId) => {
      const result = buildStand(slotId, typeId);
      const def = STAND_TYPES[typeId];
      if (result?.ok) {
        pushNotice(`${def.name} opened`);
        setTab('upgrade');
        return;
      }
      if (result?.reason === 'coins') {
        pushNotice(`Need ${formatCoins(result.shortfall)} more coins`, 'warn');
        return;
      }
      if (result?.reason === 'locked') {
        pushNotice('Build nearby stalls to open this pad', 'warn');
        return;
      }
      pushNotice('Choose an empty pad first', 'warn');
    },
    [buildStand, pushNotice]
  );

  const handleUpgrade = useCallback(
    (slotId) => {
      const slot = state.slots[slotId];
      if (!slot?.built) {
        pushNotice('Select a built stall first', 'warn');
        return;
      }
      const cost = upgradeCostForStand(slot.standType, slot.level);
      if (state.coins < cost) {
        pushNotice(`Need ${formatCoins(cost - state.coins)} more coins`, 'warn');
        return;
      }
      if (upgradeStand(slotId)) pushNotice('Stall upgraded');
    },
    [pushNotice, state.coins, state.slots, upgradeStand]
  );

  const handleDecorate = useCallback(
    (decorationId, cost) => {
      if (state.coins < cost) {
        pushNotice(`Need ${formatCoins(cost - state.coins)} more coins`, 'warn');
        return;
      }
      if (buyDecoration(decorationId, cost)) pushNotice('Decoration placed');
    },
    [buyDecoration, pushNotice, state.coins]
  );

  return (
    <div className="app-shell">
      <TopBar coins={state.coins} builtStands={builtCount} />

      <main className="app-main">
        <AlleyView
          slots={state.slots}
          decorations={state.decorations}
          customers={customers}
          selectedSlotId={state.selectedSlotId}
          builtCount={builtCount}
          onSelectSlot={selectSlot}
        />

        <div className="floating-layer" aria-hidden="true">
          {popups.map((p) => (
            <FloatingCoin key={p.id} xPct={p.xPct} yPct={p.yPct} amount={p.amount} bonus={p.bonus} />
          ))}
        </div>
      </main>

      <section className="panel-section">
        {notice && (
          <div className={`notice notice--${notice.tone}`} role="status" aria-live="polite">
            {notice.message}
          </div>
        )}
        {tab === 'build' && (
          <BuildPanel
            coins={state.coins}
            slots={state.slots}
            selectedSlotId={state.selectedSlotId}
            onBuild={handleBuild}
          />
        )}
        {tab === 'upgrade' && (
          <UpgradePanel
            coins={state.coins}
            slots={state.slots}
            selectedSlotId={state.selectedSlotId}
            onUpgrade={handleUpgrade}
          />
        )}
        {tab === 'decorate' && (
          <DecorationPanel coins={state.coins} decorations={state.decorations} onBuy={handleDecorate} />
        )}
      </section>

      <BottomMenu tab={tab} onTab={setTab} />

      {!state.tutorialSeen && (
        <div className="tutorial-overlay" role="dialog" aria-modal="true">
          <div className="tutorial-card">
            <h2>Welcome to your lane</h2>
            <p>
              Watch gentle shoppers stroll through your alley. Tap empty dotted pads to build new
              stands, then upgrade them as coins roll in.
            </p>
            <button type="button" className="btn-primary btn-large" onClick={dismissTutorial}>
              Begin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
