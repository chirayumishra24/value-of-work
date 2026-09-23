import type { TeamState, TokenType } from '../game/types'

const tokenMeta: Record<TokenType, { icon: string; label: string }> = {
  work: { icon: '🌾', label: 'Work' },
  skill: { icon: '⚙️', label: 'Skill' },
  connection: { icon: '🔗', label: 'Connection' },
  cooperation: { icon: '🤝', label: 'Cooperation' },
  community: { icon: '💛', label: 'Community' },
}

interface TeamPanelProps {
  team: TeamState
  active: boolean
  side: 'left' | 'right'
}

export function TeamPanel({ team, active, side }: TeamPanelProps) {
  const mascotSrc = team.avatar || (team.id === 'A' ? '/assets/team_group_a.jpg' : '/assets/team_group_b.jpg')
  const totalTokens = Object.values(team.tokens).reduce((sum, v) => sum + v, 0)

  return (
    <aside className={`team-panel ${side} ${active ? 'active' : ''}`} aria-label={`${team.name}: ${team.score} points`}>
      <div className="team-badge-header">
        <span className="team-icon-badge" aria-hidden="true">👥</span>
        <div>
          <p className="team-label">{team.id === 'A' ? 'Team A' : 'Team B'}</p>
          <h2>{team.name}</h2>
        </div>
      </div>

      <div className="team-score-badge">
        <strong>{team.score}</strong>
        <span>points</span>
      </div>

      {active && <div className="turn-pill">🎯 Your turn</div>}

      <div className="token-collection-row" aria-label="Token collection progress">
        <p className="token-collect-label">Collect 5 work icons to complete your community!</p>
        <div className="token-slots">
          {(Object.keys(tokenMeta) as TokenType[]).map((type) => (
            <span
              className={`token-slot ${type} ${team.tokens[type] > 0 ? 'filled' : ''}`}
              key={type}
              title={`${tokenMeta[type].label}: ${team.tokens[type]}`}
            >
              <span className="token-slot-icon">{tokenMeta[type].icon}</span>
              {team.tokens[type] > 0 && <span className="token-slot-count">{team.tokens[type]}</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="team-mascot">
        <img src={mascotSrc} alt={`${team.name} mascot`} draggable={false} />
      </div>

      <div className="team-motivational">
        <span>{side === 'left' ? 'Answer, collect work icons and complete your community!' : 'Every kind of work makes a difference!'}</span>
      </div>
    </aside>
  )
}
