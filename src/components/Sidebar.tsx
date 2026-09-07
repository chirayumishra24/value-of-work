interface SidebarProps {
  onHome: () => void
  onSettings: () => void
}

export function Sidebar({ onHome, onSettings }: SidebarProps) {
  return (
    <aside className="game-sidebar" aria-label="Game sidebar">
      <div className="sidebar-buttons">
        <button type="button" className="sidebar-btn home-btn" onClick={onHome} aria-label="Go to home">
          <span>🏠</span>
        </button>
        <button type="button" className="sidebar-btn settings-btn" onClick={onSettings} aria-label="Settings">
          <span>⚙️</span>
        </button>
        <button type="button" className="sidebar-btn book-btn" aria-label="Learning guide">
          <span>📖</span>
        </button>
      </div>
      <div className="book-stack" aria-label="Learning themes">
        <div className="book-spine green">SKILLS</div>
        <div className="book-spine red">EFFORT</div>
        <div className="book-spine blue">PEOPLE</div>
        <div className="book-spine purple">COMMUNITY</div>
      </div>
    </aside>
  )
}
