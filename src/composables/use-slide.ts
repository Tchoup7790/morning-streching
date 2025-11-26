import { gsap } from 'gsap'

// Slide-in or slide-out animation utility.
export function useSlide(
  el: Element,
  isIn: boolean,
  {
    y = 250,
    duration = 0.6,
    onComplete,
  }: {
    y?: number
    duration?: number
    onComplete?: gsap.Callback
  } = {}
) {
  if (isIn) {
    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        ease: 'power2.out',
        onComplete,
      }
    )
  } else {
    gsap.to(el, {
      opacity: 0,
      y,
      duration,
      ease: 'power2.in',
      onComplete,
    })
  }
}

