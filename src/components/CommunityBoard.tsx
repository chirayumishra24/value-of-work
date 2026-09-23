import { locations } from '../data/content'
import { SpinnerWheel, type SpinModifier } from './SpinnerWheel'

interface CommunityBoardProps {
  completed: number
  selected: string | null
  onSelect: (id: string) => void
  rippleNodes?: string[]
  travel?: { item: string; nodes: string[]; nonce: number } | null
  reducedMotion: boolean
  teamALocation?: string
  teamBLocation?: string
  activeTeam?: 'A' | 'B'
  teamAAvatar?: string
  teamBAvatar?: string
  onSpinResult?: (modifier: SpinModifier) => void
  onSpinTick?: () => void
  currentModifier?: SpinModifier | null
}

export function CommunityBoard({
  completed,
  selected,
  onSelect,
  rippleNodes = [],
  travel,
  reducedMotion,
  teamALocation = 'farm',
  teamBLocation = 'shop',
  activeTeam = 'A',
  teamAAvatar,
  teamBAvatar,
  onSpinResult,
  onSpinTick,
  currentModifier,
}: CommunityBoardProps) {
  const unlocked = Math.min(locations.length, Math.max(1, completed + 1))
  const selectedLocation = locations.find((location) => location.id === selected)

  return (
    <section className={`community-board ${reducedMotion ? 'reduced-motion' : ''}`} aria-label="Interactive community board">
      {/* Board background image */}
      <img src="/assets/board_background.jpg" alt="" className="board-bg-img" aria-hidden="true" draggable={false} />

      {/* Connection paths between buildings following the road */}
      <svg className="connection-map" viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true">
        <path className={rippleNodes.length ? 'connection pulse-route' : 'connection'} d="M145 375 C210 340, 265 310, 315 295" />
        <path className={rippleNodes.length ? 'connection pulse-route delayed' : 'connection'} d="M315 295 C330 250, 335 210, 350 175" />
        <path className="connection" d="M350 175 C450 120, 520 125, 585 140" />
        <path className="connection" d="M585 140 C640 180, 680 210, 715 250" />
        <path className="connection" d="M715 250 C760 300, 810 340, 855 375" />
        {/* Connection dots on road stops */}
        <circle cx="315" cy="295" r="6" className="connection-dot" />
        <circle cx="585" cy="140" r="6" className="connection-dot" />
        <circle cx="715" cy="250" r="6" className="connection-dot" />
      </svg>

      {/* Interactive Spinner wheel in center */}
      <div className="board-spinner-wrapper">
        <SpinnerWheel
          onSpinResult={onSpinResult}
          onTick={onSpinTick}
          currentModifier={currentModifier}
        />
      </div>

      {/* Travelling item animation */}
      {travel && <span key={travel.nonce} className={`travelling-item ${travel.nodes.join('-')}`} aria-label={`${travel.item} travelling through the work chain`}>{travel.item}</span>}

      {/* Building nodes */}
      {locations.map((location, index) => {
        const isUnlocked = index < unlocked
        const rippling = rippleNodes.includes(location.id)
        const hasPawnA = teamALocation === location.id
        const hasPawnB = teamBLocation === location.id

        return (
          <button
            type="button"
            key={location.id}
            className={`community-node ${location.position} ${location.color} ${isUnlocked ? 'unlocked' : 'locked'} ${selected === location.id ? 'selected' : ''} ${rippling ? 'rippling' : ''}`}
            onClick={() => onSelect(location.id)}
            aria-pressed={selected === location.id}
          >
            <div className="node-building-img">
              {location.buildingImage ? (
                <img src={location.buildingImage} alt={location.title} draggable={false} />
              ) : (
                <span className="node-icon" aria-hidden="true">{location.icon}</span>
              )}
            </div>
            <span className="node-label">{location.title}</span>
            {!isUnlocked && <span className="lock-mark" aria-label="Locked">🔒</span>}

            {/* Mascot Pawns on Building Nodes */}
            <div className="node-pawns-container">
              {hasPawnA && (
                <div
                  className={`board-pawn team-a-pawn ${activeTeam === 'A' ? 'active-pawn' : ''} ${rippling ? 'pawn-hopping' : ''}`}
                  title="Team A Mascot"
                >
                  <img src={teamAAvatar || '/assets/team_group_a.jpg'} alt="Team A" draggable={false} />
                  <span className="pawn-badge">A</span>
                </div>
              )}
              {hasPawnB && (
                <div
                  className={`board-pawn team-b-pawn ${activeTeam === 'B' ? 'active-pawn' : ''} ${rippling ? 'pawn-hopping' : ''}`}
                  title="Team B Mascot"
                >
                  <img src={teamBAvatar || '/assets/team_group_b.jpg'} alt="Team B" draggable={false} />
                  <span className="pawn-badge">B</span>
                </div>
              )}
            </div>
          </button>
        )
      })}

      {/* Location tooltip */}
      <div className="location-tip" aria-live="polite">
        {selectedLocation ? <><b>{selectedLocation.title}</b> <span>{selectedLocation.shortContribution}</span></> : <span>Select a community tile to discover its contribution.</span>}
      </div>

      {/* Wellbeing meter */}
      <div className="wellbeing-badge" aria-label={`Community wellbeing ${Math.round((unlocked / locations.length) * 100)} percent`}>
        <span className="wellbeing-label">Community wellbeing</span>
        <b>{Math.round((unlocked / locations.length) * 100)}%</b>
        <div className="meter"><i style={{ width: `${(unlocked / locations.length) * 100}%` }} /></div>
      </div>
    </section>
  )
}
