export function Customer({ customer }) {
  const { yPct, phase, bubble, hue, isVip, mood, sway = 0 } = customer;
  const bob = phase === 'buy' ? 0 : Math.sin((customer.id?.length || 1) * 0.15 + yPct * 0.2) * 2;
  const face = mood === 'star' ? '☺' : mood === 'cap' ? '•' : '◦';

  return (
    <div
      className={`customer ${phase === 'buy' ? 'customer--buying' : ''} ${isVip ? 'customer--vip' : ''}`}
      style={{
        left: '50%',
        top: `${yPct}%`,
        transform: `translate(calc(-50% + ${sway}px), -50%) translateY(${bob}px)`,
        '--cust-hue': `${hue}deg`,
      }}
    >
      <div className="customer__body" aria-hidden="true">
        <span className="customer__hat">{isVip ? '★' : face}</span>
      </div>
      {bubble && phase === 'buy' && (
        <div className="customer__bubble">
          <span>{bubble}</span>
        </div>
      )}
    </div>
  );
}
