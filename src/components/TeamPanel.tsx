import type { TeamState, TokenType } from '../game/types'

const tokenMeta: Record<TokenType, { icon: string; label: string }> = {
  work: { icon: '✦', label: 'Work' },
  skill: { icon: '◆', label: 'Skill' },
  connection: { icon: '⛓', label: 'Connection' },
  cooperation: { icon: '♧', label: 'Cooperation' },
  community: { icon: '♥', label: 'Community' },
}

interface TeamPanelProps {
  team: TeamState
  active: boolean
  side: 'left' | 'right'
}

export function TeamPanel({ team, active, side }: TeamPanelProps) {
  return (
    <aside className={`team-panel ${side} ${active ? 'active' : ''}`} aria-label={`${team.name}: ${team.score} points`}>
      <div className="team-topline">
        <span className="team-avatar" aria-hidden="true">{team.id === 'A' ? '☀' : '☾'}</span>
        <div>
          <p className="eyebrow">{team.id === 'A' ? 'Team A' : 'Team B'}</p>
          <h2>{team.name}</h2>
        </div>
      </div>
      {active && <div className="turn-pill">Your turn</div>}
      <div className="score-row"><strong>{team.score}</strong><span>points</span></div>
      <div className="contribution-count"><span aria-hidden="true">✦</span> {team.contributions} community contributions</div>
      <div className="token-list" aria-label="Contribution tokens">
        {(Object.keys(tokenMeta) as TokenType[]).map((type) => (
          <span className={`token ${type} ${team.tokens[type] ? 'earned' : ''}`} key={type} title={`${tokenMeta[type].label}: ${team.tokens[type]}`}>
            <span aria-hidden="true">{tokenMeta[type].icon}</span><b>{team.tokens[type]}</b><span className="sr-only"> {tokenMeta[type].label} tokens</span>
          </span>
        ))}
      </div>
    </aside>
  )
}
