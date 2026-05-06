export function BottomMenu({ tab, onTab }) {
  const items = [
    { id: 'build', label: 'Build', emoji: '🛠️' },
    { id: 'upgrade', label: 'Upgrade', emoji: '⬆️' },
    { id: 'decorate', label: 'Decorate', emoji: '✨' },
  ];

  return (
    <nav className="bottom-menu" aria-label="Market actions">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`bottom-menu__btn ${tab === item.id ? 'bottom-menu__btn--active' : ''}`}
          onClick={() => onTab(item.id)}
        >
          <span className="bottom-menu__emoji" aria-hidden="true">
            {item.emoji}
          </span>
          <span className="bottom-menu__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
