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

      {/* Connection paths between buildings */}
      <svg className="connection-map" viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true">
        <path className={rippleNodes.length ? 'connection pulse-route' : 'connection'} d="M150 200 C250 150, 300 180, 400 200" />
        <path className={rippleNodes.length ? 'connection pulse-route delayed' : 'connection'} d="M400 200 C500 180, 550 150, 650 170" />
        <path className="connection" d="M400 200 C420 260, 450 300, 500 320" />
        <path className="connection" d="M650 170 C720 200, 750 260, 780 300" />
        <path className="connection" d="M500 320 C600 350, 700 340, 780 300" />
        {/* Arrows on paths */}
        <circle cx="400" cy="200" r="8" className="connection-dot" />
        <circle cx="650" cy="170" r="6" className="connection-dot" />
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
                  <img src="/assets/mascot_boy.jpg" alt="Team A" draggable={false} />
                  <span className="pawn-badge">A</span>
                </div>
              )}
              {hasPawnB && (
                <div
                  className={`board-pawn team-b-pawn ${activeTeam === 'B' ? 'active-pawn' : ''} ${rippling ? 'pawn-hopping' : ''}`}
                  title="Team B Mascot"
                >
                  <img src="/assets/mascot_girl.jpg" alt="Team B" draggable={false} />
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
