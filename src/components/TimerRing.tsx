interface TimerRingProps {
  seconds: number
  totalSeconds: number
  enabled: boolean
  paused?: boolean
}

export function TimerRing({ seconds, totalSeconds, enabled, paused = false }: TimerRingProps) {
  const size = 52
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const fraction = enabled && totalSeconds > 0 ? Math.max(0, Math.min(1, seconds / totalSeconds)) : 1
  const strokeDashoffset = circumference * (1 - fraction)

  const isUrgent = enabled && seconds <= 5 && !paused
  const isWarning = enabled && seconds <= 10 && seconds > 5 && !paused

  const ringColor = !enabled
    ? '#95a5a6'
    : isUrgent
    ? '#e74c3c'
    : isWarning
    ? '#f39c12'
    : '#2ecc71'

  return (
    <div className={`timer-ring-container ${isUrgent ? 'pulse-urgent' : ''}`} aria-label={`Timer: ${enabled ? `${seconds} seconds remaining` : 'Timer disabled'}`}>
      <svg width={size} height={size} className="timer-ring-svg">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        {enabled && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease' }}
          />
        )}
      </svg>
      <div className="timer-ring-label">
        <span className="timer-ring-icon">{paused ? '⏸' : '⏱'}</span>
        <b>{enabled ? `${seconds}s` : 'Off'}</b>
      </div>
    </div>
  )
}
