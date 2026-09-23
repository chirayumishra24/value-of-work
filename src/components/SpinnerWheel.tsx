import { useEffect, useRef, useState } from 'react'

import type { LifelineType } from '../game/types'

export interface SpinModifier {
  id: string
  label: string
  icon: string
  description: string
  effect: 'double' | 'token' | 'time' | 'bonusPoints' | 'teamwork' | 'normal' | 'freeLifeline'
  value?: number
  lifelineType?: LifelineType
}

export const SPIN_MODIFIERS: SpinModifier[] = [
  { id: 'double', label: '2x Points', icon: '🎯', description: 'Double points for this round!', effect: 'double', value: 2 },
  { id: 'freeFifty', label: 'Free 50:50', icon: '✂️', description: 'Free 50:50 Lifeline! (No points cost)', effect: 'freeLifeline', lifelineType: 'fiftyFifty' },
  { id: 'token', label: 'Bonus Token', icon: '💎', description: '+1 Community Token reward!', effect: 'token', value: 1 },
  { id: 'freeClue', label: 'Free Clue', icon: '💡', description: 'Free Community Clue! (No points cost)', effect: 'freeLifeline', lifelineType: 'clue' },
  { id: 'time', label: '+10s Time', icon: '⏱️', description: '10 seconds added to timer!', effect: 'time', value: 10 },
  { id: 'teamwork', label: 'Team Boost', icon: '🤝', description: 'Both teams get +3 on success!', effect: 'teamwork', value: 3 },
]

interface SpinnerWheelProps {
  onSpinResult?: (modifier: SpinModifier) => void
  onTick?: () => void
  disabled?: boolean
  currentModifier?: SpinModifier | null
}

export function SpinnerWheel({ onSpinResult, onTick, disabled = false, currentModifier }: SpinnerWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [pointerKick, setPointerKick] = useState(false)
  const animFrameRef = useRef<number | null>(null)
  const lastTickAngleRef = useRef(0)

  const handleSpin = () => {
    if (isSpinning || disabled) return

    setIsSpinning(true)
    const extraSpins = 4 + Math.floor(Math.random() * 3) // 4 to 6 full turns
    const sliceIndex = Math.floor(Math.random() * SPIN_MODIFIERS.length)
    const sliceDegrees = 360 / SPIN_MODIFIERS.length
    // Invert angle because wheel spins clockwise under top pointer
    const targetSliceAngle = (SPIN_MODIFIERS.length - sliceIndex) * sliceDegrees - sliceDegrees / 2
    const totalNewRotation = rotation + extraSpins * 360 + (targetSliceAngle - (rotation % 360)) + (Math.random() * 20 - 10)

    const startRot = rotation
    const distance = totalNewRotation - startRot
    const duration = 2800 // ms
    const startTime = performance.now()

    lastTickAngleRef.current = startRot

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3)
    }

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / duration)
      const currentRot = startRot + distance * easeOutCubic(progress)
      setRotation(currentRot)

      // Check if we passed a segment boundary to trigger tick
      const degreesSinceLastTick = Math.abs(currentRot - lastTickAngleRef.current)
      if (degreesSinceLastTick >= sliceDegrees) {
        lastTickAngleRef.current = currentRot
        setPointerKick(true)
        setTimeout(() => setPointerKick(false), 50)
        onTick?.()
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step)
      } else {
        setIsSpinning(false)
        const chosenModifier = SPIN_MODIFIERS[sliceIndex]
        onSpinResult?.(chosenModifier)
      }
    }

    animFrameRef.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <div className="spinner-wheel-interactive-wrap">
      {/* Top pointer needle */}
      <div className={`spinner-pointer ${pointerKick ? 'kicked' : ''}`} aria-hidden="true">
        ▼
      </div>

      {/* Rotating Wheel Plate */}
      <div
        className="spinner-wheel-disc"
        style={{ transform: `rotate(${rotation}deg)` }}
        aria-label="Challenge spinner wheel"
      >
        <img
          src="/assets/spinner_wheel.jpg"
          alt="Wheel segments"
          className="spinner-wheel-img"
          draggable={false}
        />
      </div>

      {/* Central Push-to-Spin button */}
      <button
        type="button"
        className={`spinner-center-btn ${isSpinning ? 'spinning' : ''}`}
        onClick={handleSpin}
        disabled={isSpinning || disabled}
        aria-label="Spin the wheel"
      >
        {isSpinning ? '...' : 'SPIN!'}
      </button>

      {/* Active Modifier Pill */}
      {currentModifier && (
        <div className="spinner-active-modifier" aria-live="polite">
          <span>{currentModifier.icon}</span> <b>{currentModifier.label}</b>
        </div>
      )}
    </div>
  )
}
