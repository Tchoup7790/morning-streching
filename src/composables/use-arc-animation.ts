// morning-streching/src/composables/createArcTimerAnimation.ts

import { gsap } from 'gsap'

// Constantes géométriques
const SIZE = 250
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Bips sonores (définis une seule fois)
const beepD = new Audio('/sounds/beep-down.mp3')
beepD.preload = 'auto'
const beepU = new Audio('/sounds/beep-up.mp3')
beepU.preload = 'auto'

export interface ArcAnimationControls {
  pause: () => void
  resume: () => void
  kill: () => void
}

// Utilitaires (nécessaires pour le template ArcTimer.vue)
export const ArcConstants = {
  SIZE,
  STROKE,
  CENTER: SIZE / 2,
  RADIUS,
  CIRCUMFERENCE,
}

/**
 * Crée et lance l'animation GSAP pour l'arc de progression.
 * C'est une utilitaire purement JS/GSAP, sans dépendance à Vue reactivity.
 *
 * @param progressCircle L'élément SVG circle.
 * @param duration La durée totale de l'animation en secondes.
 * @param onDone Callback lorsque le timer est complet.
 * @param onTimeUpdate Callback à chaque mise à jour du temps pour l'affichage.
 * @returns Les contrôles pour manipuler l'animation.
 */
export function createArcTimerAnimation(
  progressCircle: SVGCircleElement,
  duration: number,
  onDone: () => void,
  onTimeUpdate: (newRemaining: number) => void
): ArcAnimationControls {
  let gsapTween: gsap.core.Tween | null = null
  let lastRemaining = duration

  const anim = { progress: 0 }

  // Initialisation des sons et de l'arc
  try {
    beepU.currentTime = 0
    beepU.play()
  } catch (_) {}

  gsap.set(progressCircle, {
    strokeDashoffset: CIRCUMFERENCE,
  })

  // Création de l'animation GSAP
  gsapTween = gsap.to(anim, {
    progress: 1,
    duration,
    ease: 'none',
    onUpdate: () => {
      // 1. Mise à jour de l'offset de l'arc
      const offset = CIRCUMFERENCE * (1 - anim.progress)
      gsap.set(progressCircle, { strokeDashoffset: offset })

      // 2. Calcul du temps restant
      const newRemaining = Math.ceil(duration * (1 - anim.progress))

      // 3. Logique des bips de fin
      if (lastRemaining !== newRemaining && newRemaining <= 3 && newRemaining > 0) {
        try {
          beepD.currentTime = 0
          beepD.play()
        } catch (_) {}
      }

      // 4. Notification au composant
      onTimeUpdate(newRemaining)
      lastRemaining = newRemaining
    },
    onComplete: onDone,
  })

  // Retour des contrôles
  return {
    pause: () => gsapTween?.pause(),
    resume: () => gsapTween?.resume(),
    kill: () => gsapTween?.kill(),
  }
}
