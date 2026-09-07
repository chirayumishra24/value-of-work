interface SpinnerWheelProps {
  spinning: boolean
}

export function SpinnerWheel({ spinning }: SpinnerWheelProps) {
  return (
    <div className={`spinner-wheel-container ${spinning ? 'spinning' : ''}`} aria-label="Challenge spinner wheel">
      <img
        src="/assets/spinner_wheel.jpg"
        alt="Challenge spinner wheel"
        className="spinner-wheel-img"
        draggable={false}
      />
    </div>
  )
}
