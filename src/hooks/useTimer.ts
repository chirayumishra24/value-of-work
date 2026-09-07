import { useEffect, useState } from 'react'

export function useTimer(duration: number, running: boolean, resetKey: string | number) {
  const [seconds, setSeconds] = useState(duration)
  useEffect(() => { setSeconds(duration) }, [duration, resetKey])
  useEffect(() => {
    if (!running || seconds <= 0) return
    const timer = window.setInterval(() => setSeconds(current => Math.max(0, current - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [running, seconds])
  return seconds
}
