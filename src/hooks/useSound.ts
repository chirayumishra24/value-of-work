import { useCallback } from 'react'

export type SoundKind = 'select' | 'reward' | 'warning' | 'restore' | 'spinTick' | 'fanfare' | 'buzzer' | 'whoop' | 'coin'

const tones: Record<SoundKind, number[]> = {
  select: [440],
  reward: [523, 659, 784],
  warning: [220, 196],
  restore: [392, 523, 659, 784, 1046],
  spinTick: [880],
  fanfare: [523, 659, 784, 1046, 1318],
  buzzer: [180, 150],
  whoop: [300, 600],
  coin: [987, 1318],
}

export function useSound(enabled: boolean) {
  return useCallback((kind: SoundKind) => {
    if (!enabled || typeof window === 'undefined') return
    const AudioContextClass = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    try {
      const context = new AudioContextClass()
      const now = context.currentTime

      if (kind === 'spinTick') {
        const osc = context.createOscillator()
        const gain = context.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(600, now)
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.03)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
        osc.connect(gain).connect(context.destination)
        osc.start(now)
        osc.stop(now + 0.035)
        window.setTimeout(() => { void context.close() }, 100)
        return
      }

      if (kind === 'whoop') {
        const osc = context.createOscillator()
        const gain = context.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(320, now)
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.18)
        gain.gain.setValueAtTime(0.001, now)
        gain.gain.linearRampToValueAtTime(0.08, now + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
        osc.connect(gain).connect(context.destination)
        osc.start(now)
        osc.stop(now + 0.2)
        window.setTimeout(() => { void context.close() }, 250)
        return
      }

      tones[kind].forEach((frequency, index) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        const start = now + index * 0.08
        oscillator.type = kind === 'warning' || kind === 'buzzer' ? 'sawtooth' : 'sine'
        oscillator.frequency.value = frequency
        const peak = kind === 'fanfare' ? 0.1 : 0.07
        gain.gain.setValueAtTime(0.0001, start)
        gain.gain.exponentialRampToValueAtTime(peak, start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + (kind === 'fanfare' ? 0.25 : 0.14))
        oscillator.connect(gain).connect(context.destination)
        oscillator.start(start)
        oscillator.stop(start + (kind === 'fanfare' ? 0.28 : 0.16))
      })

      const totalDuration = tones[kind].length * 80 + 300
      window.setTimeout(() => { void context.close() }, totalDuration)
    } catch {
      // Audio context might be restricted or blocked by browser autoplay policy
    }
  }, [enabled])
}
