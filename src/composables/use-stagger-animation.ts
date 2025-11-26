import { gsap } from "gsap";
import { onMounted } from "vue";

// Applies a cascade input animation (fade-in and slide-up) to a set of elements
export function useStaggerAnimation(selector: string, delay: number = 0.3, stagger: number = 0.15) {
  onMounted(() => {
    // Animate all elements matching the selector when the component mounts
    gsap.from(selector, {
      y: 20, // Slight upward movement
      opacity: 0, // Start fully transparent
      duration: 0.7, // Duration of each element animation
      stagger: stagger, // Delay between each item to create a wave effect
      ease: "power2.out", // Smooth easing for a pleasant appearance
      delay: delay, // Global delay before the animation starts
    });
  });
}
