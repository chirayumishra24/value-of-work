interface SidebarProps {
  onHome: () => void
  onSettings: () => void
  onOpenGuide: (tab?: 'concepts' | 'careers' | 'tokens') => void
}

export function Sidebar({ onHome, onSettings, onOpenGuide }: SidebarProps) {
  return (
    <aside className="game-sidebar" aria-label="Game sidebar">
      <div className="sidebar-buttons">
        <button type="button" className="sidebar-btn home-btn" onClick={onHome} aria-label="Go to home">
          <span>🏠</span>
        </button>
        <button type="button" className="sidebar-btn settings-btn" onClick={onSettings} aria-label="Settings">
          <span>⚙️</span>
        </button>
        <button type="button" className="sidebar-btn book-btn" onClick={() => onOpenGuide('concepts')} aria-label="Learning guide">
          <span>📖</span>
        </button>
      </div>
      <div className="book-stack" aria-label="Learning themes">
        <button type="button" className="book-spine green" onClick={() => onOpenGuide('careers')} aria-label="Skills chapter">SKILLS</button>
        <button type="button" className="book-spine red" onClick={() => onOpenGuide('concepts')} aria-label="Effort chapter">EFFORT</button>
        <button type="button" className="book-spine blue" onClick={() => onOpenGuide('careers')} aria-label="People chapter">PEOPLE</button>
        <button type="button" className="book-spine purple" onClick={() => onOpenGuide('tokens')} aria-label="Community chapter">COMMUNITY</button>
      </div>
    </aside>
  )
}
