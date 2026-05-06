export function Customer({ customer }) {
  const { yPct, phase, bubble, hue, isVip } = customer;
  const bob = phase === 'buy' ? 0 : Math.sin((customer.id?.length || 1) * 0.15 + yPct * 0.2) * 2;

  return (
    <div
      className={`customer ${phase === 'buy' ? 'customer--buying' : ''} ${isVip ? 'customer--vip' : ''}`}
      style={{
        left: '50%',
        top: `${yPct}%`,
        transform: `translate(-50%, -50%) translateY(${bob}px)`,
        '--cust-hue': `${hue}deg`,
      }}
    >
      <div className="customer__body" aria-hidden="true">
        <span className="customer__hat">🙂</span>
      </div>
      {bubble && phase === 'buy' && (
        <div className="customer__bubble">
          <span>{bubble}</span>
        </div>
      )}
    </div>
  );
}
