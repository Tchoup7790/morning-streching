import { gsap } from 'gsap'

// Animate all elements matching the selector when the component mounts
export function useStaggerAnimation(selector: string, delay: number = 0.3, duration: number = 0.7) {
  gsap.from(selector, {
    y: 20, // Slight upward movement
    opacity: 0, // Start fully transparent
    duration: duration, // Duration of each element animation
    stagger: 0.15, // Delay between each item to create a wave effect
    ease: 'power2.out', // Smooth easing for a pleasant appearance
    delay: delay, // Global delay before the animation starts
  })
}
