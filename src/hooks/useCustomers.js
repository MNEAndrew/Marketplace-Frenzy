import { useCallback, useEffect, useRef, useState } from 'react';
import { ALLEY_SLOTS, incomeForStand } from '../utils/gameData.js';

const BUBBLES = [
  'Fresh fruit!',
  'So cozy!',
  'One tea please!',
  'Smells lovely!',
  'More petals!',
  'Warm bread!',
  'Yummy!',
  'New chapter!',
];

const VIP_BUBBLES = ['Market tour!', 'Treat myself!', 'Best lane!', 'Extra, please!'];

let customerSeq = 0;

function nextId() {
  customerSeq += 1;
  return `c-${Date.now()}-${customerSeq}`;
}

/**
 * @param {object} opts
 * @param {Record<string, { built: boolean, standType?: string, level?: number }>} opts.slots
 * @param {(e: { slotId: string, amount: number, xPct: number, yPct: number, bonus: boolean }) => void} opts.onPurchase
 */
export function useCustomers({ slots, onPurchase }) {
  const [customers, setCustomers] = useState([]);
  const slotsRef = useRef(slots);
  slotsRef.current = slots;

  const onPurchaseRef = useRef(onPurchase);
  onPurchaseRef.current = onPurchase;

  const spawnCustomer = useCallback(() => {
    const id = nextId();
    setCustomers((list) => [
      ...list,
      {
        id,
        yPct: -4,
        phase: 'walk',
        visited: {},
        bubble: null,
        hue: (Math.random() * 360) | 0,
        mood: Math.random() < 0.5 ? 'smile' : Math.random() < 0.75 ? 'star' : 'cap',
        sway: Math.random() * 1.8,
        isVip: Math.random() < 0.09,
        speed: 3.6 + Math.random() * 4.4,
      },
    ]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const built = Object.entries(slotsRef.current).filter(([, v]) => v.built);
      if (built.length === 0) return;
      if (Math.random() < 0.52) spawnCustomer();
    }, 1150);
    return () => clearInterval(interval);
  }, [spawnCustomer]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      setCustomers((list) => {
        const next = [];
        for (const c of list) {
          if (c.phase === 'leave' || c.yPct > 108) continue;

          const slotsMap = slotsRef.current;
          let updated = { ...c };

          if (c.phase === 'buy' && c.buyUntil && now < c.buyUntil) {
            next.push(updated);
            continue;
          }
          if (c.phase === 'buy' && c.buyUntil && now >= c.buyUntil) {
            updated = { ...c, phase: 'walk', buyUntil: null, bubble: null };
          }

          if (updated.phase === 'walk') {
            const newY = updated.yPct + updated.speed * dt * 18;
            let stopped = false;

            for (const slotDef of ALLEY_SLOTS) {
              if (updated.visited[slotDef.id]) continue;
              const slotState = slotsMap[slotDef.id];
              if (!slotState?.built) continue;
              const row = slotDef.rowPct;
              if (newY >= row - 0.8 && updated.yPct < row + 0.5) {
                if (Math.random() < 0.62) {
                  const bonus = updated.isVip ? 1.65 : 1;
                  const amount = Math.round(
                    incomeForStand(slotState.standType, slotState.level) * bonus
                  );
                  const xPct = 50 + (Math.random() * 10 - 5);
                  onPurchaseRef.current?.({
                    slotId: slotDef.id,
                    amount,
                    xPct,
                    yPct: row,
                    bonus: updated.isVip,
                  });
                  updated = {
                    ...updated,
                    yPct: row,
                    phase: 'buy',
                    buyUntil: now + 650 + Math.random() * 400,
                    visited: { ...updated.visited, [slotDef.id]: true },
                    bubble: updated.isVip
                      ? VIP_BUBBLES[(Math.random() * VIP_BUBBLES.length) | 0]
                      : BUBBLES[(Math.random() * BUBBLES.length) | 0],
                  };
                  stopped = true;
                  break;
                }
              }
            }

            if (!stopped) {
              updated = { ...updated, yPct: newY };
            }
          }

          if (updated.yPct > 104) continue;
          next.push(updated);
        }
        return next;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCustomers((list) => list.filter((c) => c.yPct < 120));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return { customers, spawnCustomer };
}
