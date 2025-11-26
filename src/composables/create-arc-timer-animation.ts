import { gsap } from 'gsap'

/* Base constants for the circular timer geometry */
const SIZE = 250
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/* Preloaded audio cues */
const beepD = new Audio('/sounds/beep-down.mp3')
beepD.preload = 'auto'
const beepU = new Audio('/sounds/beep-up.mp3')
beepU.preload = 'auto'

/* Controls returned by the GSAP animation */
export interface ArcAnimationControls {
  pause: () => void
  resume: () => void
  kill: () => void
}

/* Exported geometry constants for external components */
export const ArcConstants = {
  SIZE,
  STROKE,
  CENTER: SIZE / 2,
  RADIUS,
  CIRCUMFERENCE,
}

/**
 * Creates and runs a circular timer animation using GSAP.
 * Handles: arc animation, timing updates, sound cues.
 */
export function createArcTimerAnimation(
  progressCircle: SVGCircleElement, // target SVG arc
  duration: number, // total duration in seconds
  onDone: () => void, // callback when timer completes
  onTimeUpdate: (newRemaining: number) => void // callback for UI updates
): ArcAnimationControls {
  let gsapTween: gsap.core.Tween | null = null
  let lastRemaining = duration

  // Internal progress driver for GSAP
  const anim = { progress: 0 }

  /* Play start sound */
  try {
    beepU.currentTime = 0
    beepU.play()
  } catch (_) { }

  /* Reset arc to full circumference */
  gsap.set(progressCircle, {
    strokeDashoffset: CIRCUMFERENCE,
  })

  /* Start arc animation */
  gsapTween = gsap.to(anim, {
    progress: 1,
    duration,
    ease: 'none',

    /* Called on every frame while animating */
    onUpdate: () => {
      // Move arc position
      const offset = CIRCUMFERENCE * (1 - anim.progress)
      gsap.set(progressCircle, { strokeDashoffset: offset })

      // Compute remaining time
      const newRemaining = Math.ceil(duration * (1 - anim.progress))

      // Play countdown beeps (3 → 1)
      if (lastRemaining !== newRemaining && newRemaining <= 3 && newRemaining > 0) {
        try {
          beepD.currentTime = 0
          beepD.play()
        } catch (_) { }
      }

      // Push update to parent
      onTimeUpdate(newRemaining)

      lastRemaining = newRemaining
    },

    /* Called once animation reaches the end */
    onComplete: onDone,
  })

  /* Expose animation controls to caller */
  return {
    pause: () => gsapTween?.pause(),
    resume: () => gsapTween?.resume(),
    kill: () => gsapTween?.kill(),
  }
}
