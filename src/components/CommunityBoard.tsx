import { locations } from '../data/content'

interface CommunityBoardProps {
  completed: number
  selected: string | null
  onSelect: (id: string) => void
  rippleNodes?: string[]
  travel?: { item: string; nodes: string[]; nonce: number } | null
  reducedMotion: boolean
}

export function CommunityBoard({ completed, selected, onSelect, rippleNodes = [], travel, reducedMotion }: CommunityBoardProps) {
  const unlocked = Math.min(locations.length, Math.max(1, completed + 1))
  const selectedLocation = locations.find((location) => location.id === selected)

  return (
    <section className={`community-board ${reducedMotion ? 'reduced-motion' : ''}`} aria-label="Interactive community board">
      <div className="board-sky" aria-hidden="true"><span className="cloud one" /><span className="cloud two" /></div>
      <div className="board-header">
        <div>
          <p className="eyebrow">Build the community</p>
          <h2>Every contribution has a connection.</h2>
        </div>
        <div className="wellbeing" aria-label={`Community wellbeing ${Math.round((unlocked / locations.length) * 100)} percent`}>
          <span>Community wellbeing</span><b>{Math.round((unlocked / locations.length) * 100)}%</b>
          <div className="meter"><i style={{ width: `${(unlocked / locations.length) * 100}%` }} /></div>
        </div>
      </div>
      <div className="board-map">
        <svg className="connection-map" viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true">
          <path className={rippleNodes.length ? 'connection pulse-route' : 'connection'} d="M180 135 C315 95, 355 180, 465 205 S640 178, 725 150" />
          <path className={rippleNodes.length ? 'connection pulse-route delayed' : 'connection'} d="M465 205 C575 260, 650 325, 810 335" />
          <path className="connection" d="M460 210 C385 320, 292 343, 200 352" />
          <path className="connection" d="M720 153 C792 220, 825 258, 815 335" />
          <circle cx="457" cy="205" r="11" className="connection-dot" />
        </svg>
        <div className="road road-a" aria-hidden="true" /><div className="road road-b" aria-hidden="true" />
        {travel && <span key={travel.nonce} className={`travelling-item ${travel.nodes.join('-')}`} aria-label={`${travel.item} travelling through the work chain`}>{travel.item}</span>}
        {locations.map((location, index) => {
          const isUnlocked = index < unlocked
          const rippling = rippleNodes.includes(location.id)
          return (
            <button
              type="button"
              key={location.id}
              className={`community-node ${location.position} ${location.color} ${isUnlocked ? 'unlocked' : 'locked'} ${selected === location.id ? 'selected' : ''} ${rippling ? 'rippling' : ''}`}
              onClick={() => onSelect(location.id)}
              aria-pressed={selected === location.id}
            >
              <span className="node-building"><span className="building-roof" /><span className="node-icon" aria-hidden="true">{location.icon}</span></span>
              <span className="node-label">{location.title}</span>
              {!isUnlocked && <span className="lock-mark" aria-label="Unlock by completing community challenges">⌁</span>}
            </button>
          )
        })}
      </div>
      <div className="location-tip" aria-live="polite">
        {selectedLocation ? <><b>{selectedLocation.title}</b> <span>{selectedLocation.shortContribution}</span></> : <span>Select a community tile to discover its contribution.</span>}
      </div>
    </section>
  )
}
