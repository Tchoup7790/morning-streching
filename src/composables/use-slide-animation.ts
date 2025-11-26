import { gsap } from 'gsap'

/* Slide animation composable
   - isIn = true  → element slides in (from +y to 0) and fades in
   - isIn = false → element slides out (to +y) and fades out
*/
export function useSlideAnimation(
  element: Element,
  isIn: boolean,
  onComplete?: gsap.Callback,
  y: number = 250,
  duration: number = 0.6
) {
  if (isIn) {
    // Play "enter" animation
    gsap.fromTo(
      element,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        ease: 'power2.out',
        onComplete,
      }
    )
  } else {
    // Play "leave" animation
    gsap.to(element, {
      y,
      opacity: 0,
      duration,
      ease: 'power2.in',
      onComplete,
    })
  }
}
