import { gsap } from 'gsap'
import { beepDown, beepUp } from './use-sound'

// Base geometry
const SIZE = 250
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

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
    gsap.delayedCall(0.55, () => {
      beepUp.stop()
      beepUp.play()
    })
  } catch { }

  // Reset arc position
  gsap.set(circle, {
    strokeDashoffset: CIRCUMFERENCE,
  })

  tween = gsap.to(anim, {
    progress: 1,
    duration,
    delay: 0.55,
    ease: 'none',

    onUpdate: () => {
      const offset = CIRCUMFERENCE * (1 - anim.progress)
      gsap.set(circle, { strokeDashoffset: offset })

      const remaining = Math.ceil(duration * (1 - anim.progress))

      // Last 3-second warning beep
      if (remaining !== lastRemaining && remaining <= 3 && remaining > 0) {
        try {
          beepDown.stop()
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
