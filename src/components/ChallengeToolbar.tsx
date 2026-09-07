import type { ChallengeType } from '../game/types'

const challengeIcons: Record<string, { icon: string; label: string; color: string }> = {
  quiz: { icon: '❓', label: 'Quiz', color: '#e74c3c' },
  connect: { icon: '🔗', label: 'Arrange', color: '#3498db' },
  chain: { icon: '🧩', label: 'Match', color: '#2ecc71' },
  whatIf: { icon: '🔮', label: 'Predict', color: '#9b59b6' },
  detective: { icon: '🔍', label: 'Solve', color: '#f39c12' },
  act: { icon: '🎭', label: 'Act It Out', color: '#e91e63' },
  hidden: { icon: '👁', label: 'Look', color: '#00bcd4' },
  crisis: { icon: '⚡', label: 'Crisis', color: '#ff5722' },
}

interface ChallengeToolbarProps {
  activeType: ChallengeType
  roundTypes: ChallengeType[]
}

export function ChallengeToolbar({ activeType, roundTypes }: ChallengeToolbarProps) {
  const uniqueTypes = [...new Set(roundTypes)]
  return (
    <div className="challenge-toolbar" role="navigation" aria-label="Challenge types">
      <span className="toolbar-label">🤝 Work together, build a better community!</span>
      <div className="toolbar-icons">
        {uniqueTypes.map(type => {
          const info = challengeIcons[type] || { icon: '?', label: type, color: '#999' }
          return (
            <div
              key={type}
              className={`toolbar-icon ${activeType === type ? 'active' : ''}`}
              style={{ '--icon-color': info.color } as React.CSSProperties}
              title={info.label}
            >
              <span className="toolbar-icon-emoji">{info.icon}</span>
              <span className="toolbar-icon-label">{info.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
