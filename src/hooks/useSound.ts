import { useCallback } from 'react'

type SoundKind = 'select' | 'reward' | 'warning' | 'restore'

const tones: Record<SoundKind, number[]> = {
  select: [392], reward: [523, 659, 784], warning: [220, 196], restore: [392, 523, 659, 784, 1046],
}

export function useSound(enabled: boolean) {
  return useCallback((kind: SoundKind) => {
    if (!enabled || typeof window === 'undefined') return
    const AudioContextClass = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    const now = context.currentTime
    tones[kind].forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const start = now + index * .09
      oscillator.type = kind === 'warning' ? 'triangle' : 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(.0001, start)
      gain.gain.exponentialRampToValueAtTime(.075, start + .018)
      gain.gain.exponentialRampToValueAtTime(.0001, start + .12)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(start)
      oscillator.stop(start + .14)
    })
    window.setTimeout(() => { void context.close() }, tones[kind].length * 90 + 180)
  }, [enabled])
}
