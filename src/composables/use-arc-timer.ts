import { gsap } from 'gsap'

// Base geometry
const SIZE = 250
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Preloaded audio assets
const beepDown = new Audio('/sounds/beep-down.mp3')
const beepUp = new Audio('/sounds/beep-up.mp3')
beepDown.preload = 'auto'
beepUp.preload = 'auto'

export interface ArcTimerControls {
  pause: () => void
  resume: () => void
  kill: () => void
}

export const ArcConstants = {
  SIZE,
  STROKE,
  CENTER: SIZE / 2,
  RADIUS,
  CIRCUMFERENCE,
}

// Creates a GSAP-powered circular countdown animation.
export function useArcTimer(
  circle: SVGCircleElement,
  duration: number,
  onComplete: () => void,
  onTick: (remaining: number) => void
): ArcTimerControls {
  let tween: gsap.core.Tween | null = null
  let lastRemaining = duration

  const anim = { progress: 0 }

  // Play initial cue sound
  try {
    beepUp.currentTime = 0
    beepUp.play()
  } catch { }

  // Reset arc position
  gsap.set(circle, {
    strokeDashoffset: CIRCUMFERENCE,
  })

  tween = gsap.to(anim, {
    progress: 1,
    duration,
    ease: 'none',

    onUpdate: () => {
      const offset = CIRCUMFERENCE * (1 - anim.progress)
      gsap.set(circle, { strokeDashoffset: offset })

      const remaining = Math.ceil(duration * (1 - anim.progress))

      // Last 3-second warning beep
      if (remaining !== lastRemaining && remaining <= 3 && remaining > 0) {
        try {
          beepDown.currentTime = 0
          beepDown.play()
        } catch { }
      }

      onTick(remaining)
      lastRemaining = remaining
    },

    onComplete,
  })

  return {
    pause: () => tween?.pause(),
    resume: () => tween?.resume(),
    kill: () => tween?.kill(),
  }
}
