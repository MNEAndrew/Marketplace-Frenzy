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

let popupSeq = 0;

export default function App() {
  const game = useGameState();
  const { state, addCoins, selectSlot, buildStand, upgradeStand, buyDecoration, dismissTutorial } =
    game;

  const [tab, setTab] = useState('build');
  const [popups, setPopups] = useState([]);

  const pushPopup = useCallback((payload) => {
    popupSeq += 1;
    const id = `p-${popupSeq}`;
    setPopups((p) => [...p, { ...payload, id }]);
    setTimeout(() => {
      setPopups((p) => p.filter((x) => x.id !== id));
    }, 900);
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

  const builtCount = useMemo(
    () => Object.values(state.slots).filter((s) => s.built).length,
    [state.slots]
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
          onSelectSlot={selectSlot}
        />

        <div className="floating-layer" aria-hidden="true">
          {popups.map((p) => (
            <FloatingCoin key={p.id} xPct={p.xPct} yPct={p.yPct} amount={p.amount} bonus={p.bonus} />
          ))}
        </div>
      </main>

      <section className="panel-section">
        {tab === 'build' && (
          <BuildPanel
            coins={state.coins}
            slots={state.slots}
            selectedSlotId={state.selectedSlotId}
            onBuild={(slotId, typeId) => buildStand(slotId, typeId)}
          />
        )}
        {tab === 'upgrade' && (
          <UpgradePanel
            coins={state.coins}
            slots={state.slots}
            selectedSlotId={state.selectedSlotId}
            onUpgrade={(slotId) => upgradeStand(slotId)}
          />
        )}
        {tab === 'decorate' && (
          <DecorationPanel coins={state.coins} decorations={state.decorations} onBuy={buyDecoration} />
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
